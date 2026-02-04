// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "upnext-da038.firebaseapp.com",
  projectId: "upnext-da038",
  storageBucket: "upnext-da038.firebasestorage.app",
  messagingSenderId: "450930519732",
  appId: "1:450930519732:web:78a0d7f3b72ceba3bc31e1",
  measurementId: "G-6VVVVFXDKN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
export  {app,auth}