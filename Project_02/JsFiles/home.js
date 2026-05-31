
let cartCount = 0;
const cartBadge = document.getElementById("cart-count");
const cartButton = document.querySelectorAll(".add-cart");
cartButton.forEach(button => {
    button.addEventListener("click", () => {
        cartCount++;
        cartBadge.textContent = cartCount;
    })
    cartCount++;


})