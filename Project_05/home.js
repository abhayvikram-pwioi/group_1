
let tasks = [];
let currentEditId = "";
let pendingDeleteId = "";
let activities = [];


let draggedTaskId = "";



let searchQuery = "";
let activeFilter = "all";


let members = [];
let currentEditMemberId = "";
let pendingDeleteMemberId = "";



let currentView = "board";
let columns = [];
let currentEditColumnId = "";
let pendingDeleteColumnId = "";



let STATUSES = ["backlog", "todo", "in-progress", "review", "done"];


const STATUS_LABELS = {
  "backlog": "Not started",
  "todo": "Not started",
  "in-progress": "In progress",
  "review": "Needs review",
  "done": "Completed"
};


const COLUMN_LABELS = {
  "backlog": "Backlog",
  "todo": "To Do",
  "in-progress": "In Progress",
  "review": "Review",
  "done": "Done"
};


const AVATAR_COLORS = {
  "John Park": "#4361EE",
  "Priya Nair": "#7C5CFC",
  "Mike Chen": "#0BA5A0",
  "Sarah Lee": "#E0673C"
};
const DEFAULT_AVATAR_COLOR = "#9AA1BD";





const AVATAR_IMAGES = {};




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



const ACTOR_COLORS = {
  "John": "#4361EE",
  "Priya": "#7C5CFC",
  "Mike": "#0BA5A0",
  "Sarah": "#E0673C"
};
const DEFAULT_ACTOR_COLOR = "#4361EE";

const STORAGE_KEY = "flowboard_tasks";
const MEMBERS_STORAGE_KEY = "flowboard_members";
const COLUMNS_STORAGE_KEY = "flowboard_columns";



const IS_LOGGED_IN_KEY = "isLoggedIn";
const CURRENT_USER_EMAIL_KEY = "currentUser";
const CURRENT_USER_NAME_KEY = "currentUserName";
const CURRENT_USER_AVATAR_KEY = "currentUserAvatar";
const CURRENT_WORKSPACE_KEY = "currentWorkspace";

function getCurrentWorkspaceId() {
  return localStorage.getItem(CURRENT_WORKSPACE_KEY) || "";
}

function getWorkspaceMembersStorageKey(workspaceId) {
  return MEMBERS_STORAGE_KEY + "_" + encodeURIComponent(workspaceId);
}

function loadCurrentWorkspace() {
  const workspaceId = getCurrentWorkspaceId();
  if (!workspaceId) return null;

  try {
    return JSON.parse(localStorage.getItem(workspaceId));
  } catch (error) {
    console.error("Could not parse the current workspace.", error);
    return null;
  }
}

function saveCurrentWorkspace(workspace) {
  if (!workspace || !workspace.id) return;
  localStorage.setItem(workspace.id, JSON.stringify(workspace));
}

function normalizeMemberRecord(person, fallbackId, fallbackRole) {
  const now = new Date().toISOString();
  const name = (person && person.name) || "";
  const email = (person && person.email) || "";

  return {
    id: (person && person.id) || fallbackId || generateId("member"),
    name: name,
    email: email,
    role: (person && person.role) || fallbackRole || "",
    avatarColor: (person && person.avatarColor) || generateColorFromName(name || email || fallbackId || "Member"),
    avatarUrl: (person && person.avatarUrl) || "",
    createdAt: (person && person.createdAt) || now,
    updatedAt: (person && person.updatedAt) || now
  };
}

function getWorkspaceTeamMembers(workspace) {
  if (!workspace) return null;

  const list = [];
  if (workspace.admin) {
    workspace.admin = normalizeMemberRecord(workspace.admin, "member-admin", "Admin");
    list.push(workspace.admin);
  }

  workspace.members = Array.isArray(workspace.members) ? workspace.members : [];
  workspace.members.forEach(function (member, index) {
    const normalizedMember = normalizeMemberRecord(member, "member-" + index);
    workspace.members[index] = normalizedMember;
    list.push(normalizedMember);
  });

  saveCurrentWorkspace(workspace);
  return list;
}



const boardEl = document.getElementById("board");
const activityListEl = document.getElementById("activityList");

const addTaskBtn = document.getElementById("addTaskBtn");
const searchInputEl = document.getElementById("searchInput");
const filterSelectEl = document.getElementById("filterSelect");

const taskModalOverlay = document.getElementById("taskModalOverlay");
const taskModalTitle = document.getElementById("taskModalTitle");
const taskModalSubmitBtn = document.getElementById("taskModalSubmitBtn");
const taskModalCloseBtn = document.getElementById("taskModalCloseBtn");
const taskModalCancelBtn = document.getElementById("taskModalCancelBtn");

const taskForm = document.getElementById("taskForm");
const taskIdInput = document.getElementById("taskId");
const taskTitleInput = document.getElementById("taskTitle");
const taskDescriptionInput = document.getElementById("taskDescription");
const taskAssigneeInput = document.getElementById("taskAssignee");
const taskPriorityInput = document.getElementById("taskPriority");
const taskDueDateInput = document.getElementById("taskDueDate");
const taskStatusInput = document.getElementById("taskStatus");

const taskTitleError = document.getElementById("taskTitleError");
const taskDueDateError = document.getElementById("taskDueDateError");

const deleteModalOverlay = document.getElementById("deleteModalOverlay");
const deleteTaskNameEl = document.getElementById("deleteTaskName");
const deleteModalCancelBtn = document.getElementById("deleteModalCancelBtn");
const deleteModalConfirmBtn = document.getElementById("deleteModalConfirmBtn");

const profileMenuBtn = document.getElementById("profileMenuBtn");
const profileDropdown = document.getElementById("profileDropdown");
const profileAvatarEl = document.getElementById("profileAvatarEl");
const profileDropdownAvatarEl = document.getElementById("profileDropdownAvatarEl");
const profileNameEl = document.getElementById("profileNameEl");
const profileEmailEl = document.getElementById("profileEmailEl");
const navLinks = document.querySelectorAll(".header-nav-link");

const boardViewEl = document.getElementById("boardView");
const teamViewEl = document.getElementById("teamView");
const filterFieldEl = document.getElementById("filterField");
const filterAssigneeGroupEl = document.getElementById("filterAssigneeGroup");

const teamGridEl = document.getElementById("teamGrid");
const teamAvatarsEl = document.getElementById("teamAvatars");
const addMemberBtn = document.getElementById("addMemberBtn");

const memberModalOverlay = document.getElementById("memberModalOverlay");
const memberModalTitle = document.getElementById("memberModalTitle");
const memberModalSubmitBtn = document.getElementById("memberModalSubmitBtn");
const memberModalCloseBtn = document.getElementById("memberModalCloseBtn");
const memberModalCancelBtn = document.getElementById("memberModalCancelBtn");

const memberForm = document.getElementById("memberForm");
const memberIdInput = document.getElementById("memberId");
const memberNameInput = document.getElementById("memberName");
const memberEmailInput = document.getElementById("memberEmail");
const memberRoleInput = document.getElementById("memberRole");
const memberNameError = document.getElementById("memberNameError");
const memberEmailError = document.getElementById("memberEmailError");

