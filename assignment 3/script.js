/**
 * AniVerse Store — script.js
 * Modular vanilla JS e-commerce engine
 * All product data structured as JSON (backend-ready)
 */

/* =============================================
   1. PRODUCT DATA (simulated API / JSON)
   ============================================= */
const PRODUCTS_DB = [
  {
    id: 1, name: "Demon Slayer Tanjiro Premium Figure", anime: "Demon Slayer",
    category: "figures", price: 3499, originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&q=80",
    rating: 4.8, reviews: 312, badge: "hot", tags: ["figure","PVC","limited"],
    description: "Premium PVC figure of Tanjiro Kamado in his iconic pose. Highly detailed paint work, stands 25cm tall on a decorative base.",
    inStock: true
  },
  {
    id: 2, name: "Attack on Titan Survey Corps Hoodie", anime: "Attack on Titan",
    category: "hoodies", price: 1899, originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
    rating: 4.6, reviews: 198, badge: "sale", tags: ["hoodie","cotton","unisex"],
    description: "Official Survey Corps emblem embroidered hoodie. Premium cotton blend, machine washable, available in all sizes.",
    inStock: true
  },
  {
    id: 3, name: "Naruto Shippuden Wall Art Poster Set", anime: "Naruto",
    category: "posters", price: 599, originalPrice: null,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80",
    rating: 4.5, reviews: 87, badge: "new", tags: ["poster","A3","set of 4"],
    description: "Set of 4 high-quality A3 art prints featuring Naruto, Sasuke, Sakura, and the whole Team 7. Matte finish.",
    inStock: true
  },
  {
    id: 4, name: "My Hero Academia All Might Figure", anime: "My Hero Academia",
    category: "figures", price: 4299, originalPrice: 5500,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
    rating: 4.9, reviews: 441, badge: "hot", tags: ["figure","collectible","premium"],
    description: "All Might in his Plus Ultra stance. Comes with interchangeable face plates and 2 effect parts. 30cm tall.",
    inStock: true
  },
  {
    id: 5, name: "One Piece Straw Hat Crew Enamel Pin Set", anime: "One Piece",
    category: "accessories", price: 849, originalPrice: null,
    image: "https://images.unsplash.com/photo-1619317139476-de7c52be1c7e?w=600&q=80",
    rating: 4.4, reviews: 65, badge: "new", tags: ["pins","accessories","set of 9"],
    description: "Complete Straw Hat crew hard enamel pins. Each pin is 2.5cm, comes in a premium gift box.",
    inStock: true
  },
  {
    id: 6, name: "Jujutsu Kaisen Gojo Satoru Hoodie", anime: "Jujutsu Kaisen",
    category: "hoodies", price: 2199, originalPrice: 2799,
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80",
    rating: 4.7, reviews: 253, badge: "sale", tags: ["hoodie","oversized","streetwear"],
    description: "Gojo's Infinity technique graphic on premium heavyweight fleece. Dropped shoulders, kangaroo pocket.",
    inStock: true
  },
  {
    id: 7, name: "Chainsaw Man Power Vinyl Sticker Pack", anime: "Chainsaw Man",
    category: "accessories", price: 399, originalPrice: null,
    image: "https://images.unsplash.com/photo-1558981285-6f0c68730fca?w=600&q=80",
    rating: 4.3, reviews: 42, badge: null, tags: ["stickers","vinyl","waterproof"],
    description: "20-piece waterproof vinyl sticker set featuring Denji, Power, Makima, and more characters. Laptop-safe.",
    inStock: true
  },
  {
    id: 8, name: "Evangelion Unit-01 ARTFX+ Statue", anime: "Neon Genesis Evangelion",
    category: "figures", price: 7999, originalPrice: 9999,
    image: "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=600&q=80",
    rating: 5.0, reviews: 28, badge: "limited", tags: ["statue","ARTFX","collector"],
    description: "ARTFX+ 1/10 scale pre-painted statue of EVA Unit-01 in battle stance. LED light-up eyes included.",
    inStock: true
  },
  {
    id: 9, name: "Spirited Away Chihiro Art Print", anime: "Spirited Away",
    category: "posters", price: 799, originalPrice: null,
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&q=80",
    rating: 4.7, reviews: 119, badge: null, tags: ["poster","Ghibli","art print"],
    description: "Officially licensed Studio Ghibli art print on 300gsm gallery paper. Frame-ready, 40x50cm.",
    inStock: true
  },
  {
    id: 10, name: "Hunter x Hunter Killua Thunder Palm Tee", anime: "Hunter x Hunter",
    category: "hoodies", price: 999, originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=600&q=80",
    rating: 4.5, reviews: 77, badge: "sale", tags: ["t-shirt","graphic","oversized"],
    description: "Killua's Godspeed lightning graphic on 100% organic cotton. Screen printed, pre-washed for softness.",
    inStock: true
  },
  {
    id: 11, name: "Tokyo Revengers Gang Patchwork Jacket", anime: "Tokyo Revengers",
    category: "hoodies", price: 3499, originalPrice: 4200,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    rating: 4.6, reviews: 91, badge: "new", tags: ["jacket","patchwork","streetwear"],
    description: "Toman gang patches embroidered varsity-style bomber. Satin lining, ribbed cuffs, unisex sizing.",
    inStock: true
  },
  {
    id: 12, name: "Dragon Ball Z Kaioken Nendoroid Goku", anime: "Dragon Ball Z",
    category: "figures", price: 2899, originalPrice: null,
    image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&q=80",
    rating: 4.8, reviews: 204, badge: "hot", tags: ["nendoroid","chibi","poseable"],
    description: "Nendoroid Goku with Kaioken effect parts, 3 face plates, and Kamehameha beam piece. Fully poseable.",
    inStock: true
  }
];

