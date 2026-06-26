const WEATHER_API_KEY = "251f7d0d5b7a0085ad898fd0237536cf";
const GUARDIAN_API_KEY = "22d1a680-c126-48fc-bb19-01fb555abde2";

const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const GUARDIAN_BASE_URL = "https://content.guardianapis.com/search";

const GUARDIAN_SECTION_MAP = {
  "general": "",
  "technology": "technology",
  "sports": "sport",
  "business": "business",
  "health": "lifeandstyle",
  "entertainment": "culture"
};

let currentCity = "Mumbai";
let currentCategory = "general";
let currentLat = null;
let currentLon = null;

const cityInput = document.getElementById("city-input");
const citySearchForm = document.getElementById("city-search-form");
const newsCategory = document.getElementById("news-category");
const locateBtn = document.getElementById("locate-btn");

const weatherLoader = document.getElementById("weather-loader");
const weatherError = document.getElementById("weather-error");
const weatherErrorMsg = document.getElementById("weather-error-msg");
const weatherCard = document.getElementById("weather-card");

const newsLoader = document.getElementById("news-loader");
const newsError = document.getElementById("news-error");
const newsGrid = document.getElementById("news-grid");

const weatherRetryBtn = document.getElementById("weather-retry-btn");
const newsRetryBtn = document.getElementById("news-retry-btn");

async function fetchWeather(query) {
  weatherLoader.classList.remove("hidden");
  weatherError.classList.add("hidden");
  weatherCard.classList.add("hidden");

  let url = `${WEATHER_BASE_URL}?appid=${WEATHER_API_KEY}&units=metric`;
  
  if (query.lat && query.lon) {
    url += `&lat=${query.lat}&lon=${query.lon}`;
    currentLat = query.lat;
    currentLon = query.lon;
    currentCity = "";
  } else {
    url += `&q=${encodeURIComponent(query.city)}`;
    currentCity = query.city;
    currentLat = null;
    currentLon = null;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(response.status === 404 ? "City not found." : "Weather API failed.");
    }
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherErrorMsg.textContent = error.message;
    weatherError.classList.remove("hidden");
  } finally {
    weatherLoader.classList.add("hidden");
  }
}

function displayWeather(data) {
  const temp = Math.round(data.main.temp);
  const feelsLike = Math.round(data.main.feels_like);
  const humidity = data.main.humidity;
  const windSpeed = (data.wind.speed * 3.6).toFixed(1);
  const pressure = data.main.pressure;
  const visibility = data.visibility !== undefined ? (data.visibility / 1000).toFixed(0) : "--";
  const city = data.name;
  const country = data.sys && data.sys.country ? data.sys.country : "";
  const description = data.weather[0].description;
  const iconCode = data.weather[0].icon;

  document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.getElementById("weather-icon").alt = description;
  document.getElementById("weather-temp").textContent = `${temp}°C`;
  document.getElementById("weather-condition").textContent = description;
  document.getElementById("weather-feels-like").textContent = `Feels like ${feelsLike}°C`;
  document.getElementById("weather-city").textContent = country ? `${city}, ${country}` : city;
  
  document.getElementById("weather-humidity").textContent = `${humidity}%`;
  document.getElementById("weather-wind").textContent = `${windSpeed} km/h`;
  document.getElementById("weather-pressure").textContent = `${pressure} hPa`;
  document.getElementById("weather-visibility").textContent = `${visibility} km`;

  const updatedTime = new Date(data.dt * 1000);
  const formattedTime = updatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById("weather-updated-time").textContent = `Last updated: ${formattedTime}`;

  weatherCard.classList.remove("hidden");
}

async function fetchNews(category) {
  newsLoader.classList.remove("hidden");
  newsError.classList.add("hidden");
  newsGrid.innerHTML = "";
  currentCategory = category;

  const section = GUARDIAN_SECTION_MAP[category] || "";
  let url = `${GUARDIAN_BASE_URL}?show-fields=thumbnail,trailText&page-size=6&api-key=${GUARDIAN_API_KEY}`;
  if (section) {
    url += `&section=${section}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to load news articles.");
    }
    const data = await response.json();
    displayNews(data.response.results);
  } catch (error) {
    newsError.classList.remove("hidden");
  } finally {
    newsLoader.classList.add("hidden");
  }
}

function displayNews(articles) {
  newsGrid.innerHTML = "";
  
  if (!articles || articles.length === 0) {
    newsGrid.innerHTML = `<p class="empty-msg">No articles found in this category.</p>`;
    return;
  }

  articles.forEach(article => {
    const card = document.createElement("div");
    card.className = "news-card";

    const title = article.webTitle || "No Title";
    const url = article.webUrl || "#";
    const imageUrl = article.fields && article.fields.thumbnail ? article.fields.thumbnail : "";
    const rawDesc = article.fields && article.fields.trailText ? article.fields.trailText : "";
    const sourceName = article.sectionName || "News";
    const rawDate = article.webPublicationDate;

    const cleanDesc = rawDesc.replace(/<[^>]*>/g, "");
    const description = cleanDesc.length > 0 
      ? cleanDesc.substring(0, 120) + "..." 
      : "No description available.";

    const publishedDate = rawDate
      ? new Date(rawDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
      : "Unknown Date";

    const imageHTML = imageUrl
      ? `<img class="news-thumbnail" src="${imageUrl}" alt="${title}">`
      : `<div class="news-no-image"><i class="bi bi-newspaper"></i></div>`;

    card.innerHTML = `
      ${imageHTML}
      <div class="news-body">
        <p class="news-headline">${title}</p>
        <p class="news-description">${description}</p>
        <div class="news-meta">
          <span class="news-source">${sourceName}</span>
          <span>${publishedDate}</span>
        </div>
        <a class="news-link" href="${url}" target="_blank" rel="noopener noreferrer">
          Read More <i class="bi bi-box-arrow-up-right"></i>
        </a>
      </div>
    `;

    newsGrid.appendChild(card);
  });
}

function detectUserLocation() {
  if (!navigator.geolocation) {
    fetchWeather({ city: "Mumbai" });
    fetchNews(currentCategory);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeather({ lat, lon });
      fetchNews(currentCategory);
    },
    error => {
      fetchWeather({ city: "Mumbai" });
      fetchNews(currentCategory);
    }
  );
}

citySearchForm.addEventListener("submit", event => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather({ city });
    cityInput.value = "";
  }
});

locateBtn.addEventListener("click", () => {
  detectUserLocation();
});

newsCategory.addEventListener("change", () => {
  fetchNews(newsCategory.value);
});

weatherRetryBtn.addEventListener("click", () => {
  if (currentLat && currentLon) {
    fetchWeather({ lat: currentLat, lon: currentLon });
  } else {
    fetchWeather({ city: currentCity || "Mumbai" });
  }
});

newsRetryBtn.addEventListener("click", () => {
  fetchNews(currentCategory);
});

document.addEventListener("DOMContentLoaded", () => {
  detectUserLocation();
});