const deleteMemberModalOverlay = document.getElementById("deleteMemberModalOverlay");
const deleteMemberNameEl = document.getElementById("deleteMemberName");
const deleteMemberModalCancelBtn = document.getElementById("deleteMemberModalCancelBtn");
const deleteMemberModalConfirmBtn = document.getElementById("deleteMemberModalConfirmBtn");
const addColumnBtn = document.getElementById("addColumnBtn");
const columnModalOverlay = document.getElementById("columnModalOverlay");
const columnModalCloseBtn = document.getElementById("columnModalCloseBtn");
const columnModalCancelBtn = document.getElementById("columnModalCancelBtn");
const columnForm = document.getElementById("columnForm");
const columnNameInput = document.getElementById("columnName");
const columnNameError = document.getElementById("columnNameError");
const columnModalTitle = document.getElementById("columnModalTitle");
const columnModalSubmitBtn = document.getElementById("columnModalSubmitBtn");
const deleteColumnModalOverlay = document.getElementById("deleteColumnModalOverlay");
const deleteColumnNameEl = document.getElementById("deleteColumnName");
const deleteColumnModalCancelBtn = document.getElementById("deleteColumnModalCancelBtn");
const deleteColumnModalConfirmBtn = document.getElementById("deleteColumnModalConfirmBtn");





function loadTasks() {
  const workspace = loadCurrentWorkspace();
  if (workspace && Array.isArray(workspace.tasks)) {
    return workspace.tasks;
  }

  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return getSeedTasks();
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : getSeedTasks();
  } catch (error) {

    console.error("Could not parse saved tasks, using starter data instead.", error);
    return getSeedTasks();
  }
}


function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

  const workspace = loadCurrentWorkspace();
  if (workspace) {
    workspace.tasks = tasks;
    saveCurrentWorkspace(workspace);
  }
}



function getSeedTasks() {
  return [
    {
      id: "task-1",
      title: "Research competitor dashboards",
      description: "Collect screenshots and notes on similar tools before wireframing starts.",
      assignee: "Priya Nair",
      dueDate: "2026-08-14",
      priority: "low",
      status: "backlog",
      createdAt: "2026-07-10T09:00:00",
      updatedAt: "2026-07-10T09:00:00"
    },
    {
      id: "task-2",
      title: "Draft onboarding copy",
      description: "First-run copy for empty states and the welcome tour tooltips.",
      assignee: "Mike Chen",
      dueDate: "2026-08-20",
      priority: "medium",
      status: "backlog",
      createdAt: "2026-07-14T11:30:00",
      updatedAt: "2026-07-14T11:30:00"
    },
    {
      id: "task-3",
      title: "Fix Navbar Bug",
      description: "Dropdown menu collapses incorrectly on mobile Safari.",
      assignee: "Sarah Lee",
      dueDate: "2026-07-18",
      priority: "high",
      status: "todo",
      createdAt: "2026-07-15T08:15:00",
      updatedAt: "2026-07-15T08:15:00"
    },
    {
      id: "task-4",
      title: "Client Dashboard",
      description: "Build the summary widgets and the weekly activity chart.",
      assignee: "John Park",
      dueDate: "2026-07-12",
      priority: "high",
      status: "in-progress",
      createdAt: "2026-07-08T10:00:00",
      updatedAt: "2026-07-14T17:03:00"
    },
    {
      id: "task-5",
      title: "Landing Page Design",
      description: "Awaiting feedback from design lead on hero section spacing.",
      assignee: "Priya Nair",
      dueDate: "2026-07-17",
      priority: "medium",
      status: "review",
      createdAt: "2026-07-09T09:00:00",
      updatedAt: "2026-07-15T09:42:00"
    },
    {
      id: "task-6",
      title: "Set up project repo",
      description: "Initialized repository with folder structure and README.",
      assignee: "Mike Chen",
      dueDate: "2026-07-05",
      priority: "low",
      status: "done",
      createdAt: "2026-07-01T09:00:00",
      updatedAt: "2026-07-13T14:52:00"
    }
  ];
}




function getActivityStorageKey() {
  const workspaceId = localStorage.getItem(CURRENT_WORKSPACE_KEY) || "no-workspace";
  const userId = localStorage.getItem(CURRENT_USER_EMAIL_KEY) || "anonymous";
  return "flowboard_activities_" + encodeURIComponent(workspaceId) + "_" + encodeURIComponent(userId.toLowerCase());
}



function loadActivity() {
  const raw = localStorage.getItem(getActivityStorageKey());

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.slice().sort(function (first, second) {
          return new Date(second.time).getTime() - new Date(first.time).getTime();
        })
      : [];
  } catch (error) {
    console.error("Could not parse saved activity for the current session.", error);
    return [];
  }
}


function saveActivity() {
  localStorage.setItem(getActivityStorageKey(), JSON.stringify(activities));
}




function loadCurrentActivity() {
  activities = [];
  renderActivity();
  activities = loadActivity();
  renderActivity();
}




function loadMembers() {
  const workspace = loadCurrentWorkspace();
  const workspaceMembers = getWorkspaceTeamMembers(workspace);
  if (workspaceMembers) {
    localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(workspaceMembers));
    localStorage.setItem(getWorkspaceMembersStorageKey(workspace.id), JSON.stringify(workspaceMembers));
    return workspaceMembers;
  }

  const raw = localStorage.getItem(MEMBERS_STORAGE_KEY);

  if (!raw) {
    return getSeedMembers();
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : getSeedMembers();
  } catch (error) {
    console.error("Could not parse saved team members, using starter data instead.", error);
    return getSeedMembers();
  }
}


function saveMembers() {
  localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));

  const workspaceId = getCurrentWorkspaceId();
  if (workspaceId) {
    localStorage.setItem(getWorkspaceMembersStorageKey(workspaceId), JSON.stringify(members));
  }

  const workspace = loadCurrentWorkspace();
  if (workspace) {
    const adminMember = members.find(function (member) {
      return member.id === "member-admin" || (member.role === "Admin" && workspace.admin && member.email === workspace.admin.email);
    });

    if (adminMember) {
      workspace.admin = adminMember;
    }

    workspace.members = members.filter(function (member) {
      return !(workspace.admin && member.email === workspace.admin.email);
    });

    saveCurrentWorkspace(workspace);
  }
}



function getSeedMembers() {
  return [
    { id: "member-1", name: "John Park", email: "john.park@flowboard.app", role: "Engineering Lead", createdAt: "2026-06-01T09:00:00", updatedAt: "2026-06-01T09:00:00" },
    { id: "member-2", name: "Priya Nair", email: "priya.nair@flowboard.app", role: "Product Designer", createdAt: "2026-06-01T09:00:00", updatedAt: "2026-06-01T09:00:00" },
    { id: "member-3", name: "Mike Chen", email: "mike.chen@flowboard.app", role: "Frontend Engineer", createdAt: "2026-06-01T09:00:00", updatedAt: "2026-06-01T09:00:00" },
    { id: "member-4", name: "Sarah Lee", email: "sarah.lee@flowboard.app", role: "QA Engineer", createdAt: "2026-06-01T09:00:00", updatedAt: "2026-06-01T09:00:00" }
  ];
}

function getDefaultColumns() {
  return [
    { id: "backlog", name: "Backlog" },
    { id: "todo", name: "To Do" },
    { id: "in-progress", name: "In Progress" },
    { id: "review", name: "Review" },
    { id: "done", name: "Done" }
  ];
}

