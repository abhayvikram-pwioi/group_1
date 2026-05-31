let allProducts = [];

async function getProducts() {

    const response = await fetch("https://dummyjson.com/products");

    const data = await response.json();

    allProducts = data.products;

    renderProducts(allProducts);

}

function renderProducts(products) {

    document.querySelector(".product-count").textContent = `${products.length} Products`;


    const productList = document.getElementById("product-list");

    productList.innerHTML = "";

    if (products.length === 0) {

        productList.innerHTML = `
            <h2>No Products Found</h2>
        `;

        return;
    }


    products.forEach(product => {

        let price = (product.price * 10).toFixed(0);

        productList.innerHTML += `
        
           <div class="product-card">

                        <div class="product-img-box">
                            <img src="${product.thumbnail}" alt="book" id="product-img">

                            <button class="product-card-wishlist">
                                <i class="fa-regular fa-heart"></i>
                            </button>
                        </div>


                        <div class="product-content">

                            <span class="product-category">
                                   ${product.category}
                            </span>

                            <h2>
                                ${product.title}
                            </h2>

                            <div class="product-card-rating">
                                ⭐⭐⭐⭐☆
                                <span id="rating-count">(200)</span>
                            </div>

                            <h3>₹${price}</h3>


                            <div class="product-card-btns">

                                <button class="add-btn">
                                    <i class="fa-solid fa-basket-shopping"></i> Add
                                </button>

                                <button class="view-btn">
                                    <i class="fa-solid fa-eye"></i> Quick View
                                </button>

                            </div>

                        </div>

                    </div>
        
        `
    });



}

getProducts();


const categoryCheckboxes = document.querySelectorAll('input[type="checkbox"]');

categoryCheckboxes.forEach(box => {

    box.addEventListener("change", applyFilters);

});



const priceSlider = document.getElementById("priceSlider");

const priceValueMax = document.getElementById("priceValueMax");

priceSlider.addEventListener("input", (e) => {
    priceValueMax.textContent = `₹${Number(priceSlider.value).toLocaleString("en-IN")}`;
});

priceSlider.addEventListener("input", applyFilters);



const sortTopics = document.getElementById("sort-topics");

sortTopics.addEventListener("change", applyFilters);



const ratingLinks = document.querySelectorAll(".rating-list a");

let selectedRating = 0;

ratingLinks.forEach(e => {

    e.addEventListener("click", () => {

        selectedRating = Number(e.dataset.rating);

        applyFilters();

    });

});




function applyFilters() {

    const selectedCategories = [];

    categoryCheckboxes.forEach(box => {

        if (box.checked) {
            selectedCategories.push(box.value.toLowerCase());
        }

    });

    const maxPrice = Number(priceSlider.value);


    const filteredProducts = allProducts.filter(product => {
        const categoryMatch = selectedCategories.length === 0 ? true : selectedCategories.includes(product.category.toLowerCase());

        const actualPrice = Math.round(product.price * 10);

        const priceMatch = actualPrice <= maxPrice;


         const ratingMatch = selectedRating === 0? true: product.rating >= selectedRating;

        return (
            categoryMatch &&
            priceMatch &&
            ratingMatch
        );
    });

    const sortValue = sortTopics.value;

    if (sortValue === "lowToHigh") {

        filteredProducts.sort((a, b) => a.price - b.price);

    } else if (sortValue === "highToLow") {

        filteredProducts.sort((a, b) => b.price - a.price);

    } else if (sortValue === "popularity") {

        filteredProducts.sort((a, b) => b.rating - a.rating);
    }


    renderProducts(filteredProducts);


}



