const toast = document.getElementById("toast");

export function showToast(message, type){

    toast.innerText = message;

    toast.className = "";

    toast.classList.add(type);

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}