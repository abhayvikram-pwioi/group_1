const fullName = document.getElementById("full-name");
const emailId = document.getElementById("email-id");
const role = document.getElementById("role");
const avatar = document.getElementById("avatar");


function formatDate(dateString) {
    const options = {
        day: "numeric",
        month: "short",
        year: "numeric"
    };
    return new Date(dateString).toLocaleDateString("en-GB", options);
}
