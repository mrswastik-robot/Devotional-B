// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDeyjkVctd0ec49zJDNAMKPih4eAjAF0EU",
  authDomain: "gods-plan-35.firebaseapp.com",
  projectId: "gods-plan-35",
  storageBucket: "gods-plan-35.appspot.com",
  messagingSenderId: "887149555102",
  appId: "1:887149555102:web:d9b83a9a0c7659aabf7a8f",
  measurementId: "G-3G0R3WPYGL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth();
export const db = getFirestore(app);