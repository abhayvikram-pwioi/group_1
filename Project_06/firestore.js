import {
  doc,
  getDoc,
  updateDoc
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