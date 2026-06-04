const SHIPPING = 10;
const TAX_RATE = 0.05;
const COUPONS = {
    SAVE10: {
        type: "fixed",
        value: 10,
        message: "Coupon Applied! ₹10 Discount Added"
    },
    SAVE20: {
        type: "fixed",
        value: 20,
        message: "Coupon Applied! ₹20 Discount Added"
    },
    FREESHIP: {
        type: "shipping",
        value: SHIPPING,
        message: "Coupon Applied! Free Shipping Added"
    }
};

let discount = 0;
let activeCoupon = "";
let recommendedProducts = [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const FALLBACK_PRODUCT_IMAGE = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <rect width="300" height="300" fill="#eef2ff"/>
  <rect x="80" y="92" width="140" height="116" rx="18" fill="#d0d7f2"/>
  <circle cx="118" cy="132" r="18" fill="#5068c9"/>
  <path d="M80 196l42-46 34 34 24-28 40 40z" fill="#667085"/>
  <text x="150" y="238" text-anchor="middle" font-family="Arial" font-size="18" fill="#667085">Product</text>
</svg>
`)}`;

function formatPrice(amount) {
    return "₹" + Number(amount).toFixed(2);
}

function getDisplayPrice(product) {
    return Math.round(Number(product.price) * 10);
}

function getCartItems() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function getCartImage(item) {
    return item.image || item.thumbnail || (Array.isArray(item.images) && item.images[0]) || FALLBACK_PRODUCT_IMAGE;
}

function getCartPrice(item) {
    const price = Number(item.price) || 0;

    if (!item.image && item.thumbnail) {
        return Math.round(price * 10);
    }

    return price;
}

function getStoredProduct(product) {
    return {
        id: product.id,
        title: product.title,
        image: product.thumbnail || product.image,
        price: getDisplayPrice(product),
        category: product.category,
        stock: product.stock,
        quantity: 1
    };
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cartCount = document.getElementById("cart-count");

    if (!cartCount) return;

    const totalItems = getCartItems().reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    cartCount.textContent = totalItems;
    cartCount.classList.toggle("show", totalItems > 0);
}

document.addEventListener("DOMContentLoaded", () => {

    const menLink = document.getElementById("men");
    const container = document.getElementById("products-container");

    if (!menLink || !container) return;

    async function displayMenProducts() {
        try {
            container.innerHTML = "<h2>Loading Products...</h2>";

            const urls = [
                "https://dummyjson.com/products/category/mens-shirts",
                "https://dummyjson.com/products/category/mens-shoes",
                "https://dummyjson.com/products/category/mens-watches"
            ];

            const responses = await Promise.all(
                urls.map(url => fetch(url))
            );

            const data = await Promise.all(
                responses.map(response => response.json())
            );

            const allProducts = data.flatMap(item => item.products);

            container.innerHTML = "";

            allProducts.forEach(product => {
                const card = document.createElement("div");

                card.classList.add("product-card");

                card.innerHTML = `
                    <img src="${product.thumbnail}" alt="${product.title}">
                    <h3>${product.title}</h3>
                    <p>₹${Math.round(product.price * 10)}</p>
                `;

                container.appendChild(card);
            });

        } catch (error) {
            console.error("Error:", error);
            container.innerHTML = "<h2>Failed to load products.</h2>";
        }
    }

    menLink.addEventListener("click", (e) => {
        e.preventDefault();
        displayMenProducts();
    });

});

/* =========================
   UPDATE CART TOTALS
========================= */


function updateCart() {

    let subtotal = 0;

    const items = document.querySelectorAll(".cart-item");

    items.forEach(item => {

        const price = Number(item.dataset.price);

        const quantity = Number(
            item.querySelector(".quantity").textContent
        );

        subtotal += price * quantity;
    });

    const coupon = COUPONS[activeCoupon];
    const shipping = items.length === 0 ? 0 : SHIPPING;
    const tax = subtotal * TAX_RATE;

    if (coupon?.type === "fixed") {
        discount = coupon.value;
    } else if (coupon?.type === "shipping") {
        discount = shipping;
    } else {
        discount = 0;
    }

    let total = subtotal + shipping + tax - discount;

    if (total < 0) total = 0;

    document.getElementById("subtotal").textContent =
        formatPrice(subtotal);

    document.getElementById("shipping").textContent =
        formatPrice(shipping);

    document.getElementById("tax").textContent =
        formatPrice(tax);

    document.getElementById("total").textContent =
        formatPrice(total);

    const discountRow = document.getElementById("discountRow");
    const discountAmount = document.getElementById("discountAmount");

    if (discountRow && discountAmount) {
        discountAmount.textContent = "-" + formatPrice(discount);
        discountRow.classList.toggle("hidden", discount <= 0);
    }

    checkEmptyCart();
    updateCartCount();
}

/* =========================
   EMPTY CART STATE
========================= */

function checkEmptyCart() {

    const items =
        document.querySelectorAll(".cart-item");

    const emptyCart =
        document.querySelector(".empty-cart");

    const summary =
        document.querySelector(".cart-summary");

    if (items.length === 0) {

        emptyCart.classList.remove("hidden");

        if (summary) {
            summary.style.display = "none";
        }

    } else {

        emptyCart.classList.add("hidden");

        if (summary) {
            summary.style.display = "block";
        }
    }
}

/* =========================
   QUANTITY BUTTONS
========================= */

function initializeQuantityButtons() {

    const cartContainer = document.querySelector(".cart-items");

    if (!cartContainer) return;

    cartContainer.addEventListener("click", (e) => {
        const increaseButton = e.target.closest(".increase");
        const decreaseButton = e.target.closest(".decrease");

        if (!increaseButton && !decreaseButton) return;

        const card = e.target.closest(".cart-item");
        const productId = Number(card.dataset.id);
        const item = cart.find(product => product.id === productId);

        if (!item) return;

        if (increaseButton) {
            item.quantity++;
        }

        if (decreaseButton && item.quantity > 1) {
            item.quantity--;
        }

        saveCart();
        loadCartFromStorage();
    });
}

/* =========================
   REMOVE ITEM
========================= */

function initializeRemoveButtons() {

    const cartContainer = document.querySelector(".cart-items");

    if (!cartContainer) return;

    cartContainer.addEventListener("click", (e) => {
        const removeButton = e.target.closest(".remove-btn");

        if (!removeButton) return;

        const card = removeButton.closest(".cart-item");
        const productId = Number(card.dataset.id);

        cart = cart.filter(product => product.id !== productId);

        saveCart();
        loadCartFromStorage();
    });
}

/* =========================
   COUPON SYSTEM
========================= */

function initializeCoupon() {

    const couponButton =
        document.getElementById("applyCoupon");

    if (!couponButton) return;

    couponButton.addEventListener("click", () => {

        const code =
            document
                .getElementById("couponInput")
                .value
                .trim()
                .toUpperCase();

        if (COUPONS[code]) {
            activeCoupon = code;
            alert(COUPONS[code].message);
        } else {
            activeCoupon = "";

            alert(
                "Invalid Coupon Code"
            );
        }

        updateCart();
    });
}

/* =========================
   RECOMMENDATIONS
========================= */

async function loadRecommendations() {
    const recommendationGrid =
        document.getElementById("recommendationGrid");

    if (!recommendationGrid) return;

    try {
        recommendationGrid.innerHTML =
            '<p class="recommendation-status">Loading products...</p>';

        const response =
            await fetch("https://dummyjson.com/products?limit=6");

        if (!response.ok) {
            throw new Error("Unable to fetch recommendations");
        }

        const data = await response.json();
        recommendedProducts = data.products.slice(0, 3);

        recommendationGrid.innerHTML = "";

        recommendedProducts.forEach(product => {
            const card = document.createElement("div");
            const price = getDisplayPrice(product);

            card.classList.add("recommendation-card");
            card.dataset.id = product.id;

            card.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>${formatPrice(price)}</p>
                <button class="recommendation-add" data-id="${product.id}">
                    <i class="bi bi-cart-plus"></i>
                    Add to Cart
                </button>
            `;

            recommendationGrid.appendChild(card);
        });
    } catch (error) {
        console.error("Recommendation error:", error);
        recommendationGrid.innerHTML =
            '<p class="recommendation-status">Failed to load products.</p>';
    }
}

function initializeRecommendations() {
    const recommendationGrid =
        document.getElementById("recommendationGrid");

    if (!recommendationGrid) return;

    recommendationGrid.addEventListener("click", (e) => {
        const addButton = e.target.closest(".recommendation-add");

        if (!addButton) return;

        const productId = Number(addButton.dataset.id);
        const product = recommendedProducts.find(
            item => Number(item.id) === productId
        );

        if (!product) return;

        cart = getCartItems();

        const existingItem = cart.find(
            item => Number(item.id) === productId
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(getStoredProduct(product));
        }

        saveCart();
        loadCartFromStorage();
    });
}

/* =========================
   CHECKOUT
========================= */

function initializeCheckout() {

    const checkoutButton =
        document.getElementById("checkoutBtn");

    if (!checkoutButton) return;

    checkoutButton.addEventListener("click", () => {

        if (cart.length === 0) {
            alert("Your cart is empty");
            return;
        }

        localStorage.setItem("checkoutItems", JSON.stringify(cart));
        window.location.href = "checkout.html";
    });
}

/* =========================
   ADD MORE ITEMS
========================= */


function initializeAddItems() {

    const addButton =
        document.querySelector(".add-items-btn");

    if (!addButton) return;

    addButton.addEventListener("click", () => {

        window.location.href =
            "productpage.html";
    });
}

function loadCartFromStorage() {

    const cartContainer =
        document.querySelector(".cart-items");

    if (!cartContainer) return;

    const actions =
        document.querySelector(".cart-actions");

    const emptyCart =
        document.querySelector(".empty-cart");

    cartContainer.innerHTML = "";

    if (actions) {
        cartContainer.appendChild(actions);
    }

    cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.forEach(item => {
        const image = getCartImage(item);
        const price = getCartPrice(item);
        const cartItem = document.createElement("div");

        cartItem.classList.add("cart-item");
        cartItem.dataset.id = item.id;
        cartItem.dataset.price = price;

        cartItem.innerHTML = `
            <div class="product-image">
                <img src="${image}" alt="${item.title}" onerror="this.onerror=null;this.src='${FALLBACK_PRODUCT_IMAGE}'">
            </div>

            <div class="product-details">
                <div>
                    <h2>${item.title}</h2>
                    <p class="price">₹${price.toFixed(0)}</p>

                    <div class="product-meta">
                        <p class="stock">
                            <i class="bi bi-check-circle-fill"></i>
                            ${item.stock > 0 ? "In Stock" : "Limited Stock"}
                        </p>

                        <p class="delivery">
                            Free delivery by tomorrow
                        </p>
                    </div>
                </div>

                <div class="quantity-controls">
                    <button class="decrease">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase">+</button>
                </div>

                <button class="remove-btn">Remove</button>
            </div>
        `;

        cartContainer.appendChild(cartItem);
    });

    if (emptyCart) {
        cartContainer.appendChild(emptyCart);
    }

    updateCart();
}

/* =========================
   INITIALIZE APP
========================= */

document.addEventListener("DOMContentLoaded", () => {

    loadCartFromStorage();

    initializeQuantityButtons();

    initializeRemoveButtons();

    initializeCoupon();

    initializeCheckout();

    initializeAddItems();

    initializeRecommendations();

    loadRecommendations();

    updateCart();
});

window.addEventListener("storage", (e) => {
    if (e.key === "cart") {
        updateCartCount();
    }
});