function loadColumns() {
  const raw = localStorage.getItem(COLUMNS_STORAGE_KEY);
  if (!raw) return getDefaultColumns();

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return getDefaultColumns();
    return parsed.filter(function (column) {
      return column && typeof column.id === "string" && typeof column.name === "string";
    });
  } catch (error) {
    console.error("Could not parse saved columns, using default columns instead.", error);
    return getDefaultColumns();
  }
}

function saveColumns() {
  localStorage.setItem(COLUMNS_STORAGE_KEY, JSON.stringify(columns));
}

function createColumnElement(column) {
  const section = document.createElement("section");
  section.className = "column";
  section.setAttribute("data-column", column.id);

  const header = document.createElement("header");
  header.className = "column-header";
  header.innerHTML =
    '<div class="column-heading">' +
      '<span class="column-dot dot-backlog" aria-hidden="true"></span>' +
      '<h2 class="column-title"></h2>' +
      '<span class="task-count">0</span>' +
    '</div>' +
    '<button class="column-menu-btn" type="button" aria-label="Column options">⋯</button>';
  header.querySelector(".column-title").textContent = column.name;

  const list = document.createElement("div");
  list.className = "task-list";
  list.setAttribute("data-tasklist", column.id);
  list.setAttribute("aria-label", column.name + " tasks");

  section.appendChild(header);
  section.appendChild(list);
  ensureColumnMenu(section);
  return section;
}

function ensureColumnMenu(columnEl) {
  if (columnEl.querySelector(".column-options-menu")) return;

  const menu = document.createElement("div");
  menu.className = "column-options-menu";
  menu.hidden = true;
  menu.setAttribute("role", "menu");
  menu.innerHTML =
    '<button type="button" role="menuitem" data-column-action="rename">Rename Column</button>' +
    '<button type="button" role="menuitem" data-column-action="delete">Delete Column</button>' +
    '<button type="button" role="menuitem" data-column-action="left">Move Column Left</button>' +
    '<button type="button" role="menuitem" data-column-action="right">Move Column Right</button>';
  columnEl.querySelector(".column-header").appendChild(menu);
}

function renderColumns() {
  document.querySelectorAll(".column").forEach(function (columnEl) {
    const exists = columns.some(function (column) {
      return column.id === columnEl.getAttribute("data-column");
    });
    if (!exists) columnEl.remove();
  });

  columns.forEach(function (column) {
    let columnEl = document.querySelector('.column[data-column="' + column.id + '"]');
    if (!columnEl) {
      columnEl = createColumnElement(column);
      boardEl.insertBefore(columnEl, addColumnBtn);
    }
    const titleEl = columnEl.querySelector(".column-title");
    const listEl = columnEl.querySelector(".task-list");
    if (titleEl) titleEl.textContent = column.name;
    if (listEl) listEl.setAttribute("aria-label", column.name + " tasks");
    ensureColumnMenu(columnEl);
    boardEl.insertBefore(columnEl, addColumnBtn);
    COLUMN_LABELS[column.id] = column.name;
    if (!STATUS_LABELS[column.id]) STATUS_LABELS[column.id] = "Not started";
  });

  STATUSES = columns.map(function (column) { return column.id; });
  renderStatusOptions();
}

function renderStatusOptions() {
  if (!taskStatusInput) return;
  const selectedValue = taskStatusInput.value;
  taskStatusInput.innerHTML = "";
  columns.forEach(function (column) {
    const option = document.createElement("option");
    option.value = column.id;
    option.textContent = column.name;
    taskStatusInput.appendChild(option);
  });
  taskStatusInput.value = STATUSES.indexOf(selectedValue) !== -1 ? selectedValue : STATUSES[0];
}







function renderBoard() {
  STATUSES.forEach(renderColumn);
  applySearchAndFilter();
}




function renderColumn(status) {
  const listEl = document.querySelector('.task-list[data-tasklist="' + status + '"]');
  if (!listEl) return;

  listEl.innerHTML = "";

  const tasksInColumn = tasks.filter(function (task) {
    return task.status === status;
  });

  if (tasksInColumn.length === 0) {
    listEl.appendChild(renderEmptyState());
  } else {
    tasksInColumn.forEach(function (task) {
      listEl.appendChild(renderTaskCard(task));
    });
  }

  updateTaskCount(status);
}


function renderEmptyState() {
  const emptyEl = document.createElement("p");
  emptyEl.className = "task-list-empty";
  emptyEl.textContent = "No tasks here yet.";
  return emptyEl;
}



function renderTaskCard(task) {
  const article = document.createElement("article");
  article.className = "task-card" + (task.status === "done" ? " is-done" : "");
  article.setAttribute("data-priority", task.priority);
  article.setAttribute("data-task-id", task.id);
  article.setAttribute("draggable", "true");
  article.setAttribute("tabindex", "0");
  article.setAttribute(
    "aria-label",
    task.title + ", " + task.priority + " priority, assigned to " +
      (task.assignee || "Unassigned") + ", " + (STATUS_LABELS[task.status] || task.status)
  );

  const stripEl = document.createElement("div");
  stripEl.className = "card-priority-strip strip-" + task.priority;
  stripEl.setAttribute("aria-hidden", "true");
  article.appendChild(stripEl);

  const bodyEl = document.createElement("div");
  bodyEl.className = "card-body";

  const topEl = document.createElement("div");
  topEl.className = "card-top";
  const titleEl = document.createElement("h3");
  titleEl.className = "card-title";
  titleEl.textContent = task.title;
  topEl.appendChild(titleEl);

  const actionsEl = document.createElement("div");
  actionsEl.className = "card-actions";
  actionsEl.innerHTML =
    '<button class="icon-btn" type="button" data-action="edit" aria-label="Edit task">' +
      '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>' +
    '</button>' +
    '<button class="icon-btn icon-btn-danger" type="button" data-action="delete" aria-label="Delete task">' +
      '<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 4.5H13M6.5 4.5V3H9.5V4.5M4.5 4.5L5 13H11L11.5 4.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
    '</button>';
  topEl.appendChild(actionsEl);
  bodyEl.appendChild(topEl);

  if (task.description) {
    const descEl = document.createElement("p");
    descEl.className = "card-desc";
    descEl.textContent = task.description;
    bodyEl.appendChild(descEl);
  }

  const metaEl = document.createElement("div");
  metaEl.className = "card-meta";
  const badgeEl = document.createElement("span");
  badgeEl.className = "priority-badge badge-" + task.priority;
  badgeEl.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
  metaEl.appendChild(badgeEl);

  if (task.dueDate) {
    const dueEl = document.createElement("span");
    dueEl.className = "due-date " + updateDeadlineColor(task.dueDate);
    dueEl.innerHTML =
      '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2.5" y="3.5" width="11" height="10" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M2.5 6.5H13.5M5.5 2V4M10.5 2V4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>' +
      formatDateDisplay(task.dueDate);
    metaEl.appendChild(dueEl);
  }
  bodyEl.appendChild(metaEl);

  const footerEl = document.createElement("footer");
  footerEl.className = "card-footer";
  const statusEl = document.createElement("span");
  statusEl.className = "status-text";
  statusEl.textContent = STATUS_LABELS[task.status] || "";
  footerEl.appendChild(statusEl);
  footerEl.appendChild(renderAvatar(task.assignee));
  bodyEl.appendChild(footerEl);
  article.appendChild(bodyEl);

  return article;
}


