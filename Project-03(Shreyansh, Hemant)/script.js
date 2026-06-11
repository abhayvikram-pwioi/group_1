
const WEATHER_API_KEY = "251f7d0d5b7a0085ad898fd0237536cf";

const cityInput = document.getElementById("city-input");
const citySearchForm = document.getElementById("city-search-form");

const weatherCard = document.getElementById("weather-card");
const weatherIcon = document.getElementById("weather-icon");
const weatherTemp = document.getElementById("weather-temp");
const weatherCondition = document.getElementById("weather-condition");
const weatherCity = document.getElementById("weather-city");
const weatherHumidity = document.getElementById("weather-humidity");
const weatherWind = document.getElementById("weather-wind");

async function fetchWeatherByCity(city) {
    try {
        const url =
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        weatherTemp.textContent = `${Math.round(data.main.temp)}°C`;
        weatherCondition.textContent = data.weather[0].description;
        weatherCity.textContent = data.name;
        weatherHumidity.textContent = `${data.main.humidity}%`;
        weatherWind.textContent =
            `${(data.wind.speed * 3.6).toFixed(1)} km/h`;

        weatherIcon.src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        weatherCard.classList.remove("hidden");

    } catch (error) {
        alert(error.message);
    }
}

citySearchForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        alert("Enter city name");
        return;
    }

    fetchWeatherByCity(city);

    cityInput.value = "";
});




const NEWS_API_KEY = "e83637dfb0284371beba3a95134b35be";

const newsCategory = document.getElementById("news-category");
const newsGrid = document.getElementById("news-grid");

async function fetchNews(category = "technology") {
    try {
        const url =
            `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${NEWS_API_KEY}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch news");
        }

        const data = await response.json();

        console.log(data);

        newsGrid.innerHTML = "";

        data.articles.forEach(article => {
            const card = document.createElement("div");

            card.innerHTML = `
                <h3>${article.title}</h3>
                <p>${article.description || "No description available"}</p>
                <a href="${article.url}" target="_blank">
                    Read More
                </a>
                <hr>
            `;

            newsGrid.appendChild(card);
        });

    } catch (error) {
        newsGrid.innerHTML = `<p>${error.message}</p>`;
    }
}

newsCategory.addEventListener("change", function () {
    fetchNews(this.value);
});

fetchNews();


function showNewsError(message) {
  newsErrorMsg.textContent = message;
  newsError.classList.remove("hidden");
}

async function fetchNews(category, country = "in") {
  currentCategory = category;
  showNewsLoader();

  const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${NEWS_API_KEY}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid News API key.");
      }
      throw new Error("News API failed. Please try again later.");
    }

    const data = await response.json();

    if (data.status !== "ok") {
      throw new Error("Failed to fetch news articles.");
    }

    if (!data.articles || data.articles.length === 0) {
      hideNewsLoader();
      newsGrid.innerHTML =
        `<p class="empty-msg">No articles available for this category.</p>`;
      return;
    }

    displayNews(data.articles);

  } catch (error) {
    hideNewsLoader();

    if (
      error.message.includes("Invalid News API key") ||
      error.message.includes("Failed to fetch")
    ) {
      console.warn("Using mock news data:", error.message);
      displayNews(getMockNewsData(category));
    } else {
      showNewsError(error.message);
    }
  }
}
