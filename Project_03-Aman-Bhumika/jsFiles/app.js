const API_KEY = "6853a4c4a5c1518b55a4600dd0c750a6";

async function getNews(category) {
    const newsUrl = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=in&apikey=${API_KEY}`;

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
        console.log(newsData.articles);

    }

    catch (error) {

        alert(error.message);

    }

}
// getNews("technology");

(async () => {

    // const articles = await getNews("technology");
    // renderNewsCards(articles);

})();


function renderNewsCards(articles) {
    const container = document.getElementById("news-container");

    container.innerHTML = "";

    articles.forEach(article => {

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
                        <p id="date">${new Date(article.publishedAt).toLocaleDateString("en-GB")}</p>
                    <a hjref= "${article.url}">Read more</a>
                    </div>

            </div>

        `
    });

}