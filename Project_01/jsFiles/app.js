
async function loadData() {

    const users =
        await fetch("../data/users.json")
            .then(res => res.json());

    const cards =
        await fetch("../data/cards.json")
            .then(res => res.json());

    const goals =
        await fetch("../data/goal.json")
            .then(res => res.json());

    const plans =
        await fetch("../data/plans.json")
            .then(res => res.json());

    const activities =
        await fetch("../data/recentActivity.json")
            .then(res => res.json());

    const reports =
        await fetch("../data/detailedReport.json")
            .then(res => res.json());

    const upcomingClass =
        await fetch("../data/upcomingClass.json")
            .then(res => res.json());

    return {
        users,
        cards,
        goals,
        plans,
        activities,
        reports,
        upcomingClass
    };

}

// ======================= SKELETON =========================

function skeleton() {
    const skeleton = document.querySelector(".dashboard-skeleton");

    const content = document.querySelector(".main-grid");

    content.style.display = "none";

    skeleton.style.display = "block";

    setTimeout(() => {

        skeleton.style.display = "none";

        content.style.display = "block";

    }, 500);
}

// ==================== OVERVIEW PAGE ========================


function greeting() {
    const hours = new Date().getHours();
    const nameEl = document.getElementById("header-name1");

    let Greeting;
    if (hours >= 5 && hours < 12) {
        Greeting = "Good Morning";
    }
    else if (hours >= 12 && hours < 17) {
        Greeting = "Good Afternoon";
    }
    else if (hours >= 17 && hours < 20) {
        Greeting = "Good Evening";

    }
    else {
        Greeting = "Good Night";
    }

    if (nameEl) {
        nameEl.textContent = `${Greeting},`;
    }
}


//Notification Popup

const dummyNotification = [
    { icon: "🏋🏻‍♀️", text: "Your HIIT class starts in next 30 minutes!", time: "Just now" },
    { icon: "🏆", text: "You moved up to Rank #4 this week!", time: "Yesterday" },
    { icon: "💧", text: "Reminder: Stay hydrated — drink water!", time: "Yesterday" },
    { icon: "📆", text: "New class added: Morning Yoga - 7:00 AM", time: "2 Days ago" },
]

function setupNotification() {
    const bellIcon = document.querySelector(".fa-bell");
    if (!bellIcon)
        return;

    const badge = document.createElement("span");
    badge.id = "notif-badge";
    badge.textContent = dummyNotification.length;
    Object.assign(badge.style, {
        position: "absolute",
        top: "-6px",
        right: "-6px",
        background: "#e74c3c",
        color: "#fff",
        borderRadius: "50%",
        fontSize: "11px",
        fontWeight: "bold",
        width: "18px",
        height: "18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",

    })

    bellIcon.style.position = "relative";
    bellIcon.style.cursor = "pointer";
    bellIcon.parentElement.style.position = "relative";
    bellIcon.appendChild(badge);


    const popup = document.createElement("div");
    popup.id = "notif-popup";
    Object.assign(popup.style, {
        position: "absolute",
        top: "60px",
        right: "80px",
        width: "280px",
        background: "#161710",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "14px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        zIndex: "1000",
        display: "none",
        overflow: "hidden",
        fontFamily: "inherit",
    })

    const header = document.createElement("div");
    header.innerHTML = `<strong style = "font-size:15px; color:#fff;">Notifications</strong> <span id="mark-read-btn" style = "font-size:12px;color:#a78bfa; cursor:pointer;">Mark all read</span>`;

    Object.assign(header.style, {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
    })
    popup.appendChild(header);

    dummyNotification.forEach((n) => {
        const item = document.createElement("div");
        item.className = "notif-item";
        item.innerHTML = `<span style = "font-size:22px;">${n.icon}</span>
        <div style = "flex:1; margin-left:10px;">
        <p style = "margin:0; font-size:13px; color:#e2e8f0;">${n.text}</p>
        <small style="color:#94a3b8;">${n.time}</small>
        </div>`;
        Object.assign(item.style, {
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            cursor: "pointer",
            transition: "background 0.2s",
        })
        item.addEventListener("mouseenter", () => (item.style.background = "rgba(167,139,250,0.08)"));
        item.addEventListener("mouseleave", () => (item.style.background = "transparent"));
        popup.appendChild(item);
    });
    document.body.appendChild(popup);
    setTimeout(() => {
        const markBtn = document.getElementById("mark-read-btn");
        if (markBtn) {
            markBtn.addEventListener("click", () => {
                badge.style.display = "none";
                popup.style.display = "none";

            });
        }
    }, 0);

    bellIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = popup.style.display === "block";
        closeAllPopups();
        popup.style.display = isOpen ? "none" : "block";
    })

}