/* Hero Slides */
const HERO_SLIDES = [
  {
    tag: "New Drop",
    title: "Demon Slayer\nCollection 2025",
    desc: "Premium figures, apparel & art prints from the legendary franchise. Limited stock — don't miss out.",
    cta: "Shop Now",
    bg: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=1400&q=80",
    filter: "figures"
  },
  {
    tag: "🔥 Hot Deal",
    title: "Jujutsu Kaisen\nStreetWear Drops",
    desc: "Exclusive hoodies and tees featuring your favourite JJK characters. Up to 30% off this week only.",
    cta: "Grab the Deal",
    bg: "https://images.unsplash.com/photo-1551534800-8f25b5899f13?w=1400&q=80",
    filter: "hoodies"
  },
  {
    tag: "Limited Edition",
    title: "Studio Ghibli\nArt Print Series",
    desc: "Gallery-quality prints on premium paper. Officially licensed Ghibli artwork for your walls.",
    cta: "Explore Posters",
    bg: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1400&q=80",
    filter: "posters"
  }
];

/* Categories */
const CATEGORIES_DATA = [
  { name: "Figures", icon: "🗿", filter: "figures", color: "var(--accent-cyan)", count: 4 },
  { name: "Hoodies", icon: "👕", filter: "hoodies", color: "var(--accent-pink)", count: 4 },
  { name: "Posters", icon: "🖼️", filter: "posters", color: "var(--accent-yellow)", count: 3 },
  { name: "Accessories", icon: "💎", filter: "accessories", color: "var(--accent-purple)", count: 2 },
  { name: "All Items", icon: "⚡", filter: "all", color: "var(--accent-cyan)", count: 12 }
];

