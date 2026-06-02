let allProducts = [];

async function getProducts() {

    const response = await fetch("https://dummyjson.com/products");

    const data = await response.json();

    allProducts = data.products;

    if (document.getElementById("product-list")) {
        renderProducts(allProducts);
    }

    if (document.querySelector(".more-products")) {
        renderSuggestedProducts();
    }

}

getProducts();

const filter = document.getElementById("filter-head");

if (filter) {

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
        
           <div class="product-card" draggable="true"     data-id="${product.id}" >

                        <div class="product-img-box">
                            <img src="${product.thumbnail}" alt="book" id="product-img"  data-id="${product.id}">

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
                                   ${getStars(product.rating)}
                                <span id="rating-count">(200)</span>
                            </div>

                            <h3>₹${price}</h3>


                            <div class="product-card-btns">

                                <button class="add-btn" data-id="${product.id}">
                                    <i class="fa-solid fa-basket-shopping"></i> Add
                                </button>

                                <button class="buy-btn" data-id = "${product.id}">
                                    <i class="fa-solid fa-bag-shopping"></i> Buy Now
                                </button>

                            </div>

                        </div>

                    </div>
        
        `
        });



    }


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


            const ratingMatch = selectedRating === 0 ? true : product.rating >= selectedRating;

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

}


document.addEventListener("click", (e) => {

    const img = e.target.closest("#product-img");

    if (!img) return;

    const productId = Number(img.dataset.id);

    const selectedProduct =
        allProducts.find(
            product => product.id === productId
        );

    localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));

    window.location.href = "product-details-page.html";

});



const savedProduct = localStorage.getItem("selectedProduct");

if (savedProduct) {

    const product = JSON.parse(savedProduct);

    const title = document.getElementById("product-title");

    if (title) {

        document.getElementById("product-title").textContent = product.title;

        document.getElementById("product-image").src = product.thumbnail;

        document.getElementById("product-description").textContent = product.description;

        document.getElementById("product-category").textContent = product.category;

        document.getElementById("product-stock").textContent = `(${product.stock})`;

        document.getElementById("product-price").textContent = `₹${(product.price * 100).toFixed(0)}`;

        document.getElementById("product-tag-1").textContent = `• ${product.tags[0]}`;
        document.getElementById("product-tag-2").textContent = `• ${product.tags[1]}`;

        // document.getElementById("product-discounted-price").textContent = 

        document.getElementById("discount-percent").textContent = `${product.discountPercentage} %`;

        document.getElementById("product-brand").textContent = `Brand : ${product.brand}`;
        document.getElementById("product-dimensions").textContent = `Dimensions : ${product.dimensions.width}cm X ${product.dimensions.height}cm X ${product.dimensions.depth}cm`;
        const weight = Number(product.weight) * 10;
        document.getElementById("product-weight").textContent = `Weight : ${weight}g`;

        document.getElementById("brand").textContent = `${product.brand}`;
        document.getElementById("weight").textContent = `${weight}g`;

        document.getElementById("warranty").textContent = `${product.warrantyInformation}`;

        document.getElementById("product-rating").innerHTML = `${getStars(product.rating)}`;
    }

}

const minusBtn = document.getElementById("minus-btn");

const plusBtn = document.getElementById("plus-btn");

const quantityEl = document.getElementById("quantity");

if (plusBtn) {
    let quantity = 1;

    plusBtn.addEventListener("click", () => {
        quantity++;
        quantityEl.textContent = quantity;
    });

    minusBtn.addEventListener("click", () => {

        if (quantity > 1) {
            quantity--;
            quantityEl.textContent = quantity;

        }

    });

}

function getStars(rating) {

    let stars = "";

    const fullStars = Math.floor(rating);

    for (let i = 0; i < fullStars; i++) {

        stars +=
            `<i class="fa-solid fa-star"></i>`;
    }

    for (let i = fullStars; i < 5; i++) {

        stars +=
            `<i class="fa-regular fa-star"></i>`;
    }

    return stars;
}


function renderSuggestedProducts() {

    const currentProduct = JSON.parse(localStorage.getItem("selectedProduct"));
    if (!currentProduct) return;
    const suggestedProducts = allProducts.filter(
        product =>
            product.category === currentProduct.category &&
            product.id !== currentProduct.id
    ).slice(0, 4);


    const moreProductsList = document.querySelector(".more-products");


    moreProductsList.innerHTML = "";

    suggestedProducts.forEach(product => {

        let price = (product.price * 10).toFixed(0);

        moreProductsList.innerHTML += `
     
      <div class="product-card" draggable="true"     data-id="${product.id}" >

                        <div class="product-img-box">
                            <img src="${product.thumbnail}" alt="book" id="product-img"  data-id="${product.id}">

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
                                   ${getStars(product.rating)}
                                <span id="rating-count">(200)</span>
                            </div>

                            <h3>₹${price}</h3>


                            <div class="product-card-btns">

                                <button class="add-btn" data-id="${product.id}">
                                    <i class="fa-solid fa-basket-shopping"></i> Add
                                </button>

                                <button class="buy-btn" data-id = "${product.id}">
                                     <i class="fa-solid fa-bag-shopping"></i> Buy Now
                                </button>

                            </div>

                        </div>

                    </div>
                    
     `


    });

}


document.addEventListener("click", (e) => {

    const addBtn = e.target.closest(".add-btn");

    if (!addBtn) return;

    const productId = Number(addBtn.dataset.id);

    addToCart(productId);

});

function addToCart(productId, quantity = 1) {

    const product = allProducts.find(
        p => p.id === productId

    );


    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {

        existingItem.quantity += quantity;

    } else {

        cart.push({
            ...product,
            quantity
        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));


}


const addDetailBtn = document.getElementById("add-to-cart-detail");

if (addDetailBtn) {

    addDetailBtn.addEventListener("click", (e) => {
        const product = JSON.parse(localStorage.getItem("selectedProduct"));

        const quantity = Number(document.getElementById("quantity").textContent);

        addToCart(product.id, quantity);
    })

}



document.addEventListener("click", (e) => {

    const buyBtn = e.target.closest(".buy-btn");

    if (!buyBtn) return;

    const productId = Number(buyBtn.dataset.id);

    const product = allProducts.find(
        p => p.id === productId
    );

    localStorage.setItem("checkoutProduct", JSON.stringify({
        ...product,
        quantity: 1
    })
    );
    console.log(product);

    // window.location.href = "checkout.html";
});


const buyNowDetail = document.getElementById("buyNow-btn");

if (buyNowDetail) {

    buyNowDetail.addEventListener("click",(e)=>{

        const quantity = Number(document.getElementById("quantity").textContent);
        const product = JSON.parse(localStorage.getItem("selectedProduct"));

        if(!product) return;
   
         localStorage.setItem("checkoutProduct", JSON.stringify({
           ...product,
           quantity
       })
       );

    // window.location.href = "checkout.html";

    })
}

document.addEventListener("dragstart", (e) => {

    const card = e.target.closest(".product-card");

    if (!card) return;

    e.dataTransfer.setData(
        "productId",
        card.dataset.id
    );

});


const cartZone = document.getElementById("cart-zone");

cartZone.addEventListener("dragover", (e) => {
    e.preventDefault();
});

cartZone.addEventListener("drop", (e) => {

    e.preventDefault();

    const productId =
    Number(
        e.dataTransfer.getData(
            "productId"
        )
    );

    addToCart(productId);

});

cartZone.addEventListener("dragenter", () => {

    cartZone.classList.add("active-drop");

});

cartZone.addEventListener("dragleave", () => {

    cartZone.classList.remove("active-drop");

});

cartZone.addEventListener("drop", () => {

    cartZone.classList.remove("active-drop");

});