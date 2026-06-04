function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const cartCount = document.getElementById("cart-count");

    if(cartCount){
        cartCount.textContent = totalItems;
    }
}

