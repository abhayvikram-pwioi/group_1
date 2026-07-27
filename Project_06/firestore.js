import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

import { db } from "./firebase.js";

export async function getStudentData(uid) {

    try {

        const studentRef = doc(db, "studentData", uid);

        const studentSnap = await getDoc(studentRef);

        if (!studentSnap.exists()) {
            throw new Error("Student data not found");
        }

        return studentSnap.data();

    }

    catch (error) {

        console.error("Error fetching student:", error);

        throw error;

    }

}


export async function updateProfile(uid, profileData) {

    try {

        const studentRef = doc(db, "studentData", uid);

        await updateDoc(studentRef, {
            profile: profileData
        });

    }

    catch (error) {

        console.error("Profile Update Error:", error);

        throw error;

    }

}


export async function updateSettings(uid, settingsData) {

    try {

        const studentRef = doc(db, "studentData", uid);

        await updateDoc(studentRef, {
            settings: settingsData
        });

    }

    catch (error) {

        console.error("Settings Update Error:", error);

        throw error;

    }

}

export async function addCourse(uid, course) {

    try {

        const studentRef = doc(db, "studentData", uid);

        await updateDoc(studentRef, {

            myCourses: arrayUnion(course)

        });

    }

    catch (error) {

        console.error("Add Course Error:", error);

        throw error;

    }

}

export async function deleteCourse(uid, updatedCourses) {

    try {

        const studentRef = doc(db, "studentData", uid);

        await updateDoc(studentRef, {

            myCourses: updatedCourses

        });

    }

    catch (error) {

        console.error("Delete Course Error:", error);

        throw error;

    }

}


export async function updateCourse(uid, updatedCourses) {

    try {

        const studentRef = doc(db, "studentData", uid);

        await updateDoc(studentRef, {

            myCourses: updatedCourses

        });

    }

    catch(error){

        console.error(error);

        throw error;

    }

}