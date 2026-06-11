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