function updateTaskCount(status) {
  const columnEl = document.querySelector('.column[data-column="' + status + '"]');
  if (!columnEl) return;

  const countEl = columnEl.querySelector(".task-count");
  if (!countEl) return;

  const count = tasks.filter(function (task) {
    return task.status === status;
  }).length;

  countEl.textContent = count;
  countEl.setAttribute("aria-label", count + (count === 1 ? " task" : " tasks"));
}




function renderActivity() {
  if (!activityListEl) return;

  activityListEl.innerHTML = "";

  if (activities.length === 0) {
    const emptyEl = document.createElement("li");
    emptyEl.className = "activity-item";
    emptyEl.textContent = "No recent activity";
    activityListEl.appendChild(emptyEl);
    return;
  }

  activities.forEach(function (activity) {
    activityListEl.appendChild(renderActivityItem(activity));
  });
}



function renderActivityItem(activity) {
  const li = document.createElement("li");
  li.className = "activity-item";



  const actorName = activity.actor || activity.message.split(" ")[0] || "You";

  const avatarEl = renderAvatar(actorName, "avatar-sm");
  if (!getMemberByName(actorName) && actorName !== "You") {
    avatarEl.style.setProperty("--avatar-color", ACTOR_COLORS[actorName] || generateColorFromName(actorName));
  }
  if (actorName === "You") {
    avatarEl.style.setProperty("--avatar-color", DEFAULT_ACTOR_COLOR);
  }
  avatarEl.title = actorName;
  li.appendChild(avatarEl);

  const contentEl = document.createElement("div");
  contentEl.className = "activity-content";

  const textEl = document.createElement("p");
  textEl.className = "activity-text";
  textEl.textContent = activity.message;
  contentEl.appendChild(textEl);

  const timeEl = document.createElement("time");
  timeEl.className = "activity-time";
  timeEl.textContent = formatActivityTime(activity.time);
  contentEl.appendChild(timeEl);

  li.appendChild(contentEl);
  return li;
}


function createActivity(type, message) {
  const activity = {
    id: generateId(),
    type: type,
    message: message,
    actor: getCurrentUserName(),
    time: new Date().toISOString()
  };

  activities.unshift(activity);
  saveActivity();
  renderActivity();
}



function formatActivityTime(isoString) {
  const then = new Date(isoString);
  const diffMinutes = Math.floor((Date.now() - then.getTime()) / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return diffMinutes + " min ago";

  return then.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}




function renderTeam() {
  if (!teamGridEl) return;

  teamGridEl.innerHTML = "";
  renderTeamAvatars();

  if (members.length === 0) {
    const emptyEl = document.createElement("p");
    emptyEl.className = "team-grid-empty";
    emptyEl.textContent = 'No team members yet. Click "Add member" to get started.';
    teamGridEl.appendChild(emptyEl);
    return;
  }

  members.forEach(function (member) {
    teamGridEl.appendChild(renderMemberCard(member));
  });
}



function renderTeamAvatars() {
  if (!teamAvatarsEl) return;

  teamAvatarsEl.innerHTML = "";
  members.slice(0, 4).forEach(function (member) {
    const avatarEl = renderAvatar(member.name, "avatar-sm");
    avatarEl.title = member.name;
    teamAvatarsEl.appendChild(avatarEl);
  });
}


function renderMemberCard(member) {
  const card = document.createElement("article");
  card.className = "member-card";
  card.setAttribute("data-member-id", member.id);

  const topEl = document.createElement("div");
  topEl.className = "member-card-top";
  topEl.appendChild(renderAvatar(member.name));

  const identityEl = document.createElement("div");
  identityEl.className = "member-identity";

  const nameEl = document.createElement("p");
  nameEl.className = "member-name";
  nameEl.textContent = member.name;
  identityEl.appendChild(nameEl);

  if (member.role) {
    const roleEl = document.createElement("p");
    roleEl.className = "member-role";
    roleEl.textContent = member.role;
    identityEl.appendChild(roleEl);
  }

  const emailEl = document.createElement("p");
  emailEl.className = "member-email";
  emailEl.textContent = member.email;
  identityEl.appendChild(emailEl);

  topEl.appendChild(identityEl);
  card.appendChild(topEl);

  const actionsEl = document.createElement("div");
  actionsEl.className = "member-card-actions";
  actionsEl.innerHTML =
    '<button class="member-action-btn" type="button" data-member-action="edit">Edit</button>' +
    '<button class="member-action-btn member-action-btn-danger" type="button" data-member-action="delete">Delete</button>';
  card.appendChild(actionsEl);

  return card;
}




function renderAssigneeOptions() {
  if (taskAssigneeInput) {
    const previousValue = taskAssigneeInput.value;

    taskAssigneeInput.innerHTML = '<option value="">Unassigned</option>';
    members.forEach(function (member) {
      const option = document.createElement("option");
      option.value = member.name;
      option.textContent = member.name;
      taskAssigneeInput.appendChild(option);
    });

    const stillExists = Array.prototype.some.call(taskAssigneeInput.options, function (option) {
      return option.value === previousValue;
    });
    if (stillExists) taskAssigneeInput.value = previousValue;
  }

  if (filterAssigneeGroupEl) {
    filterAssigneeGroupEl.innerHTML = "";

    members.forEach(function (member) {
      const option = document.createElement("option");
      option.value = "assignee:" + member.name;
      option.textContent = member.name;
      filterAssigneeGroupEl.appendChild(option);
    });

    const unassignedOption = document.createElement("option");
    unassignedOption.value = "assignee:";
    unassignedOption.textContent = "Unassigned";
    filterAssigneeGroupEl.appendChild(unassignedOption);
  }
}





function generateId(prefix) {
  return (prefix || "task") + "-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
}


function formatDateDisplay(isoDateString) {
  const parts = isoDateString.split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const day = Number(parts[2]);
  const date = new Date(year, month, day);

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}


function getInitials(name) {
  if (!name || !name.trim()) return "NA";

  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return (words[0][0] + words[1][0]).toUpperCase();
}

function getCurrentUserName() {
  return localStorage.getItem(CURRENT_USER_NAME_KEY) || "You";
}




function getAvatarColor(name) {
  if (!name) return DEFAULT_AVATAR_COLOR;
  const member = getMemberByName(name);
  return (member && member.avatarColor) || AVATAR_COLORS[name] || generateColorFromName(name);
}

function getMemberByName(name) {
  if (!name) return null;
  return members.find(function (member) {
    return member.name === name;
  }) || null;
}



function renderAvatar(name, extraClass) {
  const className = "avatar" + (extraClass ? " " + extraClass : "");
  const member = getMemberByName(name);
  const imageUrl = (member && member.avatarUrl) || (name ? AVATAR_IMAGES[name] : null);

  if (imageUrl) {
    const img = document.createElement("img");
    img.className = className;
    img.src = imageUrl;
    img.alt = name;
    return img;
  }

  const span = document.createElement("span");
  span.className = className;
  span.style.setProperty("--avatar-color", getAvatarColor(name));
  span.title = name || "Unassigned";
  span.textContent = getInitials(name);
  return span;
}



function getTodayAtMidnight() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}



