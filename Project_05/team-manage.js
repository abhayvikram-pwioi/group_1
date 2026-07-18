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

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
document.getElementById("task-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("task-title");
    const description = document.getElementById("task-description");
    const member = document.getElementById("task-member");
    const priority = document.getElementById("task-priority");
    const status = document.getElementById("task-status");
    const dueDate = document.getElementById("task-date");

    if (title.value === "" ||
        description.value === "" ||
        member.value === "" || dueDate.value === "") {

        alert("Fill all fields");

        return;
    }

    const task = {

        id: Date.now(),

        title: title.value,

        description: description.value,

        assignee: member.value,

        priority: priority.value,

        status: status.value,

        dueDate: formatDate(dueDate.value),

        createdAt: formatDate(new Date())

    };

    tasks.push(task);
    saveTasks();
    this.reset();
    document.getElementById("task-modal").classList.remove("active");
});

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}



function updateSummary() {

    const members = JSON.parse(localStorage.getItem("members")) || [];

    document.getElementById("total-member").textContent = members.length;

    document.getElementById("total-ui-ux").textContent =
        members.filter(member => member.role === "UI/UX Designer").length;

    document.getElementById("total-frontend").textContent =
        members.filter(member => member.role === "Frontend Developer").length;

    document.getElementById("total-backend").textContent =
        members.filter(member => member.role === "Backend Developer").length;

    document.getElementById("total-project-manager").textContent =
        members.filter(member => member.role === "Project Manager").length;

    document.getElementById("total-devops").textContent =
        members.filter(member => member.role === "DevOps Engineer").length;

    document.getElementById("total-testers").textContent =
        members.filter(member => member.role === "QA Tester").length;

}



window.addEventListener("DOMContentLoaded", () => {
    renderMembers();
    loadMembers();
    updateSummary();
});