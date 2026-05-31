
let cartCount = 0;

const cartBadge = document.getElementById("cart-count");
const cartButtons = document.querySelectorAll(".add-cart");

cartButtons.forEach(button => {

    let quantity = 0;

    button.addEventListener("click", function initCart() {

        if (quantity !== 0) return;

        quantity = 1;
        cartCount++;

        cartBadge.textContent = cartCount;

        button.innerHTML = `
            <span class="minus">−</span>
            <span class="qty">${quantity}</span>
            <span class="plus">+</span>
        `;

        const plusBtn = button.querySelector(".plus");
        const minusBtn = button.querySelector(".minus");
        const qtyText = button.querySelector(".qty");

        plusBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            quantity++;
            cartCount++;

            qtyText.textContent = quantity;
            cartBadge.textContent = cartCount;
        });

        minusBtn.addEventListener("click", (e) => {
            e.stopPropagation();

            quantity--;
            cartCount--;

            cartBadge.textContent = cartCount;

            if (quantity <= 0) {
                quantity = 0;

                button.innerHTML = "Add to Cart";
            } else {
                qtyText.textContent = quantity;
            }
        });
    });

});
let wishlist = [];
const wishlistButton = document.querySelectorAll(".wishlist-btn");
wishlistButton.forEach(button => {
    button.addEventListener("click", () =>{
        button.classList.toggle("active");
    })
});

let wishlistCount = 0;
const wishlistBadge = document.getElementById("wishlist-count");
//const wishlistButton = document.querySelectorAll(".wishlist-btn");
wishlistButton.forEach(button => {
    button.addEventListener("click",() =>{
        button.classList.toggle("active");
        if(button.classList.toggle("active")){
            wishlistCount++;
        }
        else{
            wishlistCount--;
        }
        wishlistBadge.textContent = wishlistCount;
    })
})