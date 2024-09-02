let sc='';
    let button=document.querySelector("#sub"); 
    let Search=document.getElementById('Search');
    let cd=document.getElementById('city-name');
    const videoElement = document.getElementById('background-video');
    document.addEventListener('DOMContentLoaded',function(){
    let sv=Search.value;
    const default_city='New York';
    const NEW_API='4ee6bc211d28e7bb6a2ce2591f01b3cb';
    const GEO_API_KEY = '5955b0ed6emsh8b12f2260d92b8ep1096afjsnfc79cf3a1d04'; 
    const GEO_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';
    weather(default_city);

async function getCitySuggestions(query) {
    try{
        const response = await fetch(`${GEO_API_URL}?namePrefix=${query}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': GEO_API_KEY,
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        });
        if(response.ok){
        const data = await response.json();
        return data.data; 
        }
        else{
            console.error('Error fetching city suggestions:', response.status, response.statusText);
                return [];
        }
    }
    catch (error) {
        console.error('Error fetching city suggestions:', error);
        return [];
    }
}

function showSuggestions(query) {
    if (query.length < 3) { 
        document.getElementById('suggestions').innerHTML = '';
        return;
    }
    
    getCitySuggestions(query).then(suggestions => {
        const suggestionsDiv = document.getElementById('suggestions');
        suggestionsDiv.innerHTML = '';
        
        suggestions.forEach(city => {
            const div = document.createElement('div');
            div.textContent = `${city.name}, ${city.country}`;
            div.classList.add('suggestion-item');
            div.onclick = () => {
                sc= city.name;
                Search.value=sc;
                suggestionsDiv.innerHTML = '';
            };
            suggestionsDiv.appendChild(div);
        });
    });
}

    async function weather(city){
        const URL=`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${NEW_API}&units=metric`;
        try{
            let response=await fetch(URL);
            let data= await response.json();
            if(data.cod==="200"){
                const currentTime = new Date();
                const closestForecast = data.list.reduce((closest, entry) => {
                    const entryTime = new Date(entry.dt_txt);
                    return Math.abs(entryTime - currentTime) < Math.abs(new Date(closest.dt_txt) - currentTime) ? entry : closest;
                });

            
                document.getElementById('wi').innerHTML = `
                    <h2>${data.city.name}, ${data.city.country}</h2>
                    <div>
                        <h3>${new Date(closestForecast.dt_txt).toLocaleString()}</h3>
                        <p id="temp"> ${closestForecast.main.temp}°C</p>
                        <div id="pa">
                            <p id="All">Weather: ${closestForecast.weather[0].description}</p>
                            <p id="All">Humidity: ${closestForecast.main.humidity}%</p>
                            <p id="All">Wind Speed: ${closestForecast.wind.speed} m/s</p>
                        </div>
                        
                    </div>`;

                    const hours = [];
                    const temps = [];
                    const humidities = [];
        
                    data.list.slice(0, 12).forEach((entry) => { 
                        const entryTime = new Date(entry.dt_txt);
                        hours.push(entryTime.getHours() + ":00");
                        temps.push(entry.main.temp);
                        humidities.push(entry.main.humidity);
                    });
                    createHourlyForecastGraph(hours, temps, humidities);
            }
            else{
            document.getElementById('wi').innerHTML='<p>city not found.please enter a valid city name</p>';
            }
        }
        catch(error){
            console.error('Error fetching weather data:', error);
            document.getElementById('wi').innerHTML = '<p>Error fetching weather data. Please try again later.</p>';
        }
    }
    
   
            Search.addEventListener('input', function() {
            let query = this.value.trim();
            console.log(query);
            showSuggestions(query);
            });
    button.addEventListener('click', function() {   
        if (sc||Search.value) {
            weather(sc||Search.value);
        } 
        else {
            document.getElementById('wi').innerHTML = '<p>Please select a city from the suggestions.</p>';
        }
    });
});
let currentIndex = 0;
let slideInterval = 2000;
let slides = document.querySelectorAll('.Allslides');
let totalSlides = slides.length;

let carouselWrapper = document.querySelector('.slides');
function moveSlide() {
    currentIndex = (currentIndex + 1)%totalSlides;
    const offset = -currentIndex * 1343; 
    carouselWrapper.style.transform = `translateX(${offset}px)`;
}
setInterval(moveSlide, slideInterval);
let chartinstance;
function createHourlyForecastGraph(hours, temps, humidities) {
    const ctx = document.getElementById('forecastGraph').getContext('2d');
    if(chartinstance){
        chartinstance.destroy();
    }
    chartinstance=new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [
                {
                    label: 'Temperature (°C)',
                    data: temps,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    fill: false,
                    yAxisID: 'y-temp',
                },
                {
                    label: 'Humidity (%)',
                    data: humidities,
                    borderColor: 'rgba(192,2,2)',
                    fill: false,
                    yAxisID: 'y-humidity',
                }
            ]
        },
        options: {
            scales: {
                'y-temp': {   
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        beginAtZero: true
                    },
                },
                'y-humidity': {  
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        beginAtZero: true
                    },
                },
                x: {   
                    beginAtZero: true,
                }
            }
        }
    });
}



