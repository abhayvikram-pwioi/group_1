const workspaceForm = document.getElementById("workspaceForm");

workspaceForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const workspaceName = document.getElementById("workspaceName").value.trim();
    const projectName = document.getElementById("projectName").value.trim();
    const description = document.getElementById("projectDescription").value.trim();

    if (
        workspaceName === "" ||
        projectName === "" ||
        description === ""
    ) {
        alert("Please fill all fields.");
        return;
    }

    if (members.length === 0) {
        alert("Please add at least one team member.");
        return;
    }

    // Generate workspace id
    const workspaceId = "DEV" + Math.floor(1000 + Math.random() * 9000);

    // Temporary password
    const password = "12345";

    const workspace = {
        id: workspaceId,
        password,
        workspaceName,
        projectName,
        description,
        members
    };

    localStorage.setItem(workspaceId, JSON.stringify(workspace));

    alert(`
Workspace Created!

Workspace ID : ${workspaceId}
Password : ${password}
`);

    window.location.href = "login.html";
});