function getDaysUntilDueDate(dueDateString) {
  const parts = dueDateString.split("-");
  const due = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  const diffMs = due.getTime() - getTodayAtMidnight().getTime();
  return Math.round(diffMs / 86400000);
}




function updateDeadlineColor(dueDateString) {
  if (!dueDateString) return "due-far";

  const daysLeft = getDaysUntilDueDate(dueDateString);
  if (daysLeft < 0) return "due-overdue";
  if (daysLeft <= 3) return "due-soon";
  return "due-far";
}





function validateForm(title, dueDate) {
  const errors = { title: "", dueDate: "" };

  if (!title || !title.trim()) {
    errors.title = "Task title is required.";
  }

  if (dueDate) {
    const parts = dueDate.split("-");
    const selected = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));

    if (selected < getTodayAtMidnight()) {
      errors.dueDate = "Due date cannot be in the past.";
    }
  }

  const isValid = !errors.title && !errors.dueDate;
  return { isValid: isValid, errors: errors };
}


function showFormErrors(errors) {
  taskTitleError.textContent = errors.title;
  taskTitleInput.classList.toggle("has-error", Boolean(errors.title));

  taskDueDateError.textContent = errors.dueDate;
  taskDueDateInput.classList.toggle("has-error", Boolean(errors.dueDate));
}

function clearFormErrors() {
  showFormErrors({ title: "", dueDate: "" });
}



function validateMemberForm(name, email, excludeId) {
  const errors = { name: "", email: "" };

  if (!name || !name.trim()) {
    errors.name = "Name is required.";
  }

  const trimmedEmail = (email || "").trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!trimmedEmail) {
    errors.email = "Email is required.";
  } else if (!emailPattern.test(trimmedEmail)) {
    errors.email = "Enter a valid email address.";
  } else {
    const isDuplicate = members.some(function (member) {
      return member.email.toLowerCase() === trimmedEmail.toLowerCase() && member.id !== excludeId;
    });
    if (isDuplicate) errors.email = "A member with this email already exists.";
  }

  const isValid = !errors.name && !errors.email;
  return { isValid: isValid, errors: errors };
}

function showMemberFormErrors(errors) {
  memberNameError.textContent = errors.name;
  memberNameInput.classList.toggle("has-error", Boolean(errors.name));

  memberEmailError.textContent = errors.email;
  memberEmailInput.classList.toggle("has-error", Boolean(errors.email));
}

function clearMemberFormErrors() {
  showMemberFormErrors({ name: "", email: "" });
}




function createTask(data) {
  const now = new Date().toISOString();

  const newTask = {
    id: generateId(),
    title: data.title.trim(),
    description: data.description.trim(),
    assignee: data.assignee,
    dueDate: data.dueDate,
    priority: data.priority,
    status: data.status || "backlog",
    createdAt: now,
    updatedAt: now
  };

  tasks.push(newTask);
  saveTasks();
  renderColumn(newTask.status);
  applySearchAndFilter();

  createActivity("created", 'You created task "' + newTask.title + '"');
}





function editTask(id, data) {
  const task = tasks.find(function (t) {
    return t.id === id;
  });
  if (!task) return;


  const previous = {
    title: task.title,
    description: task.description,
    assignee: task.assignee,
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status
  };

  task.title = data.title.trim();
  task.description = data.description.trim();
  task.assignee = data.assignee;
  task.dueDate = data.dueDate;
  task.priority = data.priority;
  task.status = data.status || task.status;
  task.updatedAt = new Date().toISOString();

  saveTasks();
  renderColumn(task.status);
  if (previous.status !== task.status) {
    renderColumn(previous.status);
  }
  applySearchAndFilter();
  logEditActivities(task, previous);
}



function logEditActivities(task, previous) {
  if (previous.status !== task.status) {
    createActivity(
      "moved",
      'You moved "' + task.title + '" from ' + COLUMN_LABELS[previous.status] + " to " + COLUMN_LABELS[task.status]
    );
  }

  if (previous.assignee !== task.assignee) {
    const fromName = previous.assignee || "Unassigned";
    const toName = task.assignee || "Unassigned";
    createActivity(
      "assignee",
      'You changed the assignee for "' + task.title + '" from ' + fromName + " to " + toName
    );
  }

  if (previous.dueDate !== task.dueDate) {
    const toDate = task.dueDate ? formatDateDisplay(task.dueDate) : "no due date";
    createActivity("deadline", 'You updated the deadline for "' + task.title + '" to ' + toDate);
  }




  createActivity("edited", 'You edited task "' + task.title + '"');
}


function deleteTask(id) {
  const task = tasks.find(function (t) {
    return t.id === id;
  });
  const title = task ? task.title : "a task";
  const status = task ? task.status : null;

  tasks = tasks.filter(function (t) {
    return t.id !== id;
  });

  saveTasks();
  if (status) renderColumn(status);
  applySearchAndFilter();

  createActivity("deleted", 'You deleted task "' + title + '"');
}




function updateTaskStatus(task, newStatus) {
  task.status = newStatus;
  task.updatedAt = new Date().toISOString();
}



function moveTask(id, newStatus) {
  const task = tasks.find(function (t) {
    return t.id === id;
  });
  if (!task) return;
  if (task.status === newStatus) return;

  const oldStatus = task.status;
  updateTaskStatus(task, newStatus);

  saveTasks();
  renderColumn(oldStatus);
  renderColumn(newStatus);
  applySearchAndFilter();

  createActivity(
    "moved",
    'You moved "' + task.title + '" from ' + COLUMN_LABELS[oldStatus] + " to " + COLUMN_LABELS[newStatus]
  );
}




function createMember(data) {
  const now = new Date().toISOString();
  const name = data.name.trim();

  const newMember = {
    id: generateId("member"),
    name: name,
    email: data.email.trim(),
    role: data.role.trim(),
    avatarColor: generateColorFromName(name),
    avatarUrl: "",
    createdAt: now,
    updatedAt: now
  };

  members.push(newMember);
  saveMembers();
  renderTeam();
  renderAssigneeOptions();

  createActivity("created", 'You added "' + newMember.name + '" to the team');
}




function editMember(id, data) {
  const member = members.find(function (m) {
    return m.id === id;
  });
  if (!member) return;

  const previousName = member.name;

  member.name = data.name.trim();
  member.email = data.email.trim();
  member.role = data.role.trim();
  member.updatedAt = new Date().toISOString();

  saveMembers();

  if (previousName !== member.name) {
    let anyTaskChanged = false;
    tasks.forEach(function (task) {
      if (task.assignee === previousName) {
        task.assignee = member.name;
        anyTaskChanged = true;
      }
    });
    if (anyTaskChanged) {
      saveTasks();
      renderBoard();
    }
  }

  renderTeam();
  renderAssigneeOptions();

  createActivity("edited", 'You updated team member "' + member.name + '"');
}




function deleteMember(id) {
  const member = members.find(function (m) {
    return m.id === id;
  });
  const name = member ? member.name : "this member";

  members = members.filter(function (m) {
    return m.id !== id;
  });

  saveMembers();
  renderTeam();
  renderAssigneeOptions();

  createActivity("deleted", 'You removed "' + name + '" from the team');
}





function searchTasks(query) {
  searchQuery = (query || "").trim().toLowerCase();
  applySearchAndFilter();
}


