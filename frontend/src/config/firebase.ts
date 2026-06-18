import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD2fij5CCW5hoGD6wLizRZyhYxZw8a6zNM",
  authDomain: "eventnic-93f29.firebaseapp.com",
  projectId: "eventnic-93f29",
  storageBucket: "eventnic-93f29.firebasestorage.app",
  messagingSenderId: "323374030992",
  appId: "1:323374030992:web:6816bdd42ed855bc2cb815"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
