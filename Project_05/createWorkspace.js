// ===============================
// Team Members Array
// ===============================

let members = [];

// ===============================
// DOM Elements
// ===============================

const memberName = document.getElementById("memberName");
const memberEmail = document.getElementById("memberEmail");
const memberRole = document.getElementById("memberRole");

const addMemberBtn = document.getElementById("addMemberBtn");
const membersContainer = document.getElementById("membersContainer");

const workspaceForm = document.getElementById("workspaceForm");

// ===============================
// Generate Workspace ID
// ===============================

function generateWorkspaceId() {
    return (
        "FLOW-" +
        Math.random().toString(36).substring(2, 8).toUpperCase()
    );
}

// ===============================
// Render Members
// ===============================

function renderMembers() {

    membersContainer.innerHTML = "";

    members.forEach((member, index) => {

        const initials = member.name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase();

        const card = document.createElement("div");
        card.className = "member-card";

        card.innerHTML = `
            <div class="avatar">${initials}</div>

            <div class="member-info">
                <h4>${member.name}</h4>
                <p>${member.email}</p>
                <small>${member.role}</small>
            </div>

            <button
                class="delete-btn"
                onclick="deleteMember(${index})">

                <i class="fa-solid fa-trash"></i>

            </button>
        `;

        membersContainer.appendChild(card);

    });

}

// ===============================
// Add Member
// ===============================

addMemberBtn.addEventListener("click", () => {

    const name = memberName.value.trim();
    const email = memberEmail.value.trim();
    const role = memberRole.value;

    if (!name || !email || !role) {
        alert("Please fill all member details.");
        return;
    }

    const alreadyExists = members.some(
        member => member.email === email
    );

    if (alreadyExists) {
        alert("Member already added.");
        return;
    }

    members.push({
        name,
        email,
        role
    });

    renderMembers();

    memberName.value = "";
    memberEmail.value = "";
    memberRole.selectedIndex = 0;

});

// ===============================
// Delete Member
// ===============================

function deleteMember(index) {

    members.splice(index, 1);

    renderMembers();

}

// ===============================
// Create Workspace
// ===============================

workspaceForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const workspaceName = document
        .getElementById("workspaceName")
        .value
        .trim();

    const projectName = document
        .getElementById("projectName")
        .value
        .trim();

    const description = document
        .getElementById("projectDescription")
        .value
        .trim();

    const adminName = document
        .getElementById("adminName")
        .value
        .trim();

    const adminEmail = document
        .getElementById("adminEmail")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;

    const confirmPassword = document
        .getElementById("confirmPassword")
        .value;

    // ===============================
    // Validation
    // ===============================

    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;

    }

    if (password.length < 6) {

        alert("Password must contain at least 6 characters.");

        return;

    }

    const workspaceId = generateWorkspaceId();

    const workspace = {

        id: workspaceId,

        workspaceName,

        projectName,

        description,

        password,

        admin: {

            name: adminName,

            email: adminEmail

        },

        members,

        tasks: [],

        activities: [],

        createdAt: new Date().toISOString()

    };

    // Save workspace

    localStorage.setItem(
        workspaceId,
        JSON.stringify(workspace)
    );

    alert(
`Workspace Created Successfully!

Workspace ID: ${workspaceId}

Save this Workspace ID.
You'll need it while logging in.`
    );

    workspaceForm.reset();

    members = [];

    renderMembers();

    window.location.href = "login.html";

});