function filterTasks(value) {
  activeFilter = value || "all";
  applySearchAndFilter();
}



function applySearchAndFilter() {
  document.querySelectorAll(".task-card").forEach(function (cardEl) {
    const task = tasks.find(function (t) {
      return t.id === cardEl.getAttribute("data-task-id");
    });
    if (!task) return;

    const isVisible = taskMatchesSearch(task) && taskMatchesFilter(task);
    cardEl.classList.toggle("is-hidden", !isVisible);
  });

  updateEmptyFilterMessages();
}



function taskMatchesSearch(task) {
  if (!searchQuery) return true;
  return task.title.toLowerCase().indexOf(searchQuery) !== -1;
}



function taskMatchesFilter(task) {
  if (!activeFilter || activeFilter === "all") return true;

  const separatorIndex = activeFilter.indexOf(":");
  const filterType = activeFilter.slice(0, separatorIndex);
  const filterValue = activeFilter.slice(separatorIndex + 1);

  if (filterType === "priority") return task.priority === filterValue;
  if (filterType === "assignee") return (task.assignee || "") === filterValue;
  if (filterType === "due") return getDueBucket(task.dueDate) === filterValue;

  return true;
}



function getDueBucket(dueDate) {
  if (!dueDate) return null;

  const daysLeft = getDaysUntilDueDate(dueDate);
  if (daysLeft < 0) return "overdue";
  if (daysLeft === 0) return "today";
  return "upcoming";
}




function updateEmptyFilterMessages() {
  STATUSES.forEach(function (status) {
    const listEl = document.querySelector('.task-list[data-tasklist="' + status + '"]');
    if (!listEl) return;

    const existingMessage = listEl.querySelector("[data-filter-empty]");
    if (existingMessage) existingMessage.remove();

    const cardEls = listEl.querySelectorAll(".task-card");
    if (cardEls.length === 0) return;

    const visibleCount = listEl.querySelectorAll(".task-card:not(.is-hidden)").length;
    if (visibleCount === 0) {
      const messageEl = document.createElement("p");
      messageEl.className = "task-list-empty";
      messageEl.setAttribute("data-filter-empty", "true");
      messageEl.textContent = "No matching tasks.";
      listEl.appendChild(messageEl);
    }
  });
}



function openAddModal() {
  currentEditId = "";
  taskForm.reset();
  clearFormErrors();

  taskIdInput.value = "";
  taskPriorityInput.value = "medium";
  taskStatusInput.value = "backlog";

  taskModalTitle.textContent = "Add task";
  taskModalSubmitBtn.textContent = "Add task";

  showModal(taskModalOverlay);
  taskTitleInput.focus();
}

function openEditModal(id) {
  const task = tasks.find(function (t) {
    return t.id === id;
  });
  if (!task) return;

  currentEditId = id;
  clearFormErrors();

  taskIdInput.value = task.id;
  taskTitleInput.value = task.title;
  taskDescriptionInput.value = task.description;
  taskAssigneeInput.value = task.assignee || "";
  taskPriorityInput.value = task.priority;
  taskDueDateInput.value = task.dueDate || "";
  taskStatusInput.value = task.status;

  taskModalTitle.textContent = "Edit task";
  taskModalSubmitBtn.textContent = "Save changes";

  showModal(taskModalOverlay);
  taskTitleInput.focus();
}

function closeTaskModal() {
  hideModal(taskModalOverlay);
  taskForm.reset();
  clearFormErrors();
  currentEditId = "";
}

function handleTaskFormSubmit(event) {
  event.preventDefault();

  const formData = {
    title: taskTitleInput.value,
    description: taskDescriptionInput.value,
    assignee: taskAssigneeInput.value,
    priority: taskPriorityInput.value,
    dueDate: taskDueDateInput.value,
    status: taskStatusInput.value
  };

  const validation = validateForm(formData.title, formData.dueDate);
  showFormErrors(validation.errors);
  if (!validation.isValid) return;

  if (currentEditId) {
    editTask(currentEditId, formData);
  } else {
    createTask(formData);
  }

  closeTaskModal();
}



function openAddMemberModal() {
  currentEditMemberId = "";
  memberForm.reset();
  clearMemberFormErrors();

  memberIdInput.value = "";

  memberModalTitle.textContent = "Add member";
  memberModalSubmitBtn.textContent = "Add member";

  showModal(memberModalOverlay);
  memberNameInput.focus();
}

function openEditMemberModal(id) {
  const member = members.find(function (m) {
    return m.id === id;
  });
  if (!member) return;

  currentEditMemberId = id;
  clearMemberFormErrors();

  memberIdInput.value = member.id;
  memberNameInput.value = member.name;
  memberEmailInput.value = member.email;
  memberRoleInput.value = member.role || "";

  memberModalTitle.textContent = "Edit member";
  memberModalSubmitBtn.textContent = "Save changes";

  showModal(memberModalOverlay);
  memberNameInput.focus();
}

function closeMemberModal() {
  hideModal(memberModalOverlay);
  memberForm.reset();
  clearMemberFormErrors();
  currentEditMemberId = "";
}

function handleMemberFormSubmit(event) {
  event.preventDefault();

  const formData = {
    name: memberNameInput.value,
    email: memberEmailInput.value,
    role: memberRoleInput.value
  };

  const validation = validateMemberForm(formData.name, formData.email, currentEditMemberId);
  showMemberFormErrors(validation.errors);
  if (!validation.isValid) return;

  if (currentEditMemberId) {
    editMember(currentEditMemberId, formData);
  } else {
    createMember(formData);
  }

  closeMemberModal();
}

function openAddColumnModal() {
  currentEditColumnId = "";
  columnForm.reset();
  columnNameError.textContent = "";
  columnNameInput.classList.remove("has-error");
  columnModalTitle.textContent = "Add column";
  columnModalSubmitBtn.textContent = "Create column";
  showModal(columnModalOverlay);
  columnNameInput.focus();
}

function openRenameColumnModal(id) {
  const column = columns.find(function (item) { return item.id === id; });
  if (!column) return;

  currentEditColumnId = id;
  columnForm.reset();
  columnNameError.textContent = "";
  columnNameInput.classList.remove("has-error");
  columnNameInput.value = column.name;
  columnModalTitle.textContent = "Rename column";
  columnModalSubmitBtn.textContent = "Save changes";
  showModal(columnModalOverlay);
  columnNameInput.focus();
}

function closeColumnModal() {
  hideModal(columnModalOverlay);
  columnForm.reset();
  columnNameError.textContent = "";
  columnNameInput.classList.remove("has-error");
  currentEditColumnId = "";
}

function handleColumnFormSubmit(event) {
  event.preventDefault();
  const name = columnNameInput.value.trim();
  const normalizedName = name.toLowerCase();
  const isDuplicate = columns.some(function (column) {
    return column.name.trim().toLowerCase() === normalizedName && column.id !== currentEditColumnId;
  });

  if (!name || isDuplicate) {
    columnNameError.textContent = !name ? "Column name is required." : "A column with this name already exists.";
    columnNameInput.classList.add("has-error");
    return;
  }

  if (currentEditColumnId) {
    const column = columns.find(function (item) { return item.id === currentEditColumnId; });
    if (column) column.name = name;
  } else {
    const baseId = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "column";
    const id = baseId + "-" + Date.now();
    columns.push({ id: id, name: name });
  }
  saveColumns();
  renderColumns();
  renderBoard();
  closeColumnModal();
}

