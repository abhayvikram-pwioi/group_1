const loginForm = document.getElementById("loginForm");
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

const AVATAR_PALETTE = [
  "#4361EE", "#7C5CFC", "#0BA5A0", "#E0673C",
  "#D1345B", "#2E9CCA", "#E8A33D", "#8854D0", "#16A085", "#C2547A"
];

function generateColorFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function normalizePerson(person, fallbackId, fallbackRole) {
  return {
    id: person.id || fallbackId,
    name: person.name,
    email: person.email,
    role: person.role || fallbackRole || "",
    avatarColor: person.avatarColor || generateColorFromName(person.name || person.email || fallbackId),
    avatarUrl: person.avatarUrl || "",
    createdAt: person.createdAt || new Date().toISOString(),
    updatedAt: person.updatedAt || new Date().toISOString()
  };
}


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
      email: "alex@flowboard.app",
      role: "Admin",
      avatarColor: generateColorFromName("Alex Rivera"),
      avatarUrl: ""
    },
    members: [
      normalizePerson({ name: "John Park", email: "john.park@flowboard.app", role: "Engineering Lead" }, "member-1"),
      normalizePerson({ name: "Priya Nair", email: "priya.nair@flowboard.app", role: "Product Designer" }, "member-2"),
      normalizePerson({ name: "Mike Chen", email: "mike.chen@flowboard.app", role: "Frontend Engineer" }, "member-3"),
      normalizePerson({ name: "Sarah Lee", email: "sarah.lee@flowboard.app", role: "QA Engineer" }, "member-4")
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
  const list = [];

  if (workspace.admin) {
    workspace.admin = normalizePerson(workspace.admin, "member-admin", "Admin");
    list.push(workspace.admin);
  }

  (workspace.members || []).forEach(function (member, index) {
    const normalizedMember = normalizePerson(member, "member-" + index);
    workspace.members[index] = normalizedMember;
    list.push(normalizedMember);
  });

  localStorage.setItem("flowboard_members", JSON.stringify(list));
  localStorage.setItem(
    "flowboard_members_" + encodeURIComponent(workspace.id),
    JSON.stringify(list)
  );
  localStorage.setItem(workspace.id, JSON.stringify(workspace));
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
