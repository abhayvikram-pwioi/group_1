import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

export async function checkAndSeedData(user, db) {
  const displayName = user.displayName || user.email?.split("@")[0] || "Student";

  await ignoreSeedFailure("student profile", async () => {
    const studentRef = doc(db, "students", user.uid);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      await setDoc(studentRef, {
        name: displayName,
        email: user.email || "",
        phone: "",
        semester: "Semester 1",
        avatar: "",
        attendanceHistory: [88, 90, 92, 91, 94, 93],
        gradesHistory: [62, 68, 74, 78, 83, 87],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  });

  await ignoreSeedFailure("settings", async () => {
    const settingsRef = doc(db, "settings", user.uid);
    const settingsSnap = await getDoc(settingsRef);
    if (!settingsSnap.exists()) {
      await setDoc(settingsRef, {
        studentId: user.uid,
        displayName,
        avatar: "",
        semester: "Semester 1",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
  });

  await ignoreSeedFailure("courses", () => seedCoursesIfMissing(user, db));
  await ignoreSeedFailure("tasks", () => seedTasksIfMissing(user, db));
  await ignoreSeedFailure("activities", () => seedActivitiesIfMissing(user, db));
}

async function ignoreSeedFailure(label, action) {
  try {
    await action();
  } catch (error) {
    console.warn(`Could not create starter ${label}. Loading readable Firestore data instead.`, error);
  }
}

async function seedCoursesIfMissing(user, db) {
  const coursesSnap = await getDocs(query(collection(db, "courses"), where("studentId", "==", user.uid)));
  if (!coursesSnap.empty) return;

  const courses = [
    {
      studentId: user.uid,
      courseName: "Web Development Basics",
      category: "Frontend",
      instructor: "Priya Sharma",
      progress: 82,
      modulesCompleted: 9,
      totalModules: 11,
      status: "In Progress",
      grade: "A",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600"
    },
    {
      studentId: user.uid,
      courseName: "Database Management",
      category: "Backend",
      instructor: "Rahul Mehta",
      progress: 100,
      modulesCompleted: 12,
      totalModules: 12,
      status: "Completed",
      grade: "A-",
      image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600"
    },
    {
      studentId: user.uid,
      courseName: "JavaScript Programming",
      category: "Programming",
      instructor: "Ananya Gupta",
      progress: 58,
      modulesCompleted: 7,
      totalModules: 12,
      status: "In Progress",
      grade: "B+",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600"
    },
    {
      studentId: user.uid,
      courseName: "UI/UX Design",
      category: "Design",
      instructor: "Kabir Singh",
      progress: 24,
      modulesCompleted: 3,
      totalModules: 12,
      status: "Not Started",
      grade: "B",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600"
    }
  ];

  await Promise.all(courses.map((course) => addDoc(collection(db, "courses"), {
    ...course,
    createdAt: serverTimestamp()
  })));
}

async function seedTasksIfMissing(user, db) {
  const tasksSnap = await getDocs(query(collection(db, "tasks"), where("studentId", "==", user.uid)));
  if (!tasksSnap.empty) return;

  const dayMs = 24 * 60 * 60 * 1000;
  const tasks = [
    {
      studentId: user.uid,
      title: "Submit JavaScript assignment",
      deadline: new Date(Date.now() + dayMs * 2).toISOString().slice(0, 10),
      priority: "High",
      completed: false,
      reminder: true
    },
    {
      studentId: user.uid,
      title: "Revise database normalization",
      deadline: new Date(Date.now() + dayMs * 4).toISOString().slice(0, 10),
      priority: "Medium",
      completed: false,
      reminder: true
    },
    {
      studentId: user.uid,
      title: "Upload UI wireframes",
      deadline: new Date(Date.now() + dayMs * 7).toISOString().slice(0, 10),
      priority: "Low",
      completed: false,
      reminder: false
    }
  ];

  await Promise.all(tasks.map((task) => addDoc(collection(db, "tasks"), {
    ...task,
    createdAt: serverTimestamp()
  })));
}

async function seedActivitiesIfMissing(user, db) {
  const activitiesSnap = await getDocs(query(collection(db, "activities"), where("studentId", "==", user.uid)));
  if (!activitiesSnap.empty) return;

  const activities = [
    "Logged in to EduTrack",
    "Completed Database Management module 12",
    "Updated Web Development progress",
    "Added upcoming JavaScript assignment"
  ];

  await Promise.all(activities.map((activityText) => addDoc(collection(db, "activities"), {
    studentId: user.uid,
    activityText,
    timestamp: serverTimestamp()
  })));
}
