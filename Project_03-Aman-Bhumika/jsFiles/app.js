
//------------------
//WEATHER
//------------------
console.log("JS loaded");

async function getWeather(city) {
    if (!city)
        return;
    console.log("Searching for:", city);
    // const lat = 28.57;
    // const lon = 77.55;
    const API_KEY = "fd93ea356d0c60b7649b41d419e306ed";

    const cityName = document.getElementById("city-name");
    const temp = document.getElementById("temp");
    const condition = document.getElementById("condition");
    const humidity = document.getElementById("humidity");
    const wind = document.getElementById("wind");
    const icon = document.getElementById("weather-icon");
    try {
        console.log(API_KEY);
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
        console.log(response);
        if (!response.ok) {
            throw new Error("City not Found");
        }
        const data = await response.json();
        console.log(data);
        const weather = data.list[0];

        const weatherSec = document.getElementById("weather-sec");

        const weatherType = weather.weather[0].main.toLowerCase();

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
        wind.textContent = weather.wind.speed + " m/s";
        const iconCode = weather.weather[0].icon;
        icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;



    }
    catch (error) {
        console.log(error);
        alert("City not found");
    }

}
document.getElementById("search-btn").addEventListener("click", () => {
    const city = document.getElementById("city-input").value.trim();
    if (city) {
        getWeather(city);
    }

});
document.getElementById("city-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const city = e.target.value.trim();

        if (city) {
            getWeather(city);
        }
    }



});

getWeather("Delhi");


