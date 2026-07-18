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

function saveMembers(members) {
    localStorage.setItem("members", JSON.stringify(members));
}


function renderMembers() {
    const members = JSON.parse(localStorage.getItem("members")) || [];

    const container = document.getElementById("table-body");

    container.innerHTML = "";

    members.forEach(member => {

        container.innerHTML += `
            <tr>

                <td>${member.name}</td>

                <td>${member.role}</td>

                <td>${member.taskCount}</td>

                <td>${member.joinedOn}</td>

                <td>
                    <i class="fa-solid fa-pen-to-square"></i>
                    <i class="fa-solid fa-trash"></i>
                </td>

            </tr>
        `;

    });

};

window.addEventListener("DOMContentLoaded",()=>{

    renderMembers();

});

const modal = document.getElementById("task-modal");

document.getElementById("add-task-btn").onclick = () => {
    modal.classList.add("active");
};

document.getElementById("close-modal").onclick = () => {
    modal.classList.remove("active");
};

document.getElementById("cancel-btn").onclick = () => {
    modal.classList.remove("active");
};

window.onclick = (e) => {
    if (e.target === modal) {
        modal.classList.remove("active");
    }
};

function loadMembers() {

    const members = JSON.parse(localStorage.getItem("members")) || [];

    const select = document.getElementById("task-member");

    select.innerHTML = `<option value="">Select Member</option>`;

    members.forEach(member => {

        select.innerHTML += `
            <option value="${member.name}">
                ${member.name}
            </option>
        `;

    });

}