let cityInput = document.getElementById("city");
let searchBtn = document.getElementById("searchbtn");
let weatherResult = document.getElementById("weatherResult");

searchBtn.addEventListener("click",async function(){
    
    let city = cityInput.value.trim();

    if(city === ""){
        alert("Please Enter City Name");
        return;
    }
    try{
        let geourl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
        let response = await fetch(geourl);
        if (!response.ok) {
            throw new Error("Geocoding API request failed");
        }
        let data = await response.json();

        if (!data.results || data.results.length === 0){
            alert("City not found! Please enter a valid city name.");
            return;
        }

        let latitude = data['results'][0]['latitude'];
        let longitude = data['results'][0]['longitude'];

        let weatherurl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;
        let weatherResponse = await fetch(weatherurl);
        if (!weatherResponse.ok) {
            throw new Error("Weather API request failed");
        }
        let weatherData = await weatherResponse.json();

        let temperature = weatherData.current.temperature_2m;
        let humidity = weatherData.current.relative_humidity_2m;
        let windspeed = weatherData.current.wind_speed_10m;
        let weathercode = weatherData.current.weather_code;

        let weatherDescription = '';

        if (weathercode === 0){
            weatherDescription = "Clear Sky ☀️";
        }
        else if(weathercode === 1 || weathercode === 2){
            weatherDescription = "Mainly clear / Partly cloudy 🌤️";
        }
        else if(weathercode === 3){
            weatherDescription = "Overcast ☁️";
        }
        else if(weathercode === 45 || weathercode === 48){
            weatherDescription = "Fog 🌫️";
        }
        else if(weathercode === 51 || weathercode === 53 || weathercode === 55){
            weatherDescription = "Drizzle 🌦️";
        }
        else if(weathercode === 61 || weathercode === 63 || weathercode === 65){
            weatherDescription = "	Rain 🌧️";
        }
        else if(weathercode === 71 || weathercode === 73 || weathercode === 75){
            weatherDescription = "Snow ❄️";
        }
        else if(weathercode === 95){
            weatherDescription = "Thunderstorm ⛈️";
        }
        else{
            throw new Error("Unknown Weather Code");
        }
        

        weatherResult.innerHTML = `<h2>Weather in ${city}</h2>
        <p class="temperature">Temperature: ${temperature} °C</p>
        <p>Condition: ${weatherDescription}</p>
        <div class="weather-details">
            <div class="weather-card">
                <h3>Humidity</h3>
                <p>${humidity}%</p>
            </div>

            <div class="weather-card">
                <h3>Wind Speed</h3>
                <p>${windspeed} km/h</p>
            </div>
        </div>
        `;
    }
    catch(error){
        weatherResult.innerHTML ="Unable to fetch weather. Please check your internet connection and try again.";
        console.log(error);
    }
});