function openDeleteColumnModal(id) {
  if (id === "backlog") return;
  const column = columns.find(function (item) { return item.id === id; });
  if (!column) return;
  pendingDeleteColumnId = id;
  deleteColumnNameEl.textContent = '"' + column.name + '"';
  showModal(deleteColumnModalOverlay);
}

function closeDeleteColumnModal() {
  hideModal(deleteColumnModalOverlay);
  pendingDeleteColumnId = "";
}

function deleteColumn(id) {
  if (id === "backlog") return;
  tasks.forEach(function (task) {
    if (task.status === id) task.status = "backlog";
  });
  columns = columns.filter(function (column) { return column.id !== id; });
  saveTasks();
  saveColumns();
  renderColumns();
  renderBoard();
}

function moveColumn(id, direction) {
  const index = columns.findIndex(function (column) { return column.id === id; });
  const nextIndex = index + direction;
  if (index < 0 || nextIndex < 0 || nextIndex >= columns.length) return;
  const moved = columns.splice(index, 1)[0];
  columns.splice(nextIndex, 0, moved);
  saveColumns();
  renderColumns();
  renderBoard();
}

function closeColumnMenus() {
  document.querySelectorAll(".column-options-menu").forEach(function (menu) {
    menu.hidden = true;
  });
}



function openDeleteModal(id) {
  const task = tasks.find(function (t) {
    return t.id === id;
  });
  if (!task) return;

  pendingDeleteId = id;
  deleteTaskNameEl.textContent = '"' + task.title + '"';
  showModal(deleteModalOverlay);
}

function closeDeleteModal() {
  hideModal(deleteModalOverlay);
  pendingDeleteId = "";
}

function handleDeleteConfirm() {
  if (pendingDeleteId) {
    deleteTask(pendingDeleteId);
  }
  closeDeleteModal();
}



function openDeleteMemberModal(id) {
  const member = members.find(function (m) {
    return m.id === id;
  });
  if (!member) return;

  pendingDeleteMemberId = id;
  deleteMemberNameEl.textContent = '"' + member.name + '"';
  showModal(deleteMemberModalOverlay);
}

function closeDeleteMemberModal() {
  hideModal(deleteMemberModalOverlay);
  pendingDeleteMemberId = "";
}

function handleDeleteMemberConfirm() {
  if (pendingDeleteMemberId) {
    deleteMember(pendingDeleteMemberId);
  }
  closeDeleteMemberModal();
}



function showModal(overlayEl) {
  overlayEl.hidden = false;
}

function hideModal(overlayEl) {
  overlayEl.hidden = true;
}

function isAnyModalOpen() {
  return (
    !taskModalOverlay.hidden ||
    !deleteModalOverlay.hidden ||
    !memberModalOverlay.hidden ||
    !deleteMemberModalOverlay.hidden ||
    !columnModalOverlay.hidden ||
    !deleteColumnModalOverlay.hidden
  );
}

function closeAnyOpenModal() {
  if (!taskModalOverlay.hidden) closeTaskModal();
  if (!deleteModalOverlay.hidden) closeDeleteModal();
  if (!memberModalOverlay.hidden) closeMemberModal();
  if (!deleteMemberModalOverlay.hidden) closeDeleteMemberModal();
  if (!columnModalOverlay.hidden) closeColumnModal();
  if (!deleteColumnModalOverlay.hidden) closeDeleteColumnModal();
}




function handleDragStart(event) {
  const card = event.target.closest(".task-card");
  if (!card) return;

  draggedTaskId = card.getAttribute("data-task-id");
  card.classList.add("is-dragging");


  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", draggedTaskId);
}



function handleDragEnd(event) {
  const card = event.target.closest(".task-card");
  if (card) card.classList.remove("is-dragging");

  draggedTaskId = "";

  document.querySelectorAll(".column.is-drag-over").forEach(function (col) {
    col.classList.remove("is-drag-over");
  });
}



function handleDragOver(event) {
  const listEl = event.target.closest(".task-list");
  if (!listEl) return;

  event.preventDefault();
  event.dataTransfer.dropEffect = "move";

  const columnEl = listEl.closest(".column");
  if (columnEl) columnEl.classList.add("is-drag-over");
}




function handleDragLeave(event) {
  const listEl = event.target.closest(".task-list");
  if (!listEl) return;

  const columnEl = listEl.closest(".column");
  if (columnEl && !columnEl.contains(event.relatedTarget)) {
    columnEl.classList.remove("is-drag-over");
  }
}


function handleDrop(event) {
  const listEl = event.target.closest(".task-list");
  if (!listEl) return;

  event.preventDefault();

  const columnEl = listEl.closest(".column");
  if (columnEl) columnEl.classList.remove("is-drag-over");

  const newStatus = listEl.getAttribute("data-tasklist");
  const taskId = draggedTaskId || event.dataTransfer.getData("text/plain");

  if (taskId && newStatus) {
    moveTask(taskId, newStatus);
  }
}





function isLoggedIn() {
  return localStorage.getItem(IS_LOGGED_IN_KEY) === "true";
}


function renderCurrentUser() {
  const name = getCurrentUserName();
  const email = localStorage.getItem(CURRENT_USER_EMAIL_KEY) || "";
  const avatarUrl = localStorage.getItem(CURRENT_USER_AVATAR_KEY) || "";

  if (profileNameEl) profileNameEl.textContent = name;
  if (profileEmailEl) profileEmailEl.textContent = email;

  updateAvatarElement(profileAvatarEl, name, avatarUrl);
  updateAvatarElement(profileDropdownAvatarEl, name, avatarUrl);
}





function updateAvatarElement(el, name, avatarUrl) {
  if (!el) return;

  if (avatarUrl) {


    el.style.backgroundImage = "url(" + JSON.stringify(avatarUrl) + ")";
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
    el.style.backgroundRepeat = "no-repeat";
    el.style.removeProperty("--avatar-color");
    el.classList.add("has-avatar-image");
    el.textContent = "";
  } else {
    el.style.backgroundImage = "";
    el.style.backgroundSize = "";
    el.style.backgroundPosition = "";
    el.style.backgroundRepeat = "";
    el.style.setProperty("--avatar-color", getAvatarColor(name));
    el.classList.remove("has-avatar-image");
    el.textContent = getInitials(name);
  }

  el.title = name;
}


function handleLogout() {
  localStorage.removeItem(IS_LOGGED_IN_KEY);
  localStorage.removeItem(CURRENT_USER_EMAIL_KEY);
  localStorage.removeItem(CURRENT_USER_NAME_KEY);
  localStorage.removeItem(CURRENT_USER_AVATAR_KEY);
  localStorage.removeItem(CURRENT_WORKSPACE_KEY);
  window.location.href = "login.html";
}



function openProfileMenu() {
  profileDropdown.hidden = false;
  profileMenuBtn.setAttribute("aria-expanded", "true");
}

function closeProfileMenu() {
  profileDropdown.hidden = true;
  profileMenuBtn.setAttribute("aria-expanded", "false");
}

function toggleProfileMenu() {
  if (profileDropdown.hidden) {
    openProfileMenu();
  } else {
    closeProfileMenu();
  }
}





