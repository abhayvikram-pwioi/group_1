async function getProducts() {

    const response =
        await fetch("https://dummyjson.com/products");

    const data =
        await response.json();

    renderProducts(data.products);

}

function renderProducts(products) {

    const productList = document.getElementById("product-list");

    productList.innerHTML = "";

    products.forEach(product => {
        
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

                            <h3>₹${product.price}</h3>


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

