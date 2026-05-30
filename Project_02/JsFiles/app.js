let allProducts = [];

async function getProducts(){

    const response = await fetch("https://dummyjson.com/products");

    const data = await response.json();

    allProducts = data.products;

    renderProducts(allProducts);

}

function renderProducts(products) {

    document.querySelector(".product-count").textContent = `${products.length} Products`;


    const productList = document.getElementById("product-list");

    productList.innerHTML = "";

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
                                <span id="rating-count">(200})</span>
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


function applyFilters(){

    const selectedCategories = [];

    categoryCheckboxes.forEach(box => {

        if(box.checked){
            selectedCategories.push(box.value.toLowerCase());
        }

    });

     if(selectedCategories.length === 0){

        renderProducts(allProducts);

        return;

    }

    const filteredProducts = allProducts.filter(product =>
            selectedCategories.includes( product.category.toLowerCase() )
    );

    renderProducts(filteredProducts);

}