function closeAllPopups() {
    const popup = document.getElementById("notif-popup");
    const dropdown = document.getElementById("profile-dropdown");
    if (popup) popup.style.display = "none";
    if (dropdown) dropdown.style.display = "none";
}


document.addEventListener("click", closeAllPopups);



//Profile click

function setupProfileDropdown() {
    const profilePic = document.getElementById("profile-pic");
    if (!profilePic)
        return;

    profilePic.style.cursor = "pointer";
    profilePic.style.borderRadius = "50%";
    profilePic.style.border = "2px solid transparent";
    profilePic.style.transition = "border 0.2s";
    profilePic.addEventListener("mouseenter", () => (profilePic.style.border = "2px solid #BEFF00"));
    profilePic.addEventListener("mouseleave", () => (profilePic.style.border = "2px solid transparent"));

    const dropdown = document.createElement("div");
    dropdown.id = "profile-dropdown";

    const menuItems = [
        { icon: "👤", label: "View Profile", href: "/htmlFiles/yourProgress.html" },
        { icon: "⚙️", label: "Settings", href: "/htmlFiles/setting.html" },
        { icon: "🏅", label: "My Rewards", href: "#" },
        { icon: "🚪", label: "Logout", href: "/htmlFiles/login.html", danger: true },
    ];

    Object.assign(dropdown.style, {
        position: "absolute",
        top: "65px",
        right: "10px",
        width: "200px",
        background: "#161710",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "14px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        zIndex: "1000",
        display: "none",
        overflow: "hidden",
        fontFamily: "inherit",
    });
    menuItems.forEach((item) => {
        const el = document.createElement("a");
        el.href = item.href;
        el.innerHTML = `<span style="margin-right:10px;">${item.icon}</span>${item.label}`;
        Object.assign(el.style, {
            display: "flex",
            alignItems: "center",
            padding: "12px 16px",
            color: item.danger ? "#f87171" : "#e2e8f0",
            fontSize: "14px",
            textDecoration: "none",
            transition: "background 0.2s",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
        });
        el.addEventListener("mouseenter", () => (el.style.background = "rgba(167,139,250,0.08)"));
        el.addEventListener("mouseleave", () => (el.style.background = "transparent"));
        dropdown.appendChild(el);
    });

    document.body.appendChild(dropdown);

    profilePic.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = dropdown.style.display === "block";
        closeAllPopups();
        dropdown.style.display = isOpen ? "none" : "block";
    });
}












