"""
app.py
AI Stock Analyst — Streamlit web application.
Orchestrates all modules: data fetching, ML prediction, SHAP explanation, LLM brief.

Run: streamlit run app.py
"""
import sys
print("PYTHON USED:", sys.executable)
import logging
import os
import sys
import time
from datetime import datetime

import streamlit as st

# Project root on path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from data.collector import fetch_ohlcv, fetch_current_price, get_ticker_info
from data.indicators import compute_indicators
from data.macro_fetcher import fetch_macro_snapshot, fetch_vix_series, interpret_vix
from data.news_scraper import fetch_news, format_headlines_for_prompt
from ml.features import build_features, get_latest_feature_row
from ml.predict import predict_signal, load_model
from ml.explainer import compute_shap_values, get_top_shap_features, build_waterfall_chart, format_shap_for_prompt
from llm.prompt_builder import build_prompt
from llm.analyst import generate_brief, get_provider_status
from utils.cache import get as cache_get, set as cache_set, get_cache_age_seconds

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ── Page config ────────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="AI Stock Analyst",
    page_icon="📈",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Custom CSS ─────────────────────────────────────────────────────────────────
st.markdown("""
<style>
.signal-buy   { background:#d4edda; color:#155724; padding:14px 24px; border-radius:10px;
                font-size:2rem; font-weight:700; text-align:center; border:1.5px solid #28a745; }
.signal-sell  { background:#f8d7da; color:#721c24; padding:14px 24px; border-radius:10px;
                font-size:2rem; font-weight:700; text-align:center; border:1.5px solid #dc3545; }
.signal-hold  { background:#e2e3e5; color:#383d41; padding:14px 24px; border-radius:10px;
                font-size:2rem; font-weight:700; text-align:center; border:1.5px solid #6c757d; }
.brief-box    { background:#f8f9fa; border-left:4px solid #4A90D9; padding:16px 20px;
                border-radius:6px; font-size:0.95rem; line-height:1.7; }
.news-item    { padding:6px 0; border-bottom:1px solid #eee; font-size:0.88rem; }
.dot-pos      { display:inline-block; width:8px; height:8px; border-radius:50%;
                background:#28a745; margin-right:6px; }
.dot-neg      { display:inline-block; width:8px; height:8px; border-radius:50%;
                background:#dc3545; margin-right:6px; }
.dot-neu      { display:inline-block; width:8px; height:8px; border-radius:50%;
                background:#adb5bd; margin-right:6px; }
.disclaimer   { color:#6c757d; font-size:0.78rem; font-style:italic; margin-top:10px; }
</style>
""", unsafe_allow_html=True)


# ── Sidebar ────────────────────────────────────────────────────────────────────
with st.sidebar:
    st.title("📈 AI Stock Analyst")
    st.caption("ML + LLM powered signal engine")
    st.divider()

    ticker_input = st.text_input(
        "Stock ticker", value="AAPL", max_chars=10,
        help="Enter any US stock ticker (e.g. AAPL, TSLA, MSFT, NVDA)"
    ).upper().strip()

    years_data = st.slider("Training data (years)", min_value=1, max_value=5, value=3)

    analyze_btn = st.button("🔍 Analyze", use_container_width=True, type="primary")

    st.divider()

    with st.expander("Model info", expanded=False):
        bundle = load_model()
        if bundle:
            st.success("Model loaded")
            st.caption(f"Trained on: {bundle.get('ticker', 'N/A')}")
            st.caption(f"Features: {len(bundle.get('feature_columns', []))}")
        else:
            st.warning("No model found")
            st.caption("Run: `python ml/train.py --ticker AAPL`")

    with st.expander("LLM provider", expanded=False):
        status = get_provider_status()
        icon = "✅" if status["status"] == "ready" or "local" in status["status"] else "⚠️"
        st.caption(f"{icon} **{status['provider'].title()}** — {status['status']}")
        if status["status"] != "ready" and "local" not in status["status"]:
            st.caption("Set API key in .env file")

    cache_age = get_cache_age_seconds(f"ohlcv_{ticker_input}")
    if cache_age is not None:
        remaining = max(0, 3600 - int(cache_age))
        m, s = divmod(remaining, 60)
        st.caption(f"🗄 Data cached — refresh in {m}m {s}s")


# ── Main area ──────────────────────────────────────────────────────────────────
st.markdown("## AI Stock Analyst")
st.markdown("*Combining Machine Learning signals with LLM-powered financial analysis*")
st.divider()

