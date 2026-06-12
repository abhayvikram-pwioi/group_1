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
        console.log(newsData.articles);
        return newsData.articles;

    }

    catch (error) {

        alert(error.message);

    }

}

(async () => {

    const articles = await getNews("general");
    renderNewsCards(articles);

})();


const topicSelect = document.getElementById("newsCategory");

topicSelect.addEventListener("change", async () => {

    const articles = await getNews(topicSelect.value);

    if (!articles || articles.length === 0) {
        showNoResults();
        return;
    }

    renderNewsCards(articles);
});

const searchBtn = document.getElementById("search-btn");

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

        alert(error.message);
    }

}


function renderNewsCards(articles) {
    const container = document.getElementById("news-container");

    container.innerHTML = "";



    articles.slice(0, 6).forEach(article => {
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
                    <a hjref= "${article.url}">Read more</a>
                    </div>

            </div>

        `
    });

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