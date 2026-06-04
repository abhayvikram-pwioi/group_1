
const FALLBACK_PRODUCT_IMAGE = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <rect width="300" height="300" fill="#eef2ff"/>
  <rect x="80" y="92" width="140" height="116" rx="18" fill="#d0d7f2"/>
  <circle cx="118" cy="132" r="18" fill="#5068c9"/>
  <path d="M80 196l42-46 34 34 24-28 40 40z" fill="#667085"/>
  <text x="150" y="238" text-anchor="middle" font-family="Arial" font-size="18" fill="#667085">Product</text>
</svg>
`)}`;
let wishlistMessageTimer;

function updateCartCount() {

    const cartCount =
        document.getElementById("cart-count");

    if (!cartCount) return;

    const totalItems =
        getCartItems().reduce(
            (total, item) =>
                total + Number(item.quantity || 0),
            0
        );

    cartCount.textContent = totalItems;

    cartCount.classList.toggle(
        "show",
        totalItems > 0
    );
}

function updateWishlistIconCount() {

    const wishlistCount =
        document.getElementById("wishlist-icon-count");

    if (!wishlistCount) return;

    const totalItems =
        getWishlistItems().length;

    wishlistCount.textContent =
        totalItems;

    wishlistCount.classList.toggle(
        "show",
        totalItems > 0
    );
}

function getStoredItems(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveStoredItems(key, items) {
    localStorage.setItem(key, JSON.stringify(items));
}

function getCartItems() {
    return getStoredItems("cart");
}

function saveCartItems(items) {

    saveStoredItems("cart",items);

    updateCartCount();
}

function getWishlistItems() {
    return getStoredItems("wishlist");
}

function saveWishlistItems(items) {

    saveStoredItems("wishlist",items);

    updateWishlistIconCount();
}

function getWishlistImage(item) {
    return item.image || item.thumbnail || (Array.isArray(item.images) && item.images[0]) || FALLBACK_PRODUCT_IMAGE;
}

function getWishlistPrice(item) {
    const price = Number(item.price) || 0;

    if (item.image && !item.thumbnail) {
        return price;
    }

    return Math.round(price * 10);
}

function getCartProduct(item) {
    return {
        id: item.id,
        title: item.title,
        image: getWishlistImage(item),
        price: getWishlistPrice(item),
        category: item.category,
        stock: item.stock || 1,
        quantity: 1
    };
}

function addItemToCart(item) {
    const cart = getCartItems();
    const existingItem = cart.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(getCartProduct(item));
    }

    saveCartItems(cart);
}

function showWishlistFeedback(message) {
    const feedback = document.getElementById("wishlist-message");

    if (!feedback) return;

    feedback.textContent = message;
    feedback.classList.add("show");

    clearTimeout(wishlistMessageTimer);
    wishlistMessageTimer = setTimeout(() => {
        feedback.classList.remove("show");
    }, 2200);
}

function updateWishlistCount(count) {
    const productCount = document.getElementById("wishlist-product-count");

    if (!productCount) return;

    productCount.textContent = `${count} ${count === 1 ? "product" : "products"}`;
}

function renderWishlist() {
    updateCartCount();
    updateWishlistIconCount();
    const wishlist = getWishlistItems();
    const container = document.getElementById("wishlist-container");
    const count = document.getElementById("wishlist-count");
    const emptyWishlist = document.querySelector(".empty-wishlist");
    const summary = document.querySelector(".wishlist-summary");

    if (!container || !count || !emptyWishlist) return;

    container.innerHTML = "";
    count.textContent = wishlist.length;
    updateWishlistCount(wishlist.length);

    if (wishlist.length === 0) {
        emptyWishlist.classList.remove("hidden");

        if (summary) {
            summary.style.display = "none";
        }

        return;
    }

    emptyWishlist.classList.add("hidden");

    if (summary) {
        summary.style.display = "block";
    }

    wishlist.forEach(item => {
        const wishlistItem = document.createElement("div");

        wishlistItem.classList.add("wishlist-item");
        wishlistItem.dataset.id = item.id;

        wishlistItem.innerHTML = `
            <div class="wishlist-image">
                <img src="${getWishlistImage(item)}" alt="${item.title}" onerror="this.onerror=null;this.src='${FALLBACK_PRODUCT_IMAGE}'">
            </div>

            <div class="wishlist-details">
                <div>
                    <h2>${item.title}</h2>
                    <p class="price">₹${getWishlistPrice(item).toFixed(0)}</p>
                    <p class="delivery">Saved for later</p>
                </div>

                <div class="wishlist-buttons">
                    <button class="add-cart-btn">
                        <i class="bi bi-cart-plus"></i>
                        Add to Cart
                    </button>

                    <button class="remove-wishlist-btn">
                        Remove
                    </button>
                </div>
            </div>
        `;

        container.appendChild(wishlistItem);
    });
}

document.addEventListener("click", (e) => {
    const wishlistCard = e.target.closest(".wishlist-item");

    if (e.target.closest("#continueShoppingBtn")) {
        window.location.href = "productpage.html";
        return;
    }

    if (e.target.closest("#moveAllBtn")) {
        const wishlist = getWishlistItems();

        wishlist.forEach(addItemToCart);
        renderWishlist();
        showWishlistFeedback(`${wishlist.length} ${wishlist.length === 1 ? "item" : "items"} added to cart`);
        return;
    }

    if (!wishlistCard) return;

    const productId = Number(wishlistCard.dataset.id);
    const wishlist = getWishlistItems();
    const item = wishlist.find(wishlistItem => wishlistItem.id === productId);

    if (e.target.closest(".add-cart-btn") && item) {
        addItemToCart(item);
        renderWishlist();
        showWishlistFeedback(`${item.title} added to cart`);
        return;
    }

    if (e.target.closest(".remove-wishlist-btn")) {
        saveWishlistItems(wishlist.filter(wishlistItem => wishlistItem.id !== productId));
        renderWishlist();
    }
});

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderWishlist();

        updateCartCount();

        updateWishlistIconCount();
    }
);
