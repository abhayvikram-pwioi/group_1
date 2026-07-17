const addMemberBtn = document.getElementById("addMemberBtn");
const membersContainer = document.getElementById("membersContainer");

const memberName = document.getElementById("memberName");
const memberRole = document.getElementById("memberRole");

let members = [];

// Add Member
addMemberBtn.addEventListener("click", () => {

    const name = memberName.value.trim();
    const role = memberRole.value;

    if (name === "" || role === "") {
        alert("Please enter member details.");
        return;
    }

    const initials = name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase();

    members.push({
        name,
        role,
        initials
    });

    renderMembers();

    memberName.value = "";
    memberRole.selectedIndex = 0;

});

// Render Members
function renderMembers() {

    membersContainer.innerHTML = "";

    members.forEach((member, index) => {

        membersContainer.innerHTML += `

        <div class="member-card">

            <div class="avatar">
                ${member.initials}
            </div>

            <div class="member-info">
                <h4>${member.name}</h4>
                <p>${member.role}</p>
            </div>

            <button class="delete-btn" onclick="deleteMember(${index})">
                <i class="fa-solid fa-trash"></i>
            </button>

        </div>

        `;

    });

}

// Delete Member
function deleteMember(index){

    members.splice(index,1);

    renderMembers();

}