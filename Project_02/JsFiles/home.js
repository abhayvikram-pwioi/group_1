// =====================
// STORE
// =====================

const store = {
    men: [],
    women: [],
    accessories: []
};

// =====================
// CART & WISHLIST
// =====================

const cart =
    JSON.parse(localStorage.getItem("cart")) || [];

const wishlist =
    JSON.parse(localStorage.getItem("wishlist")) || [];

const cartCount =
    document.getElementById("cart-count");

const wishlistCount =
    document.getElementById("wishlist-count");

cartCount.textContent = cart.length;
wishlistCount.textContent = wishlist.length;

// =====================
// FETCH PRODUCTS
// =====================

async function loadProducts() {
    try {

        const [
            menShirts,
            menShoes,
            menWatches,
            womenDresses,
            womenShoes,
            womenBags,
            womenJewellery,
            womenWatches,
            sunglasses
        ] = await Promise.all([

            fetch("https://dummyjson.com/products/category/mens-shirts")
                .then(res => res.json()),

            fetch("https://dummyjson.com/products/category/mens-shoes")
                .then(res => res.json()),

            fetch("https://dummyjson.com/products/category/mens-watches")
                .then(res => res.json()),

            fetch("https://dummyjson.com/products/category/womens-dresses")
                .then(res => res.json()),

            fetch("https://dummyjson.com/products/category/womens-shoes")
                .then(res => res.json()),

            fetch("https://dummyjson.com/products/category/womens-bags")
                .then(res => res.json()),

            fetch("https://dummyjson.com/products/category/womens-jewellery")
                .then(res => res.json()),

            fetch("https://dummyjson.com/products/category/womens-watches")
                .then(res => res.json()),

            fetch("https://dummyjson.com/products/category/sunglasses")
                .then(res => res.json())

        ]);

        store.men = [
            ...menShirts.products,
            ...menShoes.products,
            ...menWatches.products
        ];

        store.women = [
            ...womenDresses.products,
            ...womenShoes.products,
            ...womenBags.products,
            ...womenJewellery.products,
            ...womenWatches.products
        ];

        store.accessories = [
            ...sunglasses.products,
            ...womenJewellery.products,
            ...menWatches.products,
            ...womenWatches.products
        ];

        renderProducts(
            store.men,
            "men-products"
        );

        renderProducts(
            store.women,
            "women-products"
        );

        renderProducts(
            store.accessories,
            "accessories-products"
        );

    } catch (error) {
        console.error(error);
    }
}

// =====================
// RENDER PRODUCTS
// =====================

function renderProducts(products, containerId) {

    const container =
        document.getElementById(containerId);

    container.innerHTML = products.map(product => `

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

            <p class="price">
                ₹${Math.round(product.price * 85)}
            </p>

            <div class="btn">

                <button
                    class="add-cart"
                    data-id="${product.id}">
                    ${cart.includes(product.id)
                        ? "Added ✓"
                        : "Add to Cart"}
                </button>

                <button class="buy-now">
                    Buy Now
                </button>

            </div>

        </div>

    `).join("");
}

// =====================
// EVENT DELEGATION
// =====================

document.addEventListener("click", (e) => {

    // ADD TO CART

    if (e.target.classList.contains("add-cart")) {

        const productId =
            Number(e.target.dataset.id);

        if (!cart.includes(productId)) {

            cart.push(productId);

            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );

            cartCount.textContent =
                cart.length;

            e.target.textContent =
                "Added ✓";
        }
    }

    // WISHLIST

    if (e.target.classList.contains("wishlist-btn")) {

        const productId =
            Number(e.target.dataset.id);

        if (wishlist.includes(productId)) {

            const index =
                wishlist.indexOf(productId);

            wishlist.splice(index, 1);

            e.target.classList.remove("active");

        } else {

            wishlist.push(productId);

            e.target.classList.add("active");
        }

        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );

        wishlistCount.textContent =
            wishlist.length;
    }
});

// =====================
// INITIAL LOAD
// =====================

loadProducts();