/* Trending anime */
const TRENDING_DATA = [
  { name: "Demon Slayer", badge: "#1 Trending",
    img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80" },
  { name: "Jujutsu Kaisen", badge: "🔥 Hot",
    img: "https://images.unsplash.com/photo-1551534800-8f25b5899f13?w=400&q=80" },
  { name: "Attack on Titan", badge: "Final Season",
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&q=80" },
  { name: "My Hero Academia", badge: "Most Loved",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { name: "One Piece", badge: "Live Action",
    img: "https://images.unsplash.com/photo-1619317139476-de7c52be1c7e?w=400&q=80" },
  { name: "Chainsaw Man", badge: "Season 2",
    img: "https://images.unsplash.com/photo-1558981285-6f0c68730fca?w=400&q=80" }
];

/* =============================================
   2. STATE
   ============================================= */
let state = {
  cart: [],
  wishlist: [],
  currentFilter: "all",
  currentSort: "default",
  searchQuery: "",
  currentSlide: 0,
  slideTimer: null,
  filteredProducts: [...PRODUCTS_DB]
};

/* =============================================
   3. LOCAL STORAGE (simulated backend persistence)
   ============================================= */
const Storage = {
  save(key, data) {
    try { localStorage.setItem(`aniverse_${key}`, JSON.stringify(data)); } catch(e) {}
  },
  load(key, fallback = []) {
    try {
      const d = localStorage.getItem(`aniverse_${key}`);
      return d ? JSON.parse(d) : fallback;
    } catch(e) { return fallback; }
  }
};

function initState() {
  state.cart = Storage.load("cart", []);
  state.wishlist = Storage.load("wishlist", []);
}

/* =============================================
   4. SIMULATED API CALLS (backend-ready)
   ============================================= */
const API = {
  /** Fetch all products — plug in real endpoint later */
  async getProducts() {
    return new Promise(resolve => setTimeout(() => resolve([...PRODUCTS_DB]), 800));
  },
  /** Filter & sort products */
  async filterProducts(filter, sort, query) {
    return new Promise(resolve => {
      setTimeout(() => {
        let result = [...PRODUCTS_DB];
        if (filter && filter !== "all") result = result.filter(p => p.category === filter);
        if (query) {
          const q = query.toLowerCase();
          result = result.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.anime.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
          );
        }
        if (sort === "price-asc") result.sort((a,b) => a.price - b.price);
        if (sort === "price-desc") result.sort((a,b) => b.price - a.price);
        if (sort === "name-asc") result.sort((a,b) => a.name.localeCompare(b.name));
        resolve(result);
      }, 200);
    });
  }
};

/* =============================================
   5. CART MODULE
   ============================================= */
const Cart = {
  add(productId, qty = 1) {
    const product = PRODUCTS_DB.find(p => p.id === productId);
    if (!product) return;
    const existing = state.cart.find(item => item.id === productId);
    if (existing) {
      existing.qty = Math.min(existing.qty + qty, 10);
    } else {
      state.cart.push({ ...product, qty });
    }
    Storage.save("cart", state.cart);
    UI.updateCartBadge();
    UI.renderCart();
    Toast.show(`${product.name.slice(0,30)}… added to cart!`, "success");
  },
  remove(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    Storage.save("cart", state.cart);
    UI.updateCartBadge();
    UI.renderCart();
  },
  updateQty(productId, delta) {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;
    item.qty = Math.max(1, Math.min(10, item.qty + delta));
    Storage.save("cart", state.cart);
    UI.updateCartBadge();
    UI.renderCart();
  },
  clear() {
    state.cart = [];
    Storage.save("cart", state.cart);
    UI.updateCartBadge();
    UI.renderCart();
    Toast.show("Cart cleared", "info");
  },
  getTotal() {
    return state.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  },
  getCount() {
    return state.cart.reduce((sum, item) => sum + item.qty, 0);
  }
};

/* =============================================
   6. WISHLIST MODULE
   ============================================= */
const Wishlist = {
  toggle(productId) {
    const idx = state.wishlist.findIndex(p => p.id === productId);
    if (idx === -1) {
      const product = PRODUCTS_DB.find(p => p.id === productId);
      if (product) state.wishlist.push(product);
      Toast.show("Added to wishlist ♥", "success");
    } else {
      state.wishlist.splice(idx, 1);
      Toast.show("Removed from wishlist", "info");
    }
    Storage.save("wishlist", state.wishlist);
    UI.updateWishlistBadge();
    UI.renderWishlist();
    UI.syncWishlistButtons();
  },
  has(productId) {
    return state.wishlist.some(p => p.id === productId);
  },
  remove(productId) {
    state.wishlist = state.wishlist.filter(p => p.id !== productId);
    Storage.save("wishlist", state.wishlist);
    UI.updateWishlistBadge();
    UI.renderWishlist();
    UI.syncWishlistButtons();
  }
};

/* =============================================
   7. TOAST MODULE
   ============================================= */
const Toast = {
  show(msg, type = "success") {
    const icons = { success: "fa-check-circle", error: "fa-times-circle", info: "fa-info-circle" };
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("removing");
      toast.addEventListener("animationend", () => toast.remove());
    }, 3000);
  }
};

