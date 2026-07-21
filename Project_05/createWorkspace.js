
let members = [];

const AVATAR_PALETTE = [
    "#4361EE", "#7C5CFC", "#0BA5A0", "#E0673C",
    "#D1345B", "#2E9CCA", "#E8A33D", "#8854D0", "#16A085", "#C2547A"
];

const memberName = document.getElementById("memberName");
const memberEmail = document.getElementById("memberEmail");
const memberRole = document.getElementById("memberRole");

const addMemberBtn = document.getElementById("addMemberBtn");
const membersContainer = document.getElementById("membersContainer");

const workspaceForm = document.getElementById("workspaceForm");



function generateWorkspaceId() {
    return (
        "FLOW-" +
        Math.random().toString(36).substring(2, 8).toUpperCase()
    );
}

function generateMemberId(prefix) {
    return (
        (prefix || "member") +
        "-" +
        Date.now() +
        "-" +
        Math.floor(Math.random() * 1000)
    );
}

function generateColorFromName(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function getInitials(name) {
    const words = name.trim().split(/\s+/);
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
}

function createMemberRecord(name, email, role, prefix) {
    const now = new Date().toISOString();
    return {
        id: generateMemberId(prefix),
        name,
        email,
        role,
        avatarColor: generateColorFromName(name || email),
        avatarUrl: "",
        createdAt: now,
        updatedAt: now
    };
}




function renderMembers() {

    membersContainer.innerHTML = "";

    members.forEach((member, index) => {

        const card = document.createElement("div");
        card.className = "member-card";

        card.innerHTML = `
            <div class="avatar" style="--avatar-color:${member.avatarColor}">${getInitials(member.name)}</div>

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

    members.push(createMemberRecord(name, email, role));

    renderMembers();

    memberName.value = "";
    memberEmail.value = "";
    memberRole.selectedIndex = 0;

});





function deleteMember(index) {

    members.splice(index, 1);

    renderMembers();

}





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





    if (password !== confirmPassword) {

        alert("Passwords do not match.");

        return;

    }

    if (password.length < 6) {

        alert("Password must contain at least 6 characters.");

        return;

    }

    const workspaceId = generateWorkspaceId();

    const admin = createMemberRecord(adminName, adminEmail, "Admin", "member-admin");

    const workspace = {

        id: workspaceId,

        workspaceName,

        projectName,

        description,

        password,

        admin,

        members,

        tasks: [],

        activities: [],

        createdAt: new Date().toISOString()

    };



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
