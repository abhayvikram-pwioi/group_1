const welcomeName = document.getElementById("welcomeName");
const navStudentName = document.getElementById("navStudentName");
const navStudentEmail = document.getElementById("navStudentEmail");
const navAvatar = document.getElementById("navAvatar");
const studentName = document.getElementById("studentName");
const studentEmail = document.getElementById("studentEmail");
const studentSemester = document.getElementById("studentSemester");
const studentAvatar = document.getElementById("studentAvatar");

export function renderDashboard(student) {
    renderProfile(student.profile);
}

function renderProfile(profile) {
    welcomeName.textContent = profile.fullName;
    navStudentName.textContent = profile.fullName;
    navStudentEmail.textContent = profile.email;
    studentName.textContent = profile.fullName;
    studentEmail.textContent = profile.email;
    studentSemester.textContent = profile.semester;

    if (profile.profilePic) {
        navAvatar.src = profile.profilePic;
        studentAvatar.src = profile.profilePic;
    }

}