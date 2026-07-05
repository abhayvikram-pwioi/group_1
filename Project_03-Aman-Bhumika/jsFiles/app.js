
//------------------
//WEATHER
//------------------
console.log("JS loaded");

async function getWeather(city=null,lat=null,lon=null) {

   
    
    if (!city && (lat===null || lon===null)){
        return;
    }
    showLoader();
    console.log("Searching for:", city);
    
    const API_KEY = "fd93ea356d0c60b7649b41d419e306ed";

    const cityName = document.getElementById("city-name");
    const temp = document.getElementById("temp");
    const condition = document.getElementById("condition");
    const humidity = document.getElementById("humidity");
    const wind = document.getElementById("wind");
    const icon = document.getElementById("weather-icon");
    try {
        console.log(API_KEY);
        let url;
        if(city){
            url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
        }
        else{
            url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        }
        const response = await fetch(url);
        console.log(response);

      

        if (!response.ok) {
            throw new Error("City not Found");
        }
        
        const data = await response.json();
        console.log(data);
        
        const weather = data.list[0];

        const weatherSec = document.getElementById("weather-sec");
        let weatherType = weather.weather[0].main.toLowerCase();
            
        if (weatherType.includes("clear")) {
            weatherSec.dataset.theme = "sunny";
        }
        else if (weatherType.includes("cloud")) {
            weatherSec.dataset.theme = "cloudy";
        }
        else if (weatherType.includes("rain")) {
            weatherSec.dataset.theme = "rainy";
        }
        else if (weatherType.includes("thunderstorm")) {
            weatherSec.dataset.theme = "storm";
        }
        

        cityName.textContent = data.city.name;
        temp.textContent = (weather.main.temp) + " °C";
        condition.textContent = weather.weather[0].description;
        humidity.textContent = weather.main.humidity + " %";
        wind.textContent = (weather.wind.speed * 3.6).toFixed(1) + " km/h";
        const iconCode = weather.weather[0].icon;
        icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
     
        
        showWeather();


    }
    catch (error) {
        console.log(error);
        if(city){
            showWeatherError(`❌ City "${city}" not Found`);
        }
        else{
            showWeatherError("Unable to fetch weather for your location.")
        }
    }

}
document.getElementById("search-btn").addEventListener("click", () => {
    const city = document.getElementById("city-input").value.trim();
    if (city) {
        
        getWeather(city);
    }
    else{
       showWeatherError("Please enter a City name");
    }
    

});
document.getElementById("city-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const city = e.target.value.trim();

        if (city) {
            getWeather(city);
        }
        else{
            showWeatherError("Please enter a city name")
        }
    }
    



});



if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
        (position) => { 
            getWeather(null,position.coords.latitude,position.coords.longitude);
        },
        (error) => {
        console.log(error);
        if(error.code === error.PERMISSION_DENIED){
            showWeatherError("📍 Location permission denied.<br>Please search for a city.");
        }
        else if(error.code === error.POSITION_UNAVAILABLE){
            showWeatherError("Current location unavailable");
        }
        else if(error.code === error.TIMEOUT){
            showWeatherError("Location request timeout");
        }
        else{
            showWeatherError("Unable to fetch location");
        }
        
    }
    );
    
}
else{
    getWeather("Delhi");
}

// error handling

const loader = document.getElementById("weather-loader");
const errorBox = document.getElementById("weather-error");
const weatherTop = document.querySelector(".weather-top");
const temperature = document.querySelector(".temperature");
const weatherDetails = document.querySelector(".weather-details");

function showLoader(){
    loader.classList.remove("hidden");
    errorBox.classList.add("hidden");
    weatherTop.style.display = "none";
    temperature.style.display = "none";
    weatherDetails.style.display = "none";
}

function showWeather(){
    loader.classList.add("hidden");
    errorBox.classList.add("hidden");
    weatherTop.style.display = "";
    temperature.style.display = "";
    weatherDetails.style.display = "";
}

function showWeatherError(message){
    loader.classList.add("hidden");
    weatherTop.style.display = "none";
    temperature.style.display = "none";
    weatherDetails.style.display = "none";
    errorBox.classList.remove("hidden");
    errorBox.innerHTML = `<h3>${message}</h3>`;
}
