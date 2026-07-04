// const API_KEy = "6853a4c4a5c1518b55a4600dd0c750a6";

async function getNews(category) {
    const newsUrl = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=in&apikey=${API_KEy}`;

    try {

        const res = await fetch(newsUrl);

        if (res.status === 429) {
            throw new Error("API Limit Reached");
        }

        if (!res.ok) {
            throw new Error("Something went wrong");
        }

        const newsData = await res.json();

        if (newsData.articles.length === 0) {
            throw new Error("No Articles Available");
        }
        return newsData.articles;

    }

    catch (error) {
        console.error(error);
        alert(error.message);
        return [];

    }

}


const topicSelect = document.getElementById("newsCategory");

if (topicSelect) {


    (async () => {

        const articles = await getNews("general");
        renderNewsCards(articles);

    })();

    topicSelect.addEventListener("change", async () => {

        const articles = await getNews(topicSelect.value);

        if (!articles || articles.length === 0) {
            showNoResults();
            return;
        }

        renderNewsCards(articles);
    });

    const searchBtn = document.getElementById("search-btn-news");

    searchBtn.addEventListener("click", async () => {

        const query = document.getElementById("searchNews").value.trim();

        const category = document.getElementById("newsCategory").value;

        let articles;

        if (query) {
            articles = await searchNews(query, category);

        }
        else {

            articles = await getNews(category);

        }

        if (!articles || articles.length === 0) {
            showNoResults();
            return;
        }

        renderNewsCards(articles);

    });


    async function searchNews(query, category) {

        const searchTerm = `${query} ${category}`;
        try {

            const res = await fetch(`https://gnews.io/api/v4/search?q=${encodeURIComponent(searchTerm)}&lang=en&apikey=${API_KEy}`);

            const data = await res.json();

            if (res.status === 429) {
                throw new Error("API Limit Reached");
            }

            if (!res.ok) {
                throw new Error("Something went wrong");
            }

            return data.articles;
        } catch (error) {
            console.error(error);
            alert(error.message);
            return [];
        }

    }


    function renderNewsCards(articles) {
        const container = document.getElementById("news-container");

        container.innerHTML = "";

        articles.slice(0, 6).forEach((article, index) => {
            const date = new Date(article.publishedAt);

            const formattedDate = date.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });

            container.innerHTML += `
            <div class="news-card">
                <div class="img-sec">
                    <img src="${article.image}" alt="image" class="img-news">
                </div>
                <div class="news-card-details">
                    <h4 class="source">${article.source.name}</h4>
                    <h3 class="title"> ${article.title}</h3>
                    <p class="description">${article.description || "No description"}</p>
                </div>
                <hr class="news-hr">
                    <div class="news-card-bottom">
                        <p id="date">${formattedDate}</p>
                    <a class = "read-more" data-index= "${index}">Read more</a>
                    </div>

            </div>

        `
        });

        document.querySelectorAll(".read-more").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                const index = Number(btn.dataset.index);
                localStorage.setItem("selectedArticle", JSON.stringify(articles[index]));
                localStorage.setItem("allArticles", JSON.stringify(articles));
                window.location.href = "news-detail.html";
            });
        })

    }

    function showNoResults() {

        const container = document.getElementById("news-container");

        container.innerHTML = `

    <div class="news-not-sec">
                    <i class="fa-solid fa-file-circle-xmark no-article-icon"></i>
                    <h2>No Articles</h2>
                    <p>No articles available for this category at the moment.</p>
                 </div>


    `;
    }





    // =================================TIME FOR GREETING ======================================

    function updateDateTime() {

        const now = new Date();

        // Greeting
        const hour = now.getHours();

        let greeting = "";

        if (hour >= 5 && hour < 12) {
            greeting = "Good Morning";
        }
        else if (hour >= 12 && hour < 17) {
            greeting = "Good Afternoon";
        }
        else if (hour >= 17 && hour < 21) {
            greeting = "Good Evening";
        }
        else {
            greeting = "Good Night";
        }

        document.getElementById("greeting-text").textContent =
            `${greeting}`;


        document.getElementById("greeting-date").textContent =
            now.toLocaleDateString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "long"
            });


        document.getElementById("greeting-time").textContent =
            now.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });
    }

    updateDateTime();

    setInterval(updateDateTime, 1000);

}

const image = document.getElementById("news-page-img");

async function renderNewsOnPage() {
    const article = JSON.parse(localStorage.getItem("selectedArticle"));

    console.log(article);
    if (!(article)) return;

    const title = document.getElementById("news-page-title");
    const description = document.getElementById("news-page-summary");
    const content = document.getElementById("news-page-content");
    const source = document.getElementById("news-page-brand");
    const date = document.getElementById("news-page-date");

    title.textContent = article.title;
    image.src = article.image;
    description.textContent = article.description;
    content.textContent = article.content;
    source.textContent = article.source.name;

    const formattedDate = new Date(article.publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    date.textContent = formattedDate;

    const allArticles = JSON.parse(localStorage.getItem("allArticles"));

    const related = allArticles.filter(a => {
        return a.title !== article.title
    })

    const container = document.getElementById("related-news-container");
    container.innerHTML = "";

    related.slice(0, 3).forEach((article, index) => {
        const date = new Date(article.publishedAt);

        const formattedDate = date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        container.innerHTML += `
            <div class="news-card">
                <div class="img-sec">
                    <img src="${article.image}" alt="image" class="img-news">
                </div>
                <div class="news-card-details">
                    <h4 class="source">${article.source.name}</h4>
                    <h3 class="title"> ${article.title}</h3>
                    <p class="description">${article.description || "No description"}</p>
                </div>
                <hr class="news-hr">
                    <div class="news-card-bottom">
                        <p id="date">${formattedDate}</p>
                    <a class = "read-more" data-index= "${index}">Read more</a>
                    </div>

            </div>

        `
    });

    document.querySelectorAll(".read-more").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const index = Number(btn.dataset.index);
            localStorage.setItem("selectedArticle", JSON.stringify(related[index]));
            localStorage.setItem("allArticles", JSON.stringify(related));
            window.location.href = "news-detail.html";
        });
    })

}

if (image) {
    renderNewsOnPage();
}