

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



