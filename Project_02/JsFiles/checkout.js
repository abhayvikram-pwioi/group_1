

async function loadProduct(){
    try{

        let response =
        await fetch(
        "https://dummyjson.com/products/1"
        );

        let data =
        await response.json();

        document.getElementById(
        "productImage"
        ).src = data.thumbnail;

        document.getElementById(
        "productName"
        ).innerText = data.title;

        document.getElementById(
        "productPrice"
        ).innerText = "₹" + data.price;

    }
    catch(error){

        console.log(error);

    }

}

loadProduct();




const SHIPPING = 10;
const TAX_RATE = 0.05;

let checkoutItems = [];
let checkoutTotal = 0;

function getStoredItems(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function formatPrice(amount) {
    return "₹" + Number(amount).toFixed(2);
}

function getItemImage(item) {
    return item.image || item.thumbnail || "";
}

function getItemPrice(item) {
    return Number(item.price || 0);
}

function updateCartCount() {
    const cartCount = document.getElementById("cartCount");
    const cartItems = getStoredItems("cart");
    const totalItems = cartItems.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    if (cartCount) {
        cartCount.innerText = totalItems;
    }
}

function loadCheckoutItems() {
    checkoutItems = getStoredItems("checkoutItems");

    if (checkoutItems.length === 0) {
        checkoutItems = getStoredItems("cart");
    }
}

function renderCheckoutItems() {
    const container = document.getElementById("checkoutItems");
    const totalPrice = document.getElementById("totalPrice");

    if (!container || !totalPrice) return;

    container.innerHTML = "";

    if (checkoutItems.length === 0) {
        container.innerHTML = `
            <div class="empty-checkout">
                <h3>No items selected</h3>
                <p>Add items to your cart before checkout.</p>
                <a href="productpage.html">Continue Shopping</a>
            </div>
        `;
        checkoutTotal = 0;
        totalPrice.innerText = formatPrice(0);
        return;
    }

    const subtotal = checkoutItems.reduce((total, item) => {
        return total + getItemPrice(item) * Number(item.quantity || 1);
    }, 0);

    const tax = subtotal * TAX_RATE;
    checkoutTotal = subtotal + SHIPPING + tax;

    checkoutItems.forEach(item => {
        const quantity = Number(item.quantity || 1);
        const itemTotal = getItemPrice(item) * quantity;
        const checkoutItem = document.createElement("div");

        checkoutItem.classList.add("product");
        checkoutItem.innerHTML = `
            <img src="${getItemImage(item)}" alt="${item.title}">

            <div>
                <h3>${item.title}</h3>
                <p>${formatPrice(getItemPrice(item))}</p>
                <p>Qty : ${quantity}</p>
                <p>Item Total : ${formatPrice(itemTotal)}</p>
            </div>
        `;

        container.appendChild(checkoutItem);
    });

    const totals = document.createElement("div");

    totals.classList.add("checkout-totals");
    totals.innerHTML = `
        <div>
            <span>Subtotal</span>
            <strong>${formatPrice(subtotal)}</strong>
        </div>
        <div>
            <span>Shipping</span>
            <strong>${formatPrice(SHIPPING)}</strong>
        </div>
        <div>
            <span>Tax</span>
            <strong>${formatPrice(tax)}</strong>
        </div>
    `;

    container.appendChild(totals);
    totalPrice.innerText = formatPrice(checkoutTotal);
}

function validateCheckoutForm() {
    let name =
        document.getElementById("name")
            .value.trim();

    let email =
        document.getElementById("email")
            .value.trim();

    let address =
        document.getElementById("address")
            .value.trim();

    let phone =
        document.getElementById("phone")
            .value.trim();

    let city =
        document.getElementById("city")
            .value.trim();

    let pincode =
        document.getElementById("pincode")
            .value.trim();

    if (checkoutItems.length === 0) {
        alert("Please add items before placing an order");
        return null;
    }

    if (name.length < 3) {
        alert("Name must be at least 3 characters");
        return null;
    }

    if (email === "") {
        alert("Email is required");
        return null;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Enter valid email");
        return null;
    }

    if (address === "") {
        alert("Address is required");
        return null;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        alert("Enter valid phone number");
        return null;
    }

    if (city === "") {
        alert("City is required");
        return null;
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
        alert("Enter valid pincode");
        return null;
    }

    let payment =
        document.querySelector(
            'input[name="payment"]:checked'
        );

    if (!payment) {
        alert("Please select a payment method");
        return null;
    }

    localStorage.setItem("shippingName", name);

    return payment;
}

function initializeOrderButton() {
    let orderBtn =
        document.querySelector(".order-btn");

    if (!orderBtn) return;

    orderBtn.addEventListener("click", function () {
        const payment = validateCheckoutForm();

        if (!payment) return;

        if (payment.value === "COD") {
            alert("Order Placed Successfully");
            return;
        }

        let options = {
            key: "rzp_test_SvwDDiaWs6F3Fc",
            amount: Math.round(checkoutTotal * 100),
            currency: "INR",
            name: "ShopEase",
            description: "Order Payment",
            method: {
                upi: true,
                card: true,
                netbanking: true,
                wallet: true
            },
            handler: function (response) {
                alert(
                    "Payment Successful\nPayment ID: " +
                    response.razorpay_payment_id
                );
            }
        };

        let rzp = new Razorpay(options);
        rzp.open();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadCheckoutItems();
    renderCheckoutItems();
    updateCartCount();
    initializeOrderButton();
});
