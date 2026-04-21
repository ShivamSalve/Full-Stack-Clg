let weatherChart; 

async function getWeatherData() {
   
    const apiKey = 'a52db128227c14dc6e1d568b4d9376d0'; 
    const cityInput = document.getElementById('cityInput').value.trim();
    const cityNameDisplay = document.getElementById('cityNameDisplay');
    
    if (!cityInput) {
        alert("Please enter a city name.");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&units=metric&appid=${apiKey}`;

    try {
        
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message); 
        }

        
        const labels = data.list.slice(0, 8).map(item => {
            return item.dt_txt.split(' ')[1].substring(0, 5);
        });
        
        const temps = data.list.slice(0, 8).map(item => item.main.temp);

        
        cityNameDisplay.innerText = `24h Temperature Forecast for ${data.city.name}, ${data.city.country}`;
        
        renderChart(labels, temps);

    } catch (error) {
        alert("Error: " + error.message);
        console.error("Fetch Error:", error);
    }
}

function renderChart(labels, temps) {
    const ctx = document.getElementById('weatherChart').getContext('2d');

    if (weatherChart) {
        weatherChart.destroy();
    }

    weatherChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature (°C)',
                data: temps,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#007bff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: { display: true, text: 'Degrees Celsius' }
                },
                x: {
                    title: { display: true, text: 'Time (24h Format)' }
                }
            }
        }
    });
}