document.addEventListener("DOMContentLoaded", () => {

    // ========================= SIGN UP ======================

    const signUpBtn = document.getElementById("signUp-btn");

    if (signUpBtn) {

        signUpBtn.addEventListener(
            "click",
            (e) => {

                e.preventDefault();

                const name = document.getElementById("signUp-name").value;

                const email = document.getElementById("signUp-email").value;

                const phone = document.getElementById("signUp-phone").value;

                const age = document.getElementById("signUp-age").value;

                const password = document.getElementById("signUp-password").value;

                const membership = document.getElementById("membership-choice").value;





                if (name == "" || email == "" || phone == "" || age == "" || password == "") {
                    alert("Fill all the details");
                    return;
                }


                if (!/^\d{10}$/.test(phone)) {

                    alert(
                        "Phone number must contain exactly 10 digits"
                    );
                    return;
                }







                let users = JSON.parse(localStorage.getItem("users")) || [];


                const emailExists =
                    users.find(
                        u =>
                            u.useremail === email
                    );

                if (emailExists) {

                    alert(
                        "Email already exists"
                    );

                    return;

                }


                const newUser = {

                    id: Date.now(),

                    joinedDate: new Date().toISOString(),


                    useremail: email,

                    password: password,

                    profile: {

                        name: name,

                        membership: membership,

                        popular: "Basic",

                        rewardPoints: 0,

                    },

                    phone: phone,

                    age: age

                };


                users.push(
                    newUser
                );


                localStorage.setItem(

                    "users",

                    JSON.stringify(
                        users
                    )

                );


                localStorage.setItem(
                    "currentUserId",
                    newUser.id
                );

                localStorage.setItem(

                    "cards_" + newUser.id,

                    JSON.stringify({

                        totalSessions: {
                            value: 0,
                            change: "+0%"
                        },

                        caloriesBurned: {
                            value: "0",
                            change: "+0%"
                        },

                        streak: {
                            value: "0 🔥"
                        },

                        weeklyRank: {
                            value: "#999 🏆"
                        }

                    })

                );

                localStorage.setItem(
                    "userProfile_" + newUser.id,
                    JSON.stringify({

                        name: name,

                        weight: "0",

                        height: "0",

                        age: age,

                        goal: "Not Set",

                        workout: "Not Set"

                    })

                );

                window.location.href = "overview.html";

            });
    }


    // ================== LOGIN PAGE ==================

    const loginBtn = document.getElementById("loginBtn");

    if (loginBtn) {

        loginBtn.addEventListener("click", (e) => {
            e.preventDefault();

            const useremail = document.getElementById("login-email").value;

            const password = document.getElementById("login-pass").value;


            loadData().then(data => {

                const localUsers = JSON.parse(localStorage.getItem("users")) || [];


                const allUsers = [
                    ...data.users,
                    ...localUsers
                ];


                const currentUser =
                    allUsers.find(
                        u =>
                            u.useremail === useremail &&
                            u.password === password
                    );


                if (currentUser) {
                    localStorage.setItem("currentUserId", currentUser.id);

                    window.location.href = "overview.html";
                }
                else {
                    alert(
                        "Wrong email or password"
                    );
                }

            });

        });

    }

    const headerName = document.getElementById("header-name2");
    const headerPhoto = document.getElementById("profile-pic");
    if (headerName) {

        greeting();
        setupNotification();
        setupProfileDropdown();

        loadData().then(data => {

            const id = localStorage.getItem("currentUserId");
            const profile = JSON.parse(localStorage.getItem("userProfile_" + id)) || {};

            const localUsers =
                JSON.parse(
                    localStorage.getItem("users")
                ) || [];

            const allUsers = [
                ...data.users,
                ...localUsers
            ];

            const currentUser =
                allUsers.find(
                    u => u.id == id
                );


            if (headerPhoto && profile.photo) {
                headerPhoto.src = profile.photo;

            }


            // name update

            if (currentUser) {
                headerName.textContent = profile.name || currentUser.profile.name;

                const reward = document.getElementById("reward-points");

                if (reward) {
                    reward.textContent = currentUser.profile.rewardPoints;
                }
            }
        });

    }

    // ======================= OVERVIEW PAGE =======================

    const renewBtn = document.getElementById("renew-btn");

    if (renewBtn) {

        skeleton(); // for skeleton

        loadData().then(data => {

            const id = localStorage.getItem("currentUserId");

            const localUsers =

                JSON.parse(
                    localStorage.getItem(
                        "users"
                    )
                ) || [];


            const allUsers = [

                ...data.users,

                ...localUsers

            ];


            const currentUser =
                allUsers.find(
                    u => String(u.id) === String(id)
                );

            //========== USER DATA =========

            if (currentUser) {

                document.getElementById("active-plan").textContent = currentUser.profile.membership;
                document.getElementById("popular-plan").textContent = currentUser.profile.popular;
            }

            const currentPlan =
                data.plans.find(
                    u => String(u.id) === String(id)
                );


            // ================= DATE ======================

            let joined;

            if (currentUser.joinedDate) {
                joined = new Date(currentUser.joinedDate);

            }
            else if (currentPlan) {

                joined = new Date(currentPlan.joinedDate);

            }
            else {
                joined = new Date();
            }

            const today = new Date();

            const expiryDate = new Date(joined);

            expiryDate.setMonth(expiryDate.getMonth() + 1);

            const diff = expiryDate - today;


            const daysLeft = Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);


            document.getElementById("renew-btn").textContent = "Renew in " + daysLeft + "D";


            document.getElementById("date-expiry").textContent = expiryDate.toLocaleDateString("en-US",
                {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                }
            );

            document.getElementById("date-expiry-left").textContent = daysLeft + " days left";




            //========== CARDS =========
            const localCards =

                JSON.parse(
                    localStorage.getItem(
                        "cards_" + id
                    )
                );


            const currentUserCards =

                localCards ||

                data.cards.find(
                    u =>
                        u.id == id
                );



            if (currentUserCards) {

                document.getElementById("total-session-value").textContent = currentUserCards.totalSessions.value;
                document.getElementById("total-session-percent").textContent = currentUserCards.totalSessions.change;

                const savedCalories = localStorage.getItem("userCalories_" + id);
                document.getElementById("calories-value").textContent = savedCalories || currentUserCards.caloriesBurned.value;

                document.getElementById("streak-value").textContent = currentUserCards.streak.value;

                document.getElementById("weekly-rank-value").textContent = currentUserCards.weeklyRank.value;
            }

        });

        loadData().then(data => {

            const id = localStorage.getItem("currentUserId");


            const localUsers =
                JSON.parse(
                    localStorage.getItem(
                        "users"
                    )
                ) || [];


            const allUsers = [
                ...data.users,
                ...localUsers
            ];


            const currentUser =

                allUsers.find(
                    u =>
                        u.id == id
                );


            const currentUpcomingClass =
                data.upcomingClass.find(
                    u => u.id == id
                );

            if (currentUpcomingClass) {
                document.getElementById("upcoming-class-topic").textContent = currentUpcomingClass.name;
                document.getElementById("upcoming-class-time").textContent = currentUpcomingClass.time;
                document.getElementById("upcoming-class-studio").textContent = currentUpcomingClass.studio;
            } else {

                document.getElementById("upcoming-class-topic").textContent = "No Classes"
                document.getElementById("card-details-sec").style.display = "none";
                document.getElementById("upcoming-class-btn").style.display = "none";
            }


        });

        // ============================ ACTIVITY PAGE =============================

        loadData().then(data => {

            const id = localStorage.getItem("currentUserId");

            const localUsers =
                JSON.parse(
                    localStorage.getItem(
                        "users"
                    )
                ) || [];


            const allUsers = [

                ...data.users,

                ...localUsers

            ];


            const currentUser =

                allUsers.find(
                    u =>
                        u.id == id
                );


            const currentActivity =
                data.activities.find(
                    u => u.id == id
                );


            const activityList = document.getElementById("activityList");

            if (activityList) {

                activityList.innerHTML = "";

                const localActivities = JSON.parse(localStorage.getItem("userActivities")) || {};



                const userLocal = localActivities[id] || [];


                const allData = [

                    ...userLocal,

                    ...(currentActivity?.activities || [])

                ];

                allData.forEach(
                    activity => {

                        activityList.innerHTML += `
    
                         <div class="activity-item">
    
                                    <div class="activity-info">
                                        <h3 >${activity.workout} </h3>
                                        <p>${activity.date} </p>
                                    </div>
    
                                    <div class="activity-calories">
                                        <h4>${activity.calories} </h4>
                                    </div>
    
                        </div>
    
                         `;

                    });

            }


        });

    }






    const saveBtn = document.getElementById("saveActivity");


    if (saveBtn) {

        saveBtn.addEventListener("click", (e) => {

            e.preventDefault();

            const userId = localStorage.getItem("currentUserId");

            const workoutFilled = document.getElementById("workoutType").value;

            const caloriesFilled = document.getElementById("calories").value || 0;
            const workoutduration = document.getElementById("duration").value || 0;
            const waterIntakeFilled = document.getElementById("water").value || 0;
            const weightFilled = document.getElementById("weight").value || 0;



            const newActivity = {
                workout: workoutFilled,
                date: "Today",
                duration: workoutduration + " mins",
                calories: "+" + caloriesFilled + " kcal"
            };

            //======== CARD UPDATE ========



            let durationCard = document.getElementById("duration-value");

            if (durationCard) {
                let oldDuration = parseInt(durationCard.textContent) || 0;
                durationCard.textContent = oldDuration + parseInt(workoutduration) + " mins";;
            }

            localStorage.setItem("weightFilled_" + userId, weightFilled);
            localStorage.setItem("waterIntakeFilled_" + userId, waterIntakeFilled);


            let reports = JSON.parse(localStorage.getItem("userReports")) || {};


            if (!reports[userId]) {
                reports[userId] = [];

            }


            reports[userId].unshift({

                date: "Today",

                workout: workoutFilled,

                duration:
                    workoutduration,

                calories:
                    caloriesFilled

            });


            localStorage.setItem("userReports", JSON.stringify(reports));

            document.getElementById("weight-value").textContent = localStorage.getItem("weightFilled_" + userId) + " kg";;
            document.getElementById("water-value").textContent = localStorage.getItem("waterIntakeFilled_" + userId) + " L";


            loadData().then(data => {

                let baseCalories = parseInt(localStorage.getItem("userCalories_" + userId)) || 0;

                let updatedCalories = baseCalories + parseInt(caloriesFilled);

                localStorage.setItem("userCalories_" + userId, updatedCalories);
            });




            let allActivities = JSON.parse(localStorage.getItem("userActivities")) || {};


            if (!allActivities[userId]) {
                allActivities[userId] = [];
            }


            allActivities[userId].unshift(newActivity);


            localStorage.setItem("userActivities", JSON.stringify(allActivities));

            const activityList = document.getElementById("activityList");

            if (activityList) {
                activityList.insertAdjacentHTML("afterbegin",

                    `

                    <div class="activity-item">

                        <div class="activity-info">

                                    <h3>
                                    ${newActivity.workout}
                                    </h3>

                                    <p>
                                    ${newActivity.date},
                                    ${newActivity.duration}
                                    </p>

                                </div>

                            <div class="activity-calories">

                                    <h4>
                                        ${newActivity.calories}
                                    </h4>

                            </div>

                    </div>

`

                );

            }


            alert("Activity Saved");

            document.getElementById("calories").value = "";

            document.getElementById("duration").value = "";

            document.getElementById("water").value = "";

            document.getElementById("weight").value = "";

        });
    }

    const profileSummary = document.getElementById("profile-summary");

    if (profileSummary) {

        const id = localStorage.getItem("currentUserId");

        const profile = JSON.parse(localStorage.getItem("userProfile_" + id));

        if (profile) {

            document.getElementById("summary-weight").textContent = profile.weight + " kg";

            document.getElementById("summary-height").textContent = profile.height + " cm";

            document.getElementById("summary-age").textContent = profile.age + " yrs";

            document.getElementById("summary-goal").textContent = profile.goal;

            document.getElementById("summary-activity").textContent = profile.activity;

        }
    }



    // ====================== ANALYTICS TAB ==========================

    const goalPercent = document.getElementById("goal-percent");

    if (goalPercent) {

        loadData().then(data => {

            const id = localStorage.getItem("currentUserId");

            const localUsers =
                JSON.parse(
                    localStorage.getItem("users")
                ) || [];

            const allUsers = [

                ...data.users,

                ...localUsers

            ];

            const currentUser =
                allUsers.find(
                    u => u.id == id
                );

            const currentGoals =
                data.goals.find(
                    u => String(u.id) === String(id)
                );

            if (currentGoals) {
                document.getElementById("goal-score").textContent = currentGoals.currentCalories;
                document.getElementById("goal-total-score").textContent = currentGoals.targetCalories;
                document.getElementById("goal-des").textContent = currentGoals.description;
                goalPercent.textContent = currentGoals.percentage + " %";
                document.getElementById("bar").style.width = `${currentGoals.percentage}%`
            } else {

                document.getElementById("goal-score").textContent = "0";

                document.getElementById("goal-total-score").textContent = "500";

                document.getElementById("goal-des").textContent = "Start your fitness journey";

                document.getElementById("bar").style.width = "0%";

            }

            const currentDetailedReport =
                data.reports.find(
                    u => String(u.id) === String(id)
                );

            const localReports =
                JSON.parse(
                    localStorage.getItem("userReports")
                ) || {};

            const userReports =
                localReports[id] ||
                currentDetailedReport?.reports ||
                [];


            const tableBody = document.getElementById("table-body");


            if (tableBody) {

                tableBody.innerHTML = ""; // IMPORTANT

                if (userReports.length === 0) {

                    tableBody.innerHTML = `
                        <tr>
                            <td colspan="5"style="text-align:center;padding:30px">
                                    No Reports Yet
                            </td>
                        </tr>
                    `;

                    return;
                }


                userReports.forEach(
                    report => {

                        tableBody.insertAdjacentHTML(
                            "beforeend",
                            `
                <tr>

                    <td>${report.date}</td>

                    <td>
                        <div class="detail-workoutType">

                            <p class="detailWorkoutType-text-1">
                                ${report.workout}
                            </p>

                            <p class="detailWorkoutType-text-2">
                                High intensity
                            </p>

                        </div>
                    </td>

                    <td>
                        <span class="duration">
                            ⏱ ${report.duration} mins
                        </span>
                    </td>

                    <td class="calories">
                            ${report.calories} kcal
                    </td>

                    <td>
                        <span class="status completed">
                            Completed
                        </span>
                    </td>

                </tr>
`
                        );

                    });

            }



        });
    }






    // ============= SAVE SETTINGS ====================


    const profileInput = document.getElementById("goal-image-set");

    const previewImg = document.getElementById("profile-pic-set");

    let profilePhoto = "";

    if (profileInput) {

        profileInput.addEventListener("change", (e) => {

            const file = e.target.files[0];

            if (file) {

                const reader = new FileReader();

                reader.onload = function () {

                    profilePhoto = reader.result;

                    previewImg.src = profilePhoto;

                }

                reader.readAsDataURL(file);

            }

        });

    }


    const saveProfileBtn = document.getElementById("save-changes-set");

    if (saveProfileBtn) {

        saveProfileBtn.addEventListener("click", (e) => {

            e.preventDefault();

            const userId = localStorage.getItem("currentUserId");

            const oldProfile = JSON.parse(localStorage.getItem("userProfile_" + userId)) || {};

            const profileData = {
                ...oldProfile,

                name: document.getElementById("name-set").value,

                email: document.getElementById("email-set").value,

                weight: document.getElementById("weight-set").value,

                height: document.getElementById("height-set").value,

                goalWeight: document.getElementById("goal-weight-set").value,

                age: document.getElementById("age-set").value,

                goal: document.getElementById("workout-goal-set").value,

                activity: document.getElementById("activity-level-set").value,

                photo: profilePhoto || oldProfile.photo
            };

            localStorage.setItem("userProfile_" + userId, JSON.stringify(profileData));

            previewImg.src = profileData.photo;

            alert("Saved");

        });

        loadData().then(data => {

            const id = localStorage.getItem("currentUserId");
            const profile = JSON.parse(localStorage.getItem("userProfile_" + id)) || {};

            const localUsers =
                JSON.parse(
                    localStorage.getItem("users")
                ) || [];

            const allUsers = [
                ...data.users,
                ...localUsers
            ];

            const currentUser =
                allUsers.find(
                    u => u.id == id
                );

            if (currentUser) {

                document.getElementById("profile-name-set").textContent = currentUser.profile.name;


            }

            if (profile.photo) {

                previewImg.src = profile.photo;

            }

            document.getElementById("name-set").value = profile.name || "";

            document.getElementById("email-set").value = profile.email || currentUser.useremail || "";

            document.getElementById("weight-set").value = profile.weight || "";

            document.getElementById("height-set").value = profile.height || "";

            document.getElementById("goal-weight-set").value = profile.goalWeight || "";

            document.getElementById("age-set").value = profile.age || "";

            // document.getElementById("workout-goal-set").value = profile.goal || "";

            // document.getElementById("activity-level-set").value = profile.activity || "";

        });

    }


    // ================= menubar ====================


    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("main-sidebar");

    if (menuToggle && sidebar) {

        menuToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            sidebar.classList.toggle("show-sidebar");
        });

        document.addEventListener("click", () => {
            sidebar.classList.remove("show-sidebar");
        });

        sidebar.addEventListener("click", (e) => {
            e.stopPropagation();
        });

    }



    // ==================== THEME TOGGLE =================


    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
    }

    const toggle = document.getElementById("themeToggle");

    if (toggle) {

        toggle.checked = !document.body.classList.contains("light-mode");

        toggle.addEventListener("change", () => {

            document.body.classList.toggle("light-mode");

            if (document.body.classList.contains("light-mode")) {
                localStorage.setItem("theme", "light");
            }
            else {
                localStorage.setItem("theme", "dark");
            }

        });

    }

    //================== BMI CALCULATOR =======================

    window.setGender = function (el, g) {
        document.querySelectorAll('.radio-btn').forEach(b => b.classList.remove('active'));
        el.classList.add('active');
        window.calcBMI();
    }

    window.calcBMI = function () {
        const h = parseFloat(document.getElementById('bmi-height').value);
        const w = parseFloat(document.getElementById('bmi-weight').value);
        const age = parseFloat(document.getElementById('bmi-age').value) || 25;

        const valEl = document.getElementById('bmi-val');
        const catEl = document.getElementById('bmi-cat');
        const thumb = document.getElementById('bmi-thumb');

        if (!h || !w || h < 50 || w < 10) {
            valEl.textContent = '-';
            catEl.textContent = 'Enter your details to calculate';
            thumb.style.left = '0%';
            return;
        }

        const bmi = w / ((h / 100) ** 2);
        const rounded = Math.round(bmi * 10) / 10;

        valEl.textContent = rounded.toFixed(1);

        let adjustedBMI = bmi;

        if (age > 50) {
            adjustedBMI += 1;
        }
        else if (age < 18) {
            adjustedBMI -= 1;
        }

        let cat, col, pct;

        if (adjustedBMI < 18.5) {
            cat = 'Underweight';
            col = '#3b82f6';
            pct = Math.max(2, ((adjustedBMI - 16) / (18.5 - 16)) * 30);
        }
        else if (adjustedBMI < 25) {
            cat = 'Normal weight';
            col = '#22c55e';
            pct = 30 + ((adjustedBMI - 18.5) / (25 - 18.5)) * 25;
        }
        else if (adjustedBMI < 30) {
            cat = 'Overweight';
            col = '#BEFF00';
            pct = 55 + ((adjustedBMI - 25) / (30 - 25)) * 20;
        }
        else {
            cat = 'Obese';
            col = '#ef4444';
            pct = Math.min(98, 75 + ((adjustedBMI - 30) / (40 - 30)) * 23);
        }

        catEl.textContent = cat;
        catEl.style.color = col;

        thumb.style.left = pct + "%";
        thumb.style.background = col;

    }

    const uptimeEl = document.getElementById('uptime-blocks');

    if (uptimeEl) {
        let html = '<div style="display:flex;gap:3px;flex-wrap:wrap">';
        for (let i = 0; i < 52; i++) {
            const ok = Math.random() > 0.01;
            html += `<div style="width:10px;height:10px;border-radius:2px;background:${ok ? 'var(--lime)' : '#ef4444'};opacity:${ok ? 0.7 : 1}"></div>`;
        }
        html += '</div>';
        uptimeEl.innerHTML = html;
    }

});



history.pushState(
    null,
    null,
    location.href
);

window.onpopstate =
    function () {

        history.go(1);

    };
