// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCupnpLm54qUJR0eE1RKVtUqD6UDeblvUM",
  authDomain: "devotional-b.firebaseapp.com",
  projectId: "devotional-b",
  storageBucket: "devotional-b.appspot.com",
  messagingSenderId: "414988457540",
  appId: "1:414988457540:web:6b4d66715d39baebd1ce11",
  measurementId: "G-3TMF1Z7WBZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db = getFirestore(app);