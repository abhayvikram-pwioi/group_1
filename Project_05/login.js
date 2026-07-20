const loginForm = document.getElementById("loginForm");
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");


function ensureDemoWorkspace() {
  const demoWorkspaceId = "FLOW-DEMO1";
  if (localStorage.getItem(demoWorkspaceId)) return;

  const demoWorkspace = {
    id: demoWorkspaceId,
    workspaceName: "Flowboard Demo",
    projectName: "Client Launch Sprint",
    description: "Demo workspace seeded for testing the login flow.",
    password: "flowboard123",
    admin: {
      name: "Alex Rivera",
      email: "alex@flowboard.app"
    },
    members: [
      { name: "John Park", email: "john.park@flowboard.app", role: "Engineering Lead" },
      { name: "Priya Nair", email: "priya.nair@flowboard.app", role: "Product Designer" },
      { name: "Mike Chen", email: "mike.chen@flowboard.app", role: "Frontend Engineer" },
      { name: "Sarah Lee", email: "sarah.lee@flowboard.app", role: "QA Engineer" }
    ],
    tasks: [],
    activities: [],
    createdAt: new Date().toISOString()
  };

  localStorage.setItem(demoWorkspaceId, JSON.stringify(demoWorkspace));
}

ensureDemoWorkspace();


togglePassword.addEventListener("click", () => {
  if (password.type === "password") {
    password.type = "text";
    togglePassword.classList.replace("fa-eye", "fa-eye-slash");
  } else {
    password.type = "password";
    togglePassword.classList.replace("fa-eye-slash", "fa-eye");
  }
});


function syncTeamManagementFromWorkspace(workspace) {
  if (localStorage.getItem("flowboard_members")) return;

  const now = new Date().toISOString();
  const list = [];

  if (workspace.admin) {
    list.push({
      id: "member-admin",
      name: workspace.admin.name,
      email: workspace.admin.email,
      role: "Admin",
      createdAt: workspace.createdAt || now,
      updatedAt: now
    });
  }

  (workspace.members || []).forEach(function (member, index) {
    list.push({
      id: "member-" + index + "-" + Date.now(),
      name: member.name,
      email: member.email,
      role: member.role || "",
      createdAt: workspace.createdAt || now,
      updatedAt: now
    });
  });

  localStorage.setItem("flowboard_members", JSON.stringify(list));
}


loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const workspaceId = document.getElementById("workspaceId").value.trim();
  const email = document.getElementById("email").value.trim();
  const passwordValue = password.value;

  const workspace = JSON.parse(localStorage.getItem(workspaceId));

  if (!workspace) {
    alert("Workspace not found");
    return;
  }



  const isAdmin =
    workspace.admin &&
    workspace.admin.email === email &&
    workspace.password === passwordValue;








  const matchedMember =
    workspace.members &&
    workspace.members.find(function (member) {
      return member.email === email;
    });
  const isMemberLoginValid = Boolean(matchedMember) && workspace.password === passwordValue;

  if (isAdmin || isMemberLoginValid) {
    const loggedInPerson = isAdmin ? workspace.admin : matchedMember;

    syncTeamManagementFromWorkspace(workspace);

    localStorage.setItem("currentWorkspace", workspaceId);
    localStorage.setItem("currentUser", email);
    localStorage.setItem("currentUserName", loggedInPerson.name || email);
    localStorage.setItem("currentUserAvatar", loggedInPerson.avatarUrl || "");
    localStorage.setItem("isLoggedIn", "true");

    window.location.href = "index.html";
  } else {
    alert("Invalid Email or Password");
  }
});
