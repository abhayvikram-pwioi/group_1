// All student profile data is stored in this one object.
const studentData = {
  name: "Aarav Rajput",
  email: "aarav.s@email.com",
  phone: "+91 98765 43210",
  // course: "Full Stack Web Development",
  // batch: "Batch 2025",
  // joinDate: "15 January 2025",
  completion: 68,
  completedCourses: 4,
  pendingCourses: 2,
  statistics: [
    { title: "Attendance", value: "92%" },
    { title: "Quiz Average", value: "84%" },
    { title: "Assignment Score", value: "88%" },
    { title: "Overall Grade", value: "A" }
  ],
  skills: [
    { name: "HTML", level: 90 },
    { name: "CSS", level: 82 },
    { name: "JavaScript", level: 70 },
    { name: "React", level: 48 }
  ],
  // recentActivity: [
  //   "Completed HTML Forms and Tables lesson",
  //   "Submitted CSS Layout assignment",
  //   "Scored 8 out of 10 in JavaScript quiz",
  //   "Started React Basics course"
  // ],
  // pendingModules: [
  //   "JavaScript DOM Manipulation",
  //   "React Components and Props",
  //   "React State Management",
  //   "Final Project Submission"
  // ]
};

function showNav() {
  const initials = studentData.name
    .split(" ")
    .map(function (word) {
      return word[0];
    })
    .join("");

  const navAvatar = document.getElementById("navAvatar");
  const navName = document.getElementById("navStudentName");
  const navEmail = document.getElementById("navStudentEmail");

  if (navAvatar) {
    navAvatar.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='60' fill='%237C5CFF'/%3E%3Ctext x='50%25' y='54%25' text-anchor='middle' dominant-baseline='middle' fill='white' font-family='Arial' font-size='34' font-weight='700'%3E" +
      initials +
      "%3C/text%3E%3C/svg%3E";
    navAvatar.alt = studentData.name + " profile image";
  }
  if (navName) navName.textContent = studentData.name;
  if (navEmail) navEmail.textContent = studentData.email;
}

function showProfile() {
  const initials = studentData.name
    .split(" ")
    .map(function (word) {
      return word[0];
    })
    .join("");

  document.getElementById("profile-content").innerHTML = `
    <div class="profile-content">
      <div class="avatar" aria-label="${studentData.name} profile image">${initials}</div>
      <div class="profile-details">
        <div class="profile-text">
          <h2 id="student-name">${studentData.name}</h2>
          <p>${studentData.email}</p>
          <p class="completion">Overall Completion: ${studentData.completion}%</p>
        </div>
        <button class="edit-profile-btn" id="editProfileBtn" type="button">
          <i class="fa-solid fa-pen"></i> Edit Profile
        </button>
      </div>
    </div>
  `;
}

function showInformation() {
  const information = [
    { label: "Full Name", value: studentData.name },
    { label: "Email", value: studentData.email },
    { label: "Phone Number", value: studentData.phone },
    // { label: "Course", value: studentData.course },
    // { label: "Batch", value: studentData.batch },
    // { label: "Join Date", value: studentData.joinDate }
  ];

  document.getElementById("student-information").innerHTML = information
    .map(function (item) {
      return `<article class="info-item"><h3>${item.label}</h3><p>${item.value}</p></article>`;
    })
    .join("");
}

function showProgress() {
  const progress = [
    { title: "Overall Progress", value: studentData.completion + "%" },
    { title: "Completed Courses", value: studentData.completedCourses },
    { title: "Pending Courses", value: studentData.pendingCourses }
  ];

  document.getElementById("progress-content").innerHTML = progress
    .map(function (item) {
      return `<article class="progress-item"><h3>${item.title}</h3><p>${item.value}</p></article>`;
    })
    .join("");
}

function showStatistics() {
  document.getElementById("statistics-content").innerHTML = studentData.statistics
    .map(function (item) {
      return `<article class="stat-card"><h3>${item.title}</h3><p>${item.value}</p></article>`;
    })
    .join("");
}

function showSkills() {
  document.getElementById("skills-content").innerHTML = studentData.skills
    .map(function (skill) {
      return `
        <div class="skill">
          <div class="skill-name"><span>${skill.name}</span><span>${skill.level}%</span></div>
          <div class="bar"><div class="bar-fill" style="width: ${skill.level}%"></div></div>
        </div>
      `;
    })
    .join("");
}

function showList(listId, items) {
  const el = document.getElementById(listId);
  if (!el || !items) return;
  el.innerHTML = items
    .map(function (item) {
      return `<li>${item}</li>`;
    })
    .join("");
}

function openEditProfileModal() {
  const overlay = document.getElementById("editProfileOverlay");
  if (!overlay) return;

  document.getElementById("editName").value = studentData.name;
  document.getElementById("editEmail").value = studentData.email;
  document.getElementById("editPhone").value = studentData.phone;

  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeEditProfileModal() {
  const overlay = document.getElementById("editProfileOverlay");
  if (!overlay) return;

  overlay.classList.remove("open");
  document.body.style.overflow = "";
}

function initEditProfileModal() {
  const overlay = document.getElementById("editProfileOverlay");
  const closeBtn = document.getElementById("editProfileClose");
  const cancelBtn = document.getElementById("editProfileCancel");
  const form = document.getElementById("editProfileForm");

  if (!overlay || !closeBtn || !cancelBtn || !form) return;

  // Edit button lives inside profile-content, which is re-rendered by
  // showProfile(), so we use event delegation on the document instead
  // of attaching a listener directly to the button.
  document.addEventListener("click", function (event) {
    if (event.target.closest("#editProfileBtn")) {
      openEditProfileModal();
    }
  });

  closeBtn.addEventListener("click", closeEditProfileModal);
  cancelBtn.addEventListener("click", closeEditProfileModal);

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) closeEditProfileModal();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && overlay.classList.contains("open")) {
      closeEditProfileModal();
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    studentData.name = document.getElementById("editName").value.trim();
    studentData.email = document.getElementById("editEmail").value.trim();
    studentData.phone = document.getElementById("editPhone").value.trim();

    // Re-render the sections that depend on the edited fields
    showNav();
    showProfile();
    showInformation();

    closeEditProfileModal();
  });
}

function initSidebar() {
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");

  if (!menuToggle || !sidebar || !overlay) return;

  function closeSidebar() {
    sidebar.classList.remove("open");
    overlay.classList.remove("open");
  }

  menuToggle.addEventListener("click", function () {
    sidebar.classList.toggle("open");
    overlay.classList.toggle("open");
  });

  overlay.addEventListener("click", closeSidebar);
}

initSidebar();
initEditProfileModal();
showNav();
showProfile();
showInformation();
showProgress();
showStatistics();
showSkills();
showList("activity-list", studentData.recentActivity);
showList("module-list", studentData.pendingModules);
