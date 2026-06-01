

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

let cartItems = 1;
let cartTotal = 4743;

document.getElementById(
"cartCount"
).innerText = cartItems;

document.getElementById(
"totalPrice"
).innerText = "₹" + cartTotal;




let orderBtn =
document.querySelector(".order-btn");

orderBtn.addEventListener(
"click",
function(){

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

    if(name.length < 3){
        alert(
        "Name must be at least 3 characters"
        );
        return;
    }

    if(email === ""){
        alert("Email is required");
        return;
    }

    if(
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email)
    ){
        alert("Enter valid email");
        return;
    }

    if(address === ""){
        alert("Address is required");
        return;
    }

    if(
    !/^[0-9]{10}$/
    .test(phone)
    ){
        alert(
        "Enter valid phone number"
        );
        return;
    }

    if(city === ""){
        alert("City is required");
        return;
    }

    if(
    !/^[0-9]{6}$/
    .test(pincode)
    ){
        alert(
        "Enter valid pincode"
        );
        return;
    }

    let payment =
    document.querySelector(
    'input[name="payment"]:checked'
    );

    if(!payment){
        alert(
        "Please select a payment method"
        );
        return;
    }

    localStorage.setItem(
        "shippingName",
        name
    );

    if(payment.value === "COD"){

        alert("Order Placed Successfully");

    } else {

        let options = {
            key: "rzp_test_SvwDDiaWs6F3Fc",
            amount: cartTotal * 100,
            currency: "INR",
            name: "ShopVerse",
            description: "Order Payment",
            method: {
                upi: true,
                card: true,
                netbanking: true,
                wallet: true
            },
            handler: function(response){
                alert(
                    "Payment Successful\nPayment ID: " +
                    response.razorpay_payment_id
                );
            }
        };

        let rzp = new Razorpay(options);
        rzp.open();

    }

});

