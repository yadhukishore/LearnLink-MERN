// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "learnlink-auth.firebaseapp.com",
  projectId: "learnlink-auth",
  storageBucket: "learnlink-auth.appspot.com",
  messagingSenderId: "777387630498",
  appId: "1:777387630498:web:6324209b50392b5ae89cfb",
  measurementId: "G-P7E77JMB39"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);