// =====================
// CART & WISHLIST
// =====================

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

let wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

const cartCount =
    document.getElementById("cart-count");

const wishlistCount =
    document.getElementById("wishlist-count");

    function updateCounts() {

    cartCount.textContent = cart.reduce(
    (total, item) => total + item.quantity,
    0
);

    wishlistCount.textContent =
        wishlist.length;

}

function saveData() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    updateCounts();
}

// cartCount.textContent = cart.length;
// wishlistCount.textContent = wishlist.length;

   updateCounts();

// =====================
// FETCH PRODUCTS
// =====================
let store = [];
async function getProducts(){
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();
    for(let product of data.products) {
        store.push(product);
    }
    loadProducts();
}

function loadProducts(){
    // console.log(
    // [...new Set(store.map(
    //     product => product.category
    // ))]
//);
    const beautyProducts = store.filter(product => product.category === "beauty").slice(0,4);
    const groceryProducts = store.filter(product => product.category === "groceries").slice(0,4);;
    const perfumeProducts = store.filter(product => product.category === "fragrances").slice(0,4);;
    

    const beautyContainer = document.getElementById("beauty-products");
    const groceriesContainer = document.getElementById("grocery-products");
    const perfumeContainer = document.getElementById("perfumes-products");

     renderProducts(beautyProducts,beautyContainer);
     renderProducts(groceryProducts,groceriesContainer);
     renderProducts(perfumeProducts,perfumeContainer);

    
}
function renderProducts(products, container) {

    container.innerHTML = "";

    products.forEach(product => {
        const cartItem = cart.find(
    item => item.id === product.id
    );

        container.innerHTML += `
            <div class="card">

                <img
                    src="${product.thumbnail}"
                    alt="${product.title}"
                >

                <i
                    class="fa-solid fa-heart wishlist-btn
                    ${wishlist.includes(product.id) ? "active" : ""}"
                    data-id="${product.id}">
                </i>

                <h3>${product.title}</h3>

                <p>
                    ${product.description.slice(0, 60)}...
                </p>
                <div class="rating">
                ⭐ ${product.rating}
                </div>

                <p class="price">
                    ₹${Math.round(product.price * 85)}
                </p>

                <div class="btn">

                   ${
cartItem
?
`
<div class="quantity-box">

    <button
        class="minus"
        data-id="${product.id}">
        -
    </button>

    <span class="qty">
        ${cartItem.quantity}
    </span>

    <button
        class="plus"
        data-id="${product.id}">
        +
    </button>

</div>
`
:
`
<button
    class="add-cart"
    data-id="${product.id}">
    Add To Cart
</button>
`
}

                    <button
                        class="buy-now"
                        data-id="${product.id}">
                        Buy Now
                    </button>

                </div>

            </div>
        `;
    });
}

getProducts();

       document.addEventListener("click", (e) => {
        if(
    e.target.classList.contains("plus")
){

    const id =
        Number(e.target.dataset.id);

    const item =
        cart.find(
            item => item.id === id
        );

    item.quantity++;

    saveData();

    loadProducts();
}

if(
    e.target.classList.contains("minus")
){

    const id =
        Number(e.target.dataset.id);

    const item =
        cart.find(
            item => item.id === id
        );

    item.quantity--;

    if(item.quantity <= 0){

        cart = cart.filter(
            item => item.id !== id
        );
    }

    saveData();

    loadProducts();
}

    // ==================
    // WISHLIST
    // ==================

    if (
        e.target.classList.contains(
            "wishlist-btn"
        )
    ) {

        const productId =
            Number(
                e.target.dataset.id
            );

        if (
            wishlist.includes(productId)
        ) {

            wishlist =
                wishlist.filter(
                    id => id !== productId
                );

        } else {

            wishlist.push(productId);

        }

        saveData();

        loadProducts();
    }

    // ==================
    // ADD TO CART
    // ==================

    if (
        e.target.classList.contains(
            "add-cart"
        )
    ) {

        const productId =
            Number(
                e.target.dataset.id
            );

        const existingItem =
    cart.find(item =>
        item.id === productId
    );

if(existingItem){

    existingItem.quantity++;

}else{

    cart.push({
        id: productId,
        quantity: 1
    });

}

        saveData();

        loadProducts();
    }

});


