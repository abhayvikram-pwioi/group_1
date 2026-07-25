import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { auth, db } from "./firebase.js";
import { checkAndSeedData } from "./db-seeder.js";

const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' rx='60' fill='%237C5CFF'/%3E%3Ctext x='50%25' y='54%25' text-anchor='middle' dominant-baseline='middle' fill='white' font-family='Arial' font-size='34' font-weight='700'%3EST%3C/text%3E%3C/svg%3E";

const elements = {
  toast: document.getElementById("toast"),
  errorMessage: document.getElementById("errorMessage"),
  logoutButton: document.getElementById("logoutButton"),
  sidebarLogout: document.getElementById("sidebarLogout"),
  menuToggle: document.getElementById("menuToggle"),
  sidebar: document.getElementById("sidebar"),
  navAvatar: document.getElementById("navAvatar"),
  navStudentName: document.getElementById("navStudentName"),
  navStudentEmail: document.getElementById("navStudentEmail"),
  welcomeName: document.getElementById("welcomeName"),
  studentAvatar: document.getElementById("studentAvatar"),
  studentName: document.getElementById("studentName"),
  studentEmail: document.getElementById("studentEmail"),
  studentId: document.getElementById("studentId"),
  studentSemester: document.getElementById("studentSemester"),
  overallProgressText: document.getElementById("overallProgressText"),
  circleProgress: document.getElementById("circleProgress"),
  circleProgressValue: document.getElementById("circleProgressValue"),
  courseList: document.getElementById("courseList"),
  taskList: document.getElementById("taskList"),
  activityList: document.getElementById("activityList")
};

let currentUser = null;
let currentStudent = null;
let charts = {}; // Store references to Chart instances for proper destroying/resizing
let unsubscribeDashboard = [];

function showToast(message) {
  if (!elements.toast) return;
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  setTimeout(() => elements.toast.classList.remove("show"), 2500);
}

function showError(message) {
  if (elements.errorMessage) {
    elements.errorMessage.textContent = message;
  }
}

function clearError() {
  showError("");
}

function getFriendlyError(error) {
  const code = error?.code || "";
  if (code.includes("permission-denied")) {
    return "Firestore blocked this account from reading or writing data. Ask the Firebase project owner to allow signed-in users to access students, courses, tasks, activities, and settings.";
  }
  if (code.includes("unavailable")) {
    return "Firebase is unavailable right now. Please try again.";
  }
  return "Something went wrong while loading dashboard data.";
}

function getInitials(name = "Student") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "ST";
}

function getAvatarUrl(student, user) {
  if (student?.avatar) return student.avatar;
  if (user?.photoURL) return user.photoURL;

  const initials = getInitials(student?.name || user?.displayName || "Student");
  return defaultAvatar.replace("ST", encodeURIComponent(initials));
}