if not analyze_btn:
    st.info("👈 Enter a ticker in the sidebar and click **Analyze** to get started.")
    st.markdown("""
    **What this tool does:**
    - Fetches 3 years of daily stock data (free via yfinance)
    - Computes 21 technical features (RSI, MACD, Bollinger Bands, etc.)
    - Runs an XGBoost ML model to predict 3-day price direction
    - Explains the prediction with SHAP feature importance
    - Generates a professional analyst brief using an LLM
    
    **First time?** Train the model first:
    ```
    python ml/train.py --ticker AAPL --years 3
    ```
    """)
    st.stop()


# ── Data pipeline ──────────────────────────────────────────────────────────────
col_left, col_right = st.columns([6, 4], gap="large")

with st.spinner(f"Fetching data for {ticker_input}..."):
    # Check cache for OHLCV
    cached_df = cache_get(f"ohlcv_{ticker_input}")
    if cached_df is None:
        df_raw = fetch_ohlcv(ticker_input, period_years=years_data)
        if df_raw is not None:
            cache_set(f"ohlcv_{ticker_input}", df_raw.reset_index().to_dict("records"), ttl=3600)
    else:
        import pandas as pd
        df_raw = pd.DataFrame(cached_df)
        df_raw["Date"] = pd.to_datetime(df_raw["Date"])
        df_raw = df_raw.set_index("Date")

if df_raw is None:
    st.error(f"❌ Could not fetch data for **{ticker_input}**. Check the ticker symbol and try again.")
    st.stop()

# Indicators + features
with st.spinner("Computing indicators and features..."):
    df_ind = compute_indicators(df_raw)
    vix_series = fetch_vix_series(period_years=years_data)
    df_feat = build_features(df_ind, vix_series=vix_series)

if df_feat is None:
    st.error("Feature engineering failed. Please try again.")
    st.stop()

# Latest feature row for prediction
feature_row = get_latest_feature_row(df_feat)
if feature_row is None:
    st.error("Not enough data to generate a prediction. Try a different ticker.")
    st.stop()

# Macro data
macro = fetch_macro_snapshot()

# Current price and info
current_price = fetch_current_price(ticker_input)
ticker_info = get_ticker_info(ticker_input)

# ML Prediction
with st.spinner("Running ML model..."):
    result = predict_signal(ticker_input, feature_row)

# SHAP explanation
with st.spinner("Computing SHAP explanations..."):
    bundle = load_model()
    shap_values = None
    top_features = []
    fig_waterfall = None
    if bundle:
        shap_values = compute_shap_values(bundle["model"], feature_row)
        if shap_values is not None:
            top_features = get_top_shap_features(shap_values, n=5)
            fig_waterfall = build_waterfall_chart(shap_values, ticker_input)

# News
with st.spinner("Fetching news headlines..."):
    news = fetch_news(ticker_input, max_headlines=8)

# Latest row stats for display
latest = df_feat.iloc[-1]
ret_5d = float(latest.get("returns_5d", 0)) if "returns_5d" in df_feat.columns else None
rsi_val = float(latest.get("rsi_14", 0)) if "rsi_14" in df_feat.columns else None
macd_hist_val = float(latest.get("macd_hist", 0)) if "macd_hist" in df_feat.columns else None
vol_ratio_val = float(latest.get("volume_ratio_20d", 1)) if "volume_ratio_20d" in df_feat.columns else None


