
        async function getWeather(){
            const lat = 28.57;
            const lon = 77.55;
            const API_KEY = "fd93ea356d0c60b7649b41d419e306ed";

            const cityName = document.getElementById("city-name");
            const temp = document.getElementById("temp");
            const condition = document.getElementById("condition");
            const humidity = document.getElementById("humidity");
            const wind = document.getElementById("wind");
            const icon = document.getElementById("weather-icon");
            try{
                console.log(API_KEY);
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
                if(!response.ok){
                throw new Error("API Error");
            }
                const data = await response.json();
                console.log(data);
                const weather = data.list[0];
                cityName.textContent = data.city.name;
                temp.textContent = (weather.main.temp) + " °C";
                condition.textContent = weather.weather[0].description;
                humidity.textContent = weather.main.humidity + " %";
                wind.textContent = weather.wind.speed + " m/s";
                const iconCode = weather.weather[0].icon;
                icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
                


            }
            catch(error){
                console.log(error);
            }
            
        }
        getWeather();