function switchView(view) {
  const isTeam = view === "team";

  boardViewEl.hidden = isTeam;
  teamViewEl.hidden = !isTeam;
  if (filterFieldEl) filterFieldEl.hidden = isTeam;

  currentView = view;
}







function handleNavClick(target) {
  let targetEl = null;

  if (target === "dashboard") {
    switchView("board");
    window.scrollTo({ top: 0, behavior: "smooth" });
    targetEl = document.querySelector(".app-header");
  } else if (target === "board") {
    switchView("board");
    targetEl = boardViewEl;
  } else if (target === "team") {
    switchView("team");
    targetEl = teamViewEl;
  } else if (target === "activity") {
    targetEl = document.getElementById("activityPanel");
  }

  if (!targetEl) return;

  if (target !== "dashboard") {
    targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  flashHighlight(targetEl);
}




function flashHighlight(el) {
  el.classList.add("nav-flash");
  window.setTimeout(function () {
    el.classList.remove("nav-flash");
  }, 900);
}




addTaskBtn.addEventListener("click", openAddModal);


taskModalCloseBtn.addEventListener("click", closeTaskModal);
taskModalCancelBtn.addEventListener("click", closeTaskModal);
taskModalOverlay.addEventListener("click", function (event) {
  if (event.target === taskModalOverlay) closeTaskModal();
});


taskForm.addEventListener("submit", handleTaskFormSubmit);


deleteModalCancelBtn.addEventListener("click", closeDeleteModal);
deleteModalOverlay.addEventListener("click", function (event) {
  if (event.target === deleteModalOverlay) closeDeleteModal();
});
deleteModalConfirmBtn.addEventListener("click", handleDeleteConfirm);


document.addEventListener("keydown", function (event) {
  if (event.key !== "Escape") return;

  if (isAnyModalOpen()) {
    closeAnyOpenModal();
  } else if (!profileDropdown.hidden) {
    closeProfileMenu();
    profileMenuBtn.focus();
  }
});



boardEl.addEventListener("click", function (event) {
  const menuButton = event.target.closest(".column-menu-btn");
  if (menuButton) {
    const columnEl = menuButton.closest(".column");
    const menu = columnEl && columnEl.querySelector(".column-options-menu");
    const shouldOpen = menu && menu.hidden;
    closeColumnMenus();
    if (menu) menu.hidden = !shouldOpen;
    return;
  }

  const menuAction = event.target.closest("[data-column-action]");
  if (menuAction) {
    const columnEl = menuAction.closest(".column");
    const columnId = columnEl && columnEl.getAttribute("data-column");
    const action = menuAction.getAttribute("data-column-action");
    closeColumnMenus();
    if (action === "rename") openRenameColumnModal(columnId);
    if (action === "delete") openDeleteColumnModal(columnId);
    if (action === "left") moveColumn(columnId, -1);
    if (action === "right") moveColumn(columnId, 1);
    return;
  }

  const editBtn = event.target.closest('[data-action="edit"]');
  if (editBtn) {
    const card = editBtn.closest(".task-card");
    if (card) openEditModal(card.getAttribute("data-task-id"));
    return;
  }

  const deleteBtn = event.target.closest('[data-action="delete"]');
  if (deleteBtn) {
    const card = deleteBtn.closest(".task-card");
    if (card) openDeleteModal(card.getAttribute("data-task-id"));
  }
});



boardEl.addEventListener("dragstart", handleDragStart);
boardEl.addEventListener("dragend", handleDragEnd);
boardEl.addEventListener("dragover", handleDragOver);
boardEl.addEventListener("dragleave", handleDragLeave);
boardEl.addEventListener("drop", handleDrop);


searchInputEl.addEventListener("input", function (event) {
  searchTasks(event.target.value);
});


filterSelectEl.addEventListener("change", function (event) {
  filterTasks(event.target.value);
});





boardEl.addEventListener("keydown", function (event) {
  const isCard = event.target.classList && event.target.classList.contains("task-card");
  if (isCard && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openEditModal(event.target.getAttribute("data-task-id"));
  }
});


profileMenuBtn.addEventListener("click", function (event) {
  event.stopPropagation();
  toggleProfileMenu();
});

document.addEventListener("click", function (event) {
  if (!profileDropdown.hidden && !event.target.closest(".profile-menu")) {
    closeProfileMenu();
  }
  if (!event.target.closest(".column-options-menu") && !event.target.closest(".column-menu-btn")) {
    closeColumnMenus();
  }
});



profileDropdown.querySelectorAll(".profile-dropdown-item").forEach(function (itemBtn) {
  itemBtn.addEventListener("click", function () {
    const action = itemBtn.getAttribute("data-profile-action");
    closeProfileMenu();
    if (action === "logout") handleLogout();
  });
});


navLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    handleNavClick(link.getAttribute("data-scroll-target"));
  });
});


addMemberBtn.addEventListener("click", openAddMemberModal);

addColumnBtn.addEventListener("click", openAddColumnModal);
columnModalCloseBtn.addEventListener("click", closeColumnModal);
columnModalCancelBtn.addEventListener("click", closeColumnModal);
columnModalOverlay.addEventListener("click", function (event) {
  if (event.target === columnModalOverlay) closeColumnModal();
});
columnForm.addEventListener("submit", handleColumnFormSubmit);
deleteColumnModalCancelBtn.addEventListener("click", closeDeleteColumnModal);
deleteColumnModalOverlay.addEventListener("click", function (event) {
  if (event.target === deleteColumnModalOverlay) closeDeleteColumnModal();
});
deleteColumnModalConfirmBtn.addEventListener("click", function () {
  if (pendingDeleteColumnId) deleteColumn(pendingDeleteColumnId);
  closeDeleteColumnModal();
});


memberModalCloseBtn.addEventListener("click", closeMemberModal);
memberModalCancelBtn.addEventListener("click", closeMemberModal);
memberModalOverlay.addEventListener("click", function (event) {
  if (event.target === memberModalOverlay) closeMemberModal();
});


memberForm.addEventListener("submit", handleMemberFormSubmit);


deleteMemberModalCancelBtn.addEventListener("click", closeDeleteMemberModal);
deleteMemberModalOverlay.addEventListener("click", function (event) {
  if (event.target === deleteMemberModalOverlay) closeDeleteMemberModal();
});
deleteMemberModalConfirmBtn.addEventListener("click", handleDeleteMemberConfirm);



teamGridEl.addEventListener("click", function (event) {
  const editBtn = event.target.closest('[data-member-action="edit"]');
  if (editBtn) {
    const card = editBtn.closest(".member-card");
    if (card) openEditMemberModal(card.getAttribute("data-member-id"));
    return;
  }

  const deleteBtn = event.target.closest('[data-member-action="delete"]');
  if (deleteBtn) {
    const card = deleteBtn.closest(".member-card");
    if (card) openDeleteMemberModal(card.getAttribute("data-member-id"));
  }
});



function init() {



  if (!isLoggedIn()) {
    window.location.href = "login.html";
    return;
  }

  columns = loadColumns();
  saveColumns();
  renderColumns();

  members = loadMembers();
  saveMembers();
  renderCurrentUser();
  renderTeam();
  renderAssigneeOptions();

  tasks = loadTasks();
  saveTasks();
  renderBoard();

  loadCurrentActivity();

  switchView("board");
}

init();