function setText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function animateNumber(element, finalValue, suffix = "") {
  if (!element) return;

  const target = Number(finalValue) || 0;
  if (target === 0) {
    element.textContent = `0${suffix}`;
    return;
  }
  const duration = 800;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const value = Math.round(target * progress);
    element.textContent = `${value}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function animateCircle(progress) {
  const safeProgress = Math.max(0, Math.min(Number(progress) || 0, 100));
  const degrees = Math.round((safeProgress / 100) * 360);

  if (elements.circleProgress) {
    elements.circleProgress.style.background = `radial-gradient(circle at center, var(--card) 0 47px, transparent 48px), conic-gradient(var(--violet) 0deg ${degrees}deg, var(--border) ${degrees}deg 360deg)`;
  }

  animateNumber(elements.circleProgressValue, safeProgress, "%");
}

async function logActivity(userId, activityText) {
  try {
    await addDoc(collection(db, "activities"), {
      studentId: userId,
      activityText,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

function setProfile(student, user) {
  const name = student?.name || student?.displayName || user.displayName || "Student";
  const email = student?.email || user.email || "";
  const avatar = getAvatarUrl(student, user);
  const semester = student?.semester || "-";
  const overallProgress = Number(student?.overallProgress) || 0;

  setText(elements.navStudentName, name);
  setText(elements.navStudentEmail, email);
  setText(elements.welcomeName, name.split(" ")[0]);
  setText(elements.studentName, name);
  setText(elements.studentEmail, email);
  setText(elements.studentId, user.uid);
  setText(elements.studentSemester, semester);
  setText(elements.overallProgressText, `${overallProgress}%`);

  if (elements.navAvatar) elements.navAvatar.src = avatar;
  if (elements.studentAvatar) elements.studentAvatar.src = avatar;

  animateCircle(overallProgress);
}

async function getStudent(user) {
  const studentRef = doc(db, "students", user.uid);
  const snapshot = await getDoc(studentRef);
  if (snapshot.exists()) {
    return snapshot.data();
  }
  return null;
}

async function getSettings(user) {
  const settingsRef = doc(db, "settings", user.uid);
  const snapshot = await getDoc(settingsRef);
  return snapshot.exists() ? snapshot.data() : {};
}

function mapSnapshot(snapshot) {
  return snapshot.docs.map((itemDoc) => ({
    id: itemDoc.id,
    ...itemDoc.data()
  }));
}

function subscribeWithSharedFallback(collectionName, userId, onData, onError) {
  let sharedUnsubscribe = null;

  const userUnsubscribe = onSnapshot(
    query(collection(db, collectionName), where("studentId", "==", userId)),
    (snapshot) => {
      if (!snapshot.empty) {
        if (sharedUnsubscribe) {
          sharedUnsubscribe();
          sharedUnsubscribe = null;
        }
        onData(mapSnapshot(snapshot));
        return;
      }

      if (!sharedUnsubscribe) {
        sharedUnsubscribe = onSnapshot(
          collection(db, collectionName),
          (sharedSnapshot) => onData(mapSnapshot(sharedSnapshot)),
          onError
        );
      }
    },
    onError
  );

  return () => {
    userUnsubscribe();
    if (sharedUnsubscribe) sharedUnsubscribe();
  };
}

function toTime(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function calculateAverageGrade(courses) {
  const gradePoints = {
    "A+": 4.3, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D": 1.0, "F": 0.0
  };

  let totalPoints = 0;
  let count = 0;

  courses.forEach(c => {
    if (c.grade && gradePoints[c.grade] !== undefined) {
      totalPoints += gradePoints[c.grade];
      count++;
    }
  });

  if (count === 0) return "--";

  const avgPoints = totalPoints / count;

  // Find closest letter grade
  let bestGrade = "--";
  let minDiff = Infinity;
  for (const [grade, points] of Object.entries(gradePoints)) {
    const diff = Math.abs(points - avgPoints);
    if (diff < minDiff) {
      minDiff = diff;
      bestGrade = grade;
    }
  }

  return bestGrade;
}

function calculateStats(courses, student) {
  const totalCourses = courses.length;
  const completedCourses = courses.filter((course) => {
    const status = String(course.status || "").toLowerCase();
    return status === "completed" || Number(course.progress) >= 100;
  }).length;
  const pendingModules = courses.reduce((total, course) => {
    const totalModules = Number(course.totalModules) || 0;
    const modulesCompleted = Number(course.modulesCompleted) || 0;
    return total + Math.max(totalModules - modulesCompleted, 0);
  }, 0);
  const averageProgress = totalCourses
    ? Math.round(courses.reduce((total, course) => total + (Number(course.progress) || 0), 0) / totalCourses)
    : Number(student?.overallProgress) || 0;

  const averageGrade = calculateAverageGrade(courses);

  return {
    totalCourses,
    completedCourses,
    pendingModules,
    averageGrade,
    averageProgress,
    overallProgress: averageProgress
  };
}

function renderStats(stats) {
  animateNumber(document.querySelector('[data-stat="totalCourses"]'), stats.totalCourses);
  animateNumber(document.querySelector('[data-stat="completedCourses"]'), stats.completedCourses);
  animateNumber(document.querySelector('[data-stat="pendingModules"]'), stats.pendingModules);
  animateNumber(document.querySelector('[data-stat="averageProgress"]'), stats.averageProgress, "%");
  setText(elements.overallProgressText, `${stats.overallProgress}%`);
  animateCircle(stats.overallProgress);
}

function renderCourses(courses) {
  if (!elements.courseList) return;

  if (!courses.length) {
    elements.courseList.innerHTML = '<p class="empty-state">No courses found yet.</p>';
    return;
  }

  // Display top 3 courses on dashboard
  const dashboardCourses = courses.slice(0, 3);

  elements.courseList.innerHTML = dashboardCourses.map((course) => {
    const progress = Math.max(0, Math.min(Number(course.progress) || 0, 100));
    const modulesCompleted = Number(course.modulesCompleted) || 0;
    const totalModules = Number(course.totalModules) || 0;
    const courseName = escapeHtml(course.courseName || course.name || "Untitled Course");
    const instructor = escapeHtml(course.instructor || "Not assigned");
    const status = escapeHtml(course.status || "In Progress");

    return `
      <article class="card course-card">
        <h3>${courseName}</h3>
        <p>Instructor: ${instructor}</p>
        <p>${modulesCompleted}/${totalModules} modules completed</p>
        <div class="progress-bar"><span style="width: ${progress}%"></span></div>
        <span class="status-pill">${status}</span>
      </article>
    `;
  }).join("");
}

function renderTasks(tasks) {
  if (!elements.taskList) return;

  if (!tasks.length) {
    elements.taskList.innerHTML = '<p class="empty-state" style="padding: 10px;">No tasks due.</p>';
    return;
  }

  // Sort tasks: uncompleted first, then by due date
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return (a.dueDate || "").localeCompare(b.dueDate || "");
  });

  elements.taskList.innerHTML = sortedTasks.map((task) => {
    const taskId = task.id;
    const isCompleted = !!task.completed;
    const name = escapeHtml(task.title || task.taskName || "Untitled Task");
    const priority = escapeHtml(task.priority || "Medium");
    const dueDate = escapeHtml(task.deadline || task.dueDate || "--");
    const reminder = !!task.reminder;

    // Class for priority
    let priorityClass = "priority-medium";
    if (priority.toLowerCase() === "high") priorityClass = "priority-high";
    else if (priority.toLowerCase() === "low") priorityClass = "priority-low";

    return `
      <li style="display: flex; align-items: center; justify-content: space-between; gap: 12px; opacity: ${isCompleted ? 0.6 : 1}; text-decoration: ${isCompleted ? 'line-through' : 'none'};">
        <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
          <input type="checkbox" data-task-id="${taskId}" ${isCompleted ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--violet);">
          <div>
            <p style="color: var(--text); font-weight: 700; margin: 0;">${name}</p>
            <p style="font-size: 0.8rem; margin: 2px 0 0 0;">Due: ${dueDate} | Priority: <span class="${priorityClass}" style="font-weight: 700;">${priority}</span></p>
          </div>
        </div>
        ${reminder ? `<i class="fa-solid fa-bell" style="color: var(--yellow); font-size: 0.95rem;" title="Reminder set"></i>` : ''}
      </li>
    `;
  }).join("");

  // Attach change event listener to task checkboxes
  elements.taskList.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', async (e) => {
      const id = e.target.dataset.taskId;
      const completed = e.target.checked;
      const matchedTask = tasks.find(t => t.id === id);
      const taskName = matchedTask ? (matchedTask.title || matchedTask.taskName || "Task") : "Task";

      try {
        await updateDoc(doc(db, "tasks", id), { completed });
        showToast(completed ? "Task completed" : "Task incomplete");
        
        // Log activity
        await logActivity(currentUser.uid, `${completed ? 'Completed' : 'Reopened'} task: ${taskName}`);
        
        // Reload dashboard data
        await loadDashboard(currentUser);
      } catch (error) {
        console.error("Error updating task completion:", error);
        showToast("Error updating task");
        e.target.checked = !completed; // Rollback UI checkbox state
      }
    });
  });
}

function renderActivities(activities) {
  if (!elements.activityList) return;

  if (!activities.length) {
    elements.activityList.innerHTML = '<p class="empty-state" style="padding: 10px;">No recent activities.</p>';
    return;
  }

  // Sort activities by timestamp desc (newest first)
  const sortedActivities = [...activities].sort((a, b) => {
    return toTime(b.timestamp || b.createdAt) - toTime(a.timestamp || a.createdAt);
  });

  // Display top 5 activities
  const topActivities = sortedActivities.slice(0, 5);

  elements.activityList.innerHTML = topActivities.map((act) => {
    const text = escapeHtml(act.activityText || "");
    const activityDate = act.timestamp || act.createdAt;
    const dateStr = activityDate ? new Date(toTime(activityDate)).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : "";

    return `
      <li style="display: flex; flex-direction: column; gap: 4px;">
        <p style="color: var(--text); font-weight: 650; margin: 0; font-size: 0.9rem;">${text}</p>
        <span style="color: var(--secondary); font-size: 0.76rem; font-weight: 500;">${dateStr}</span>
      </li>
    `;
  }).join("");
}

function initCharts(courses, student) {
  const chartStyles = {
    fontFamily: "Inter, sans-serif",
    gridColor: "#2A2A3A",
    textColor: "#A7A7B3",
    violet: "#7C5CFF",
    blue: "#4DA6FF",
    yellow: "#FFD43B",
    pink: "#FF4ECD"
  };

  // Common options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: { color: chartStyles.gridColor },
        ticks: { color: chartStyles.textColor, font: { family: chartStyles.fontFamily } }
      },
      y: {
        grid: { color: chartStyles.gridColor },
        ticks: { color: chartStyles.textColor, font: { family: chartStyles.fontFamily } }
      }
    }
  };

  // Destroy existing charts to prevent memory leaks or hover artifacts
  Object.values(charts).forEach(chart => {
    if (chart && typeof chart.destroy === 'function') {
      chart.destroy();
    }
  });

  // Chart 1: Overall Learning Progress (Line Chart)
  const ctxProgress = document.getElementById("progressChart")?.getContext("2d");
  if (ctxProgress) {
    const progressData = Array.isArray(student?.gradesHistory) && student.gradesHistory.length
      ? student.gradesHistory
      : courses.map((course) => Number(course.progress) || 0);
    const progressLabels = progressData.map((_, i) => courses[i]?.courseName || courses[i]?.name || `Point ${i + 1}`);

    charts.progress = new Chart(ctxProgress, {
      type: "line",
      data: {
        labels: progressLabels,
        datasets: [{
          data: progressData,
          borderColor: chartStyles.violet,
          backgroundColor: chartStyles.violet + "20",
          borderWidth: 3,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          x: commonOptions.scales.x,
          y: {
            ...commonOptions.scales.y,
            min: 0,
            max: 100
          }
        }
      }
    });
  }

  // Chart 2: Grade Distribution (Doughnut Chart)
  const ctxGrades = document.getElementById("gradesChart")?.getContext("2d");
  if (ctxGrades) {
    // Count grades of current courses
    const gradeCounts = {};
    courses.forEach(c => {
      if (c.grade) {
        gradeCounts[c.grade] = (gradeCounts[c.grade] || 0) + 1;
      }
    });

    const labels = Object.keys(gradeCounts);
    const data = Object.values(gradeCounts);

    charts.grades = new Chart(ctxGrades, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [chartStyles.violet, chartStyles.blue, chartStyles.yellow, chartStyles.pink],
          borderColor: "#14141D",
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "right",
            labels: {
              color: chartStyles.textColor,
              font: { family: chartStyles.fontFamily, size: 12 }
            }
          }
        }
      }
    });
  }

  // Chart 3: Subject Performance (Bar Chart)
  const ctxSubject = document.getElementById("subjectChart")?.getContext("2d");
  if (ctxSubject) {
    const labels = courses.map(c => c.courseName || c.name || "Course");
    const data = courses.map(c => c.progress);

    charts.subject = new Chart(ctxSubject, {
      type: "bar",
      data: {
        labels: labels.map(l => l.length > 15 ? l.substring(0, 15) + '...' : l),
        datasets: [{
          data: data,
          backgroundColor: chartStyles.blue,
          borderRadius: 6
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          x: commonOptions.scales.x,
          y: {
            ...commonOptions.scales.y,
            min: 0,
            max: 100
          }
        }
      }
    });
  }

  // Chart 4: Attendance Trend (Line Chart)
  const ctxAttendance = document.getElementById("attendanceChart")?.getContext("2d");
  if (ctxAttendance) {
    const attendanceData = Array.isArray(student?.attendanceHistory) ? student.attendanceHistory : [];
    const attendanceLabels = attendanceData.map((_, i) => `Month ${i + 1}`);

    charts.attendance = new Chart(ctxAttendance, {
      type: "line",
      data: {
        labels: attendanceLabels,
        datasets: [{
          data: attendanceData,
          borderColor: chartStyles.pink,
          backgroundColor: chartStyles.pink + "20",
          borderWidth: 3,
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        ...commonOptions,
        scales: {
          x: commonOptions.scales.x,
          y: {
            ...commonOptions.scales.y,
            min: 0,
            max: 100
          }
        }
      }
    });
  }
}

async function loadDashboard(user, courses = [], tasks = [], activities = []) {
  clearError();

  try {
    currentStudent = await getStudent(user);
    const settings = await getSettings(user);
    currentStudent = { ...currentStudent, ...settings };

    const stats = calculateStats(courses, currentStudent);

    // Populating UI
    setProfile(currentStudent, user);
    renderStats(stats);
    renderCourses(courses);
    renderTasks(tasks);
    renderActivities(activities);
    
    // Initialize Charts
    initCharts(courses, currentStudent);

    // Transition loaded state (remove skeleton shimmer)
    document.body.classList.remove("loading-active");
  } catch (error) {
    console.error("Dashboard loading failed:", error);
    showError(getFriendlyError(error));
    // Remove loading class even on error to display fallback/empty layouts
    document.body.classList.remove("loading-active");
  }
}

function subscribeDashboardData(user) {
  unsubscribeDashboard.forEach((unsubscribe) => unsubscribe());
  unsubscribeDashboard = [];

  const state = {
    courses: [],
    tasks: [],
    activities: []
  };

  const refresh = () => loadDashboard(user, state.courses, state.tasks, state.activities);
  const handleError = (error) => {
    console.error("Live Firestore listener failed:", error);
    showError(getFriendlyError(error));
    document.body.classList.remove("loading-active");
  };

  unsubscribeDashboard.push(subscribeWithSharedFallback(
    "courses",
    user.uid,
    (courses) => {
      state.courses = courses;
      refresh();
    },
    handleError
  ));

  unsubscribeDashboard.push(subscribeWithSharedFallback(
    "tasks",
    user.uid,
    (tasks) => {
      state.tasks = tasks;
      refresh();
    },
    handleError
  ));

  unsubscribeDashboard.push(subscribeWithSharedFallback(
    "activities",
    user.uid,
    (activities) => {
      state.activities = activities;
      refresh();
    },
    handleError
  ));
}

async function logout() {
  try {
    if (currentUser) {
      await logActivity(currentUser.uid, "Logged out successfully");
    }
    await signOut(auth);
    window.location.href = "login.html";
  } catch (error) {
    console.error("Logout failed:", error);
    showError("Logout failed. Please try again.");
  }
}

// Event Listeners
elements.logoutButton?.addEventListener("click", logout);
elements.sidebarLogout?.addEventListener("click", (event) => {
  event.preventDefault();
  logout();
});

elements.menuToggle?.addEventListener("click", () => {
  elements.sidebar?.classList.toggle("open");
});

// Authentication listener
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = user;

  try {
    await checkAndSeedData(user, db);
  } catch (error) {
    console.warn("Starter data setup was skipped:", error);
  }

  subscribeDashboardData(user);
});
