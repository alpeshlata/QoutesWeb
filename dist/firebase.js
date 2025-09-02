// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhxgNqEpreXaM_T_2I7nkLd0FgChbFOhE",
  authDomain: "quotes091-6ee9d.firebaseapp.com",
  projectId: "quotes091-6ee9d",
  storageBucket: "quotes091-6ee9d.firebasestorage.app",
  messagingSenderId: "658020485494",
  appId: "1:658020485494:web:0dccaaad36574a738d9257",
  measurementId: "G-BR9WZ5T79J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);