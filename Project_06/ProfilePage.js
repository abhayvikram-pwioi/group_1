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
        <h2 id="student-name">${studentData.name}</h2>
        <p>${studentData.email}</p>
        <p class="completion">Overall Completion: ${studentData.completion}%</p>
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
  document.getElementById(listId).innerHTML = items
    .map(function (item) {
      return `<li>${item}</li>`;
    })
    .join("");
}

showProfile();
showInformation();
showProgress();
showStatistics();
showSkills();
showList("activity-list", studentData.recentActivity);
showList("module-list", studentData.pendingModules);
