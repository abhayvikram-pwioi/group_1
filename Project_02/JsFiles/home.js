// =====================
// CART & WISHLIST
// =====================

let addedProducts = [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];



const cartCount = document.getElementById("cart-count");

const wishlistCount = document.getElementById("wishlist-count");


// =====================
// FETCH PRODUCTS
// =====================

let store = [];
async function getProducts() {
    const response = await fetch("https://dummyjson.com/products");
    const data = await response.json();
    for (let product of data.products) {
        store.push(product);
    }
    loadProducts();
}

function loadProducts() {
    // console.log(
    // [...new Set(store.map(
    //     product => product.category
    // ))]
    //);
    const beautyProducts = store.filter(product => product.category === "beauty").slice(0, 4);
    const groceryProducts = store.filter(product => product.category === "groceries").slice(0, 4);;
    const perfumeProducts = store.filter(product => product.category === "fragrances").slice(0, 4);;


    const beautyContainer = document.getElementById("beauty-products");
    const groceriesContainer = document.getElementById("grocery-products");
    const perfumeContainer = document.getElementById("perfumes-products");

    renderProducts(beautyProducts, beautyContainer);
    renderProducts(groceryProducts, groceriesContainer);
    renderProducts(perfumeProducts, perfumeContainer);


}

function renderProducts(products, container) {

    container.innerHTML = "";

    products.forEach(product => {
        const cartItem = cart.find(
            item => item.id === product.id
        );

        container.innerHTML += `
            <div class="card">
                <div class= "img-box">
                <img
                    src="${product.thumbnail}"
                    alt="${product.title}"
                >
                    </div>
                <i
                    class="fa-regular fa-heart wishlist-btn
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
                    ₹${Math.round(product.price * 10)}
                </p>

         

   <div class="btn">

${addedProducts.includes(product.id)
                ? `
<button class="added-btn">
    <i class="fa-solid fa-check"></i>
    Added
</button>
`
                : `
<button
    class="add-btn"
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

     </div>`
    });
}

getProducts();







document.addEventListener("click", (e) => {

    const addBtn = e.target.closest(".add-btn");

    if (!addBtn) return;

    const productId = Number(addBtn.dataset.id);

    addToCart(productId);

});

function addToCart(productId, quantity = 1) {

    const product = store.find(
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

    updateCartCount();
}



document.addEventListener("click", (e) => {

    const buyBtn = e.target.closest(".buy-now");
    if (!buyBtn) return;

    const productId = Number(buyBtn.dataset.id);

    const product = store.find(
        p => p.id === productId
    );

    localStorage.setItem("checkoutProduct", JSON.stringify({
        ...product,
        quantity: 1
    })
    );

    console.log(product);

    window.location.href = "checkout.html";

});



document.addEventListener("click", (e) => {

    const wishBtn = e.target.closest(".wishlist-btn");

    if (!wishBtn) return;

    const productId =
        Number(wishBtn.dataset.id);

    addToWishlist(productId);

});


function addToWishlist(productId) {

    const product = store.find(
        p => p.id === productId
    );

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const exists = wishlist.find(
        item => item.id === productId
    );

    if (exists) {
        wishlist = wishlist.filter(
            item => item.id !== productId
        );

    } else {

        wishlist.push(product);

    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistIcons();
    updateWishlistCount();
}


function updateWishlistIcons() {

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    document.querySelectorAll(".wishlist-btn").forEach(btn => {

            const productId =
                Number(btn.dataset.id);

            const exists =
                wishlist.some(
                    item => item.id === productId
                );

            if (exists) {

                btn.classList.remove("fa-regular");

                btn.classList.add("fa-solid");

                btn.style.color = "red";

            } else {

                btn.classList.remove("fa-solid");

                btn.classList.add("fa-regular");

                btn.style.color = "";

            }

        });


}

document.addEventListener("dragstart", (e) => {

    const card = e.target.closest(".card");

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



function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const cartCount = document.getElementById("cart-count");

    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

updateCartCount();


function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const wishlistCount = document.getElementById("wishlist-count");

    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
}

updateWishlistCount();