/* =============================================
   8. UI RENDERING
   ============================================= */
const UI = {
  /* --- HERO SLIDER --- */
  renderHero() {
    const slider = document.getElementById("heroSlider");
    const dots = document.getElementById("sliderDots");
    slider.innerHTML = HERO_SLIDES.map((s, i) => `
      <div class="hero-slide${i === 0 ? " active" : ""}" data-index="${i}">
        <div class="slide-bg" style="background-image:url('${s.bg}')"></div>
        <div class="slide-overlay"></div>
        <div class="slide-content">
          <span class="slide-tag">${s.tag}</span>
          <h1>${s.title.replace("\n","<br>")}</h1>
          <p>${s.desc}</p>
          <a href="#products" class="slide-cta" data-filter="${s.filter}">
            ${s.cta} <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `).join("");

    dots.innerHTML = HERO_SLIDES.map((_, i) =>
      `<span class="dot${i === 0 ? " active" : ""}" data-dot="${i}"></span>`
    ).join("");

    // Dot clicks
    dots.querySelectorAll(".dot").forEach(d =>
      d.addEventListener("click", () => Slider.goTo(parseInt(d.dataset.dot)))
    );

    // CTA filter
    slider.querySelectorAll(".slide-cta").forEach(btn =>
      btn.addEventListener("click", () => {
        const f = btn.dataset.filter;
        if (f) {
          state.currentFilter = f;
          document.querySelectorAll(".filter-btn").forEach(b => b.classList.toggle("active", b.dataset.filter === f));
          Products.load();
        }
      })
    );
  },

  /* --- CATEGORIES --- */
  renderCategories() {
    const grid = document.getElementById("categoriesGrid");
    grid.innerHTML = CATEGORIES_DATA.map(c => `
      <div class="category-card" data-filter="${c.filter}" style="--cat-color:${c.color}"
           role="button" tabindex="0">
        <span class="cat-icon">${c.icon}</span>
        <span class="cat-name">${c.name}</span>
        <span class="cat-count">${c.count} items</span>
      </div>
    `).join("");

    grid.querySelectorAll(".category-card").forEach(card => {
      const action = () => {
        const f = card.dataset.filter;
        state.currentFilter = f;
        document.querySelectorAll(".filter-btn").forEach(b =>
          b.classList.toggle("active", b.dataset.filter === f));
        Products.load();
        document.getElementById("products").scrollIntoView({ behavior: "smooth" });
      };
      card.addEventListener("click", action);
      card.addEventListener("keydown", e => { if (e.key === "Enter") action(); });
    });
  },

  /* --- TRENDING --- */
  renderTrending() {
    const strip = document.getElementById("trendingStrip");
    strip.innerHTML = TRENDING_DATA.map(t => `
      <div class="trending-card">
        <img src="${t.img}" alt="${t.name}" loading="lazy"/>
        <div class="trending-info">
          <div class="trending-badge">${t.badge}</div>
          <h4>${t.name}</h4>
        </div>
      </div>
    `).join("");
  },

  /* --- PRODUCTS --- */
  renderProducts(products) {
    const grid = document.getElementById("productsGrid");
    const noResults = document.getElementById("noResults");

    if (products.length === 0) {
      grid.innerHTML = "";
      noResults.style.display = "flex";
      return;
    }
    noResults.style.display = "none";

    grid.innerHTML = products.map((p, i) => {
      const inWish = Wishlist.has(p.id);
      const discount = p.originalPrice
        ? Math.round((1 - p.price / p.originalPrice) * 100) : null;
      const stars = "★".repeat(Math.round(p.rating)) + "☆".repeat(5 - Math.round(p.rating));

      return `
        <div class="product-card" data-id="${p.id}"
             style="animation-delay:${i * 0.07}s"
             role="article">
          <div class="card-img-wrap">
            <img src="${p.image}" alt="${p.name}" loading="lazy"/>
            <div class="card-badges">
              ${p.badge ? `<span class="badge-tag ${p.badge}">${p.badge}</span>` : ""}
            </div>
            <button class="wish-btn${inWish ? " active" : ""}" data-id="${p.id}"
                    title="${inWish ? "Remove from wishlist" : "Add to wishlist"}"
                    aria-label="Wishlist">
              <i class="${inWish ? "fas" : "far"} fa-heart"></i>
            </button>
          </div>
          <div class="card-body">
            <span class="card-category">${p.category}</span>
            <h3 class="card-title">${p.name}</h3>
            <span class="card-anime">${p.anime}</span>
            <div class="card-stars">
              <span class="stars">${stars}</span>
              <span class="review-count">(${p.reviews})</span>
            </div>
            <div class="card-price">
              <span class="price-current">₹${p.price.toLocaleString()}</span>
              ${p.originalPrice ? `<span class="price-original">₹${p.originalPrice.toLocaleString()}</span>` : ""}
              ${discount ? `<span class="price-discount">-${discount}%</span>` : ""}
            </div>
            <button class="add-to-cart" data-id="${p.id}">
              <i class="fas fa-shopping-bag"></i> Add to Cart
            </button>
          </div>
        </div>
      `;
    }).join("");

    /* Event delegation on grid */
    grid.querySelectorAll(".add-to-cart").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        Cart.add(id);
        btn.classList.add("added");
        btn.innerHTML = `<i class="fas fa-check"></i> Added!`;
        setTimeout(() => {
          btn.classList.remove("added");
          btn.innerHTML = `<i class="fas fa-shopping-bag"></i> Add to Cart`;
        }, 1500);
      });
    });

    grid.querySelectorAll(".wish-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = parseInt(btn.dataset.id);
        Wishlist.toggle(id);
      });
    });

    grid.querySelectorAll(".product-card").forEach(card => {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".wish-btn") || e.target.closest(".add-to-cart")) return;
        const id = parseInt(card.dataset.id);
        Modal.open(id);
      });
    });
  },

  /* --- CART --- */
  renderCart() {
    const items = document.getElementById("cartItems");
    const footer = document.getElementById("cartFooter");
    const empty = document.getElementById("cartEmpty");

    if (state.cart.length === 0) {
      items.innerHTML = "";
      footer.style.display = "none";
      empty.style.display = "flex";
      return;
    }
    empty.style.display = "none";
    footer.style.display = "block";

    items.innerHTML = state.cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}"/>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name.length > 32 ? item.name.slice(0,32)+"…" : item.name}</div>
          <div class="cart-item-anime">${item.anime}</div>
          <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</div>
          <div class="qty-controls">
            <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
          </div>
        </div>
        <button class="remove-item" data-id="${item.id}" title="Remove">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `).join("");

    const total = Cart.getTotal();
    document.getElementById("cartSubtotal").textContent = `₹${total.toLocaleString()}`;
    document.getElementById("cartTotal").textContent = `₹${total.toLocaleString()}`;

    items.querySelectorAll(".qty-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        Cart.updateQty(parseInt(btn.dataset.id), parseInt(btn.dataset.delta));
      });
    });
    items.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", () => Cart.remove(parseInt(btn.dataset.id)));
    });
  },

  /* --- WISHLIST --- */
  renderWishlist() {
    const container = document.getElementById("wishlistItems");
    const empty = document.getElementById("wishlistEmpty");

    if (state.wishlist.length === 0) {
      container.innerHTML = "";
      empty.style.display = "flex";
      return;
    }
    empty.style.display = "none";

    container.innerHTML = state.wishlist.map(p => `
      <div class="wishlist-item" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}"/>
        <div class="wishlist-item-info">
          <div class="wishlist-item-name">${p.name.slice(0,35)}${p.name.length>35?"…":""}</div>
          <div class="wishlist-item-price">₹${p.price.toLocaleString()}</div>
          <button class="add-from-wish" data-id="${p.id}">Add to Cart</button>
        </div>
        <button class="wish-remove" data-id="${p.id}" title="Remove"><i class="fas fa-times"></i></button>
      </div>
    `).join("");

    container.querySelectorAll(".wish-remove").forEach(btn =>
      btn.addEventListener("click", () => Wishlist.remove(parseInt(btn.dataset.id)))
    );
    container.querySelectorAll(".add-from-wish").forEach(btn =>
      btn.addEventListener("click", () => {
        Cart.add(parseInt(btn.dataset.id));
        SidePanel.closeWishlist();
        SidePanel.openCart();
      })
    );
  },

  /* --- SYNC WISHLIST HEART BUTTONS --- */
  syncWishlistButtons() {
    document.querySelectorAll(".wish-btn").forEach(btn => {
      const id = parseInt(btn.dataset.id);
      const inWish = Wishlist.has(id);
      btn.classList.toggle("active", inWish);
      btn.querySelector("i").className = inWish ? "fas fa-heart" : "far fa-heart";
    });
    // Also sync modal wish button if open
    const modalWish = document.querySelector(".modal-wish-btn");
    if (modalWish) {
      const id = parseInt(modalWish.dataset.id);
      const inWish = Wishlist.has(id);
      modalWish.classList.toggle("active", inWish);
      modalWish.querySelector("i").className = inWish ? "fas fa-heart" : "far fa-heart";
    }
  },

  /* --- BADGES --- */
  updateCartBadge() {
    const count = Cart.getCount();
    const badge = document.getElementById("cartCount");
    badge.textContent = count;
    badge.classList.toggle("visible", count > 0);
  },
  updateWishlistBadge() {
    const count = state.wishlist.length;
    const badge = document.getElementById("wishlistCount");
    badge.textContent = count;
    badge.classList.toggle("visible", count > 0);
  }
};

/* =============================================
   9. PRODUCTS MODULE
   ============================================= */
const Products = {
  async load() {
    const grid = document.getElementById("productsGrid");
    // Show skeletons
    grid.innerHTML = Array(6).fill('<div class="skeleton-card"></div>').join("");
    const results = await API.filterProducts(
      state.currentFilter,
      state.currentSort,
      state.searchQuery
    );
    state.filteredProducts = results;
    UI.renderProducts(results);
  }
};

/* =============================================
   10. SLIDER MODULE
   ============================================= */
const Slider = {
  goTo(index) {
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".dot");
    const slider = document.getElementById("heroSlider");

    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));

    state.currentSlide = (index + HERO_SLIDES.length) % HERO_SLIDES.length;
    slides[state.currentSlide]?.classList.add("active");
    dots[state.currentSlide]?.classList.add("active");
    slider.style.transform = `translateX(-${state.currentSlide * 100}%)`;
  },
  next() { this.goTo(state.currentSlide + 1); },
  prev() { this.goTo(state.currentSlide - 1); },
  startAuto() {
    state.slideTimer = setInterval(() => this.next(), 5000);
  },
  stopAuto() {
    clearInterval(state.slideTimer);
  }
};

/* =============================================
   11. SIDE PANELS
   ============================================= */
const SidePanel = {
  openCart() {
    document.getElementById("cartSidebar").classList.add("open");
    document.getElementById("cartOverlay").classList.add("open");
    document.body.style.overflow = "hidden";
  },
  closeCart() {
    document.getElementById("cartSidebar").classList.remove("open");
    document.getElementById("cartOverlay").classList.remove("open");
    document.body.style.overflow = "";
  },
  openWishlist() {
    document.getElementById("wishlistSidebar").classList.add("open");
    document.getElementById("wishlistOverlay").classList.add("open");
    document.body.style.overflow = "hidden";
  },
  closeWishlist() {
    document.getElementById("wishlistSidebar").classList.remove("open");
    document.getElementById("wishlistOverlay").classList.remove("open");
    document.body.style.overflow = "";
  }
};

/* =============================================
   12. PRODUCT MODAL
   ============================================= */
const Modal = {
  open(productId) {
    const p = PRODUCTS_DB.find(prod => prod.id === productId);
    if (!p) return;

    const inWish = Wishlist.has(p.id);
    const discount = p.originalPrice
      ? Math.round((1 - p.price / p.originalPrice) * 100) : null;
    const stars = "★".repeat(Math.round(p.rating)) + "☆".repeat(5 - Math.round(p.rating));

    document.getElementById("modalBody").innerHTML = `
      <div class="modal-img-section">
        <img src="${p.image}" alt="${p.name}"/>
        <div class="modal-img-overlay"></div>
      </div>
      <div class="modal-info">
        <span class="modal-category">${p.category} · ${p.anime}</span>
        <h2 class="modal-title">${p.name}</h2>
        <div class="modal-stars">
          <span class="stars">${stars}</span>
          <span class="count">${p.rating} (${p.reviews} reviews)</span>
        </div>
        <div class="modal-price">
          <span class="modal-price-current">₹${p.price.toLocaleString()}</span>
          ${p.originalPrice ? `<span class="modal-price-original">₹${p.originalPrice.toLocaleString()}</span>` : ""}
          ${discount ? `<span class="price-discount">-${discount}% OFF</span>` : ""}
        </div>
        <p class="modal-desc">${p.description}</p>
        <div class="modal-tags">
          ${p.tags.map(t => `<span class="modal-tag">#${t}</span>`).join("")}
        </div>
        <div class="modal-actions">
          <button class="modal-cart-btn" data-id="${p.id}">
            <i class="fas fa-shopping-bag"></i> Add to Cart
          </button>
          <button class="modal-wish-btn${inWish ? " active" : ""}" data-id="${p.id}"
                  title="${inWish ? "Remove from wishlist" : "Add to wishlist"}">
            <i class="${inWish ? "fas" : "far"} fa-heart"></i>
          </button>
        </div>
      </div>
    `;

    document.getElementById("modalOverlay").classList.add("open");
    document.getElementById("productModal").classList.add("open");
    document.body.style.overflow = "hidden";

    document.querySelector(".modal-cart-btn").addEventListener("click", () => {
      Cart.add(p.id);
    });
    document.querySelector(".modal-wish-btn").addEventListener("click", (e) => {
      Wishlist.toggle(p.id);
      e.currentTarget.classList.toggle("active");
      const i = e.currentTarget.querySelector("i");
      const inW = Wishlist.has(p.id);
      i.className = inW ? "fas fa-heart" : "far fa-heart";
    });
  },
  close() {
    document.getElementById("modalOverlay").classList.remove("open");
    document.getElementById("productModal").classList.remove("open");
    document.body.style.overflow = "";
  }
};

/* =============================================
   13. SEARCH MODULE
   ============================================= */
const Search = {
  debounceTimer: null,
  query(val) {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(async () => {
      state.searchQuery = val.trim();
      const dropdown = document.getElementById("searchDropdown");

      if (!state.searchQuery) {
        dropdown.classList.remove("open");
        dropdown.innerHTML = "";
        return;
      }

      const results = await API.filterProducts(null, "default", state.searchQuery);
      if (results.length === 0) {
        dropdown.innerHTML = `<div class="search-item"><span style="color:var(--text-muted);font-size:.85rem;">No results found</span></div>`;
      } else {
        dropdown.innerHTML = results.slice(0, 5).map(p => `
          <div class="search-item" data-id="${p.id}">
            <img src="${p.image}" alt="${p.name}"/>
            <div class="search-item-info">
              <div class="name">${p.name.slice(0,40)}${p.name.length>40?"…":""}</div>
              <div class="price">₹${p.price.toLocaleString()}</div>
            </div>
          </div>
        `).join("");

        dropdown.querySelectorAll(".search-item[data-id]").forEach(item => {
          item.addEventListener("click", () => {
            Modal.open(parseInt(item.dataset.id));
            dropdown.classList.remove("open");
            document.getElementById("searchInput").value = "";
          });
        });
      }
      dropdown.classList.add("open");
    }, 250);
  }
};

/* =============================================
   14. NAVBAR SCROLL
   ============================================= */
function initNavbar() {
  window.addEventListener("scroll", () => {
    document.getElementById("navbar").classList.toggle("scrolled", window.scrollY > 40);
  });
}

/* =============================================
   15. EVENT LISTENERS
   ============================================= */
function bindEvents() {
  /* Slider */
  document.getElementById("sliderNext").addEventListener("click", () => {
    Slider.stopAuto(); Slider.next(); Slider.startAuto();
  });
  document.getElementById("sliderPrev").addEventListener("click", () => {
    Slider.stopAuto(); Slider.prev(); Slider.startAuto();
  });

  /* Cart */
  document.getElementById("cartToggle").addEventListener("click", SidePanel.openCart);
  document.getElementById("cartClose").addEventListener("click", SidePanel.closeCart);
  document.getElementById("cartOverlay").addEventListener("click", SidePanel.closeCart);
  document.getElementById("clearCartBtn").addEventListener("click", Cart.clear.bind(Cart));

  /* Wishlist */
  document.getElementById("wishlistToggle").addEventListener("click", SidePanel.openWishlist);
  document.getElementById("wishlistClose").addEventListener("click", SidePanel.closeWishlist);
  document.getElementById("wishlistOverlay").addEventListener("click", SidePanel.closeWishlist);

  /* Modal */
  document.getElementById("modalClose").addEventListener("click", Modal.close);
  document.getElementById("modalOverlay").addEventListener("click", Modal.close);

  /* Filter buttons */
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.currentFilter = btn.dataset.filter;
      Products.load();
    });
  });

  /* Sort */
  document.getElementById("sortSelect").addEventListener("change", (e) => {
    state.currentSort = e.target.value;
    Products.load();
  });

  /* Search input */
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (e) => Search.query(e.target.value));
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      state.searchQuery = e.target.value.trim();
      document.getElementById("searchDropdown").classList.remove("open");
      Products.load();
      document.getElementById("products").scrollIntoView({ behavior: "smooth" });
    }
    if (e.key === "Escape") {
      document.getElementById("searchDropdown").classList.remove("open");
      searchInput.value = "";
      state.searchQuery = "";
    }
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrap")) {
      document.getElementById("searchDropdown").classList.remove("open");
    }
  });

  /* Hamburger */
  document.getElementById("hamburger").addEventListener("click", () => {
    const hb = document.getElementById("hamburger");
    const mm = document.getElementById("mobileMenu");
    hb.classList.toggle("open");
    mm.classList.toggle("open");
  });

  /* Keyboard: close modal on Escape */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      Modal.close();
      SidePanel.closeCart();
      SidePanel.closeWishlist();
    }
  });
}

/* =============================================
   16. INIT
   ============================================= */
async function init() {
  initState();
  UI.renderHero();
  UI.renderCategories();
  UI.renderTrending();
  UI.renderCart();
  UI.renderWishlist();
  UI.updateCartBadge();
  UI.updateWishlistBadge();
  bindEvents();
  initNavbar();
  await Products.load();
  Slider.startAuto();
}

document.addEventListener("DOMContentLoaded", init);
