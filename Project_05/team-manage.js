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

document.getElementById("add-member-btn").addEventListener("click", (e) => {
    e.preventDefault();

    if (fullName.value == "" || emailId.value == "" || role.value == "") {
        alert("Fill all the details");
        return;
    }

    let members = JSON.parse(localStorage.getItem("members")) || [];

    const member = {
        id: Date.now(),
        name: fullName.value,
        email: emailId.value,
        role: role.value,
        joinedOn: formatDate(new Date()),
        avatar: avatar.value,
        taskCount: 0
    };

    members.push(member);

    saveMembers(members);

    renderMembers();

    fullName.value = "";
    emailId.value = "";
    role.value = "";
    avatar.value = "";
})