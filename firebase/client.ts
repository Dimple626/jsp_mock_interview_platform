// Import the functions you need from the SDKs you need
import { initializeApp , getApp,getApps} from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAbbIyXXsEesAJ15JEzak4BUH-lNI9_wGQ",
    authDomain: "prepwise-673c7.firebaseapp.com",
    projectId: "prepwise-673c7",
    storageBucket: "prepwise-673c7.firebasestorage.app",
    messagingSenderId: "907838857156",
    appId: "1:907838857156:web:0328e5799cee530f700e91",
    measurementId: "G-JKSBXL1Z0N"
};

// Initialize Firebase
const app = !getApps.length?initializeApp(firebaseConfig):getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);