# ── LEFT COLUMN ────────────────────────────────────────────────────────────────
with col_left:
    # Signal card
    signal = result.signal
    confidence_pct = int(result.confidence * 100)
    signal_class = {"BUY": "signal-buy", "SELL": "signal-sell", "HOLD": "signal-hold"}[signal]
    signal_emoji = {"BUY": "🟢", "SELL": "🔴", "HOLD": "🟡"}[signal]

    st.markdown(f"""
    <div class="{signal_class}">
        {signal_emoji} {signal}
        <div style="font-size:1rem; font-weight:400; margin-top:4px;">
            {ticker_info.get('name', ticker_input)} &nbsp;|&nbsp;
            ${f"{current_price:.2f}" if current_price else "N/A"} &nbsp;|&nbsp;
            {datetime.now().strftime("%b %d, %Y")}
        </div>
    </div>
    """, unsafe_allow_html=True)

    st.markdown(f"**Confidence:** {confidence_pct}%")
    st.progress(result.confidence)

    st.divider()

    # LLM Analyst Brief
    st.markdown("### Analyst Brief")

    shap_text = format_shap_for_prompt(top_features)
    headlines_text = format_headlines_for_prompt(news, n=5)

    prompt = build_prompt(
        ticker=ticker_input,
        signal=signal,
        confidence=result.confidence,
        price=current_price,
        ret_5d=ret_5d,
        rsi=rsi_val,
        macd_hist=macd_hist_val,
        vol_ratio=vol_ratio_val,
        vix=macro.get("vix"),
        shap_text=shap_text,
        headlines_text=headlines_text,
    )

    brief_placeholder = st.empty()
    full_brief = ""

    with st.spinner("Generating analyst brief..."):
        try:
            with brief_placeholder.container():
                st.markdown('<div class="brief-box">', unsafe_allow_html=True)
                brief_text = st.write_stream(generate_brief(prompt))
                st.markdown("</div>", unsafe_allow_html=True)
        except Exception as e:
            brief_placeholder.error(f"LLM generation failed: {e}")

    st.markdown('<p class="disclaimer">⚠️ This is not financial advice. AI-generated analysis for educational purposes only.</p>', unsafe_allow_html=True)

    st.divider()

    # News section
    st.markdown("### Recent Headlines")
    if news:
        for item in news[:6]:
            dot_class = {"positive": "dot-pos", "negative": "dot-neg", "neutral": "dot-neu"}[item["sentiment"]]
            title_safe = item['title'].replace('"', '&quot;')
            st.markdown(f"""
            <div class="news-item">
                <span class="{dot_class}"></span>
                <a href="{item['url']}" target="_blank" style="text-decoration:none; color:inherit;">
                    {item['title']}
                </a>
                <span style="color:#adb5bd; font-size:0.78rem; margin-left:8px;">
                    {item['source']} · {item['published']}
                </span>
            </div>
            """, unsafe_allow_html=True)
    else:
        st.caption("No recent headlines found.")


# ── RIGHT COLUMN ───────────────────────────────────────────────────────────────
with col_right:
    # Technical stats
    st.markdown("### Technical Snapshot")

    m1, m2 = st.columns(2)
    m3, m4 = st.columns(2)

    # RSI color
    rsi_display = f"{rsi_val:.1f}" if rsi_val is not None else "N/A"
    rsi_delta = None
    if rsi_val:
        if rsi_val > 70:
            rsi_delta = "Overbought"
        elif rsi_val < 30:
            rsi_delta = "Oversold"
        else:
            rsi_delta = "Neutral"

    m1.metric("RSI (14)", rsi_display, rsi_delta)
    m2.metric("5-Day Return", f"{ret_5d*100:.2f}%" if ret_5d is not None else "N/A",
              delta_color="normal")
    m3.metric("Volume Ratio", f"{vol_ratio_val:.2f}x" if vol_ratio_val is not None else "N/A")
    m4.metric("MACD Hist", f"{macd_hist_val:.4f}" if macd_hist_val is not None else "N/A")

    st.markdown(f"**VIX:** {interpret_vix(macro.get('vix'))}")

    if macro.get("treasury_10y"):
        st.markdown(f"**10Y Treasury:** {macro['treasury_10y']:.2f}%")

    st.divider()

    # SHAP waterfall chart
    st.markdown("### Why this signal?")
    if fig_waterfall is not None:
        st.pyplot(fig_waterfall)
    elif top_features:
        st.markdown("**Top feature drivers:**")
        for f in top_features[:5]:
            sign = "▲" if f["direction"] == "bullish" else "▼"
            color = "green" if f["direction"] == "bullish" else "red"
            st.markdown(
                f"<span style='color:{color}'>{sign}</span> **{f['label']}** — SHAP: `{f['shap_value']:+.4f}`",
                unsafe_allow_html=True
            )
    else:
        st.info("Train a model to see SHAP explanations.\n\n`python ml/train.py --ticker AAPL`")

    st.divider()

    # Buy probability gauge
    st.markdown("### Buy probability")
    buy_pct = result.buy_probability
    bar_color = "#28a745" if buy_pct > 0.55 else ("#dc3545" if buy_pct < 0.45 else "#6c757d")
    st.progress(buy_pct)
    st.caption(f"Raw model output: {buy_pct:.1%} probability of a >1% gain in 3 days")
