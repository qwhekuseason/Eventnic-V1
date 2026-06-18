import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2fij5CCW5hoGD6wLizRZyhYxZw8a6zNM",
  authDomain: "eventnic-93f29.firebaseapp.com",
  projectId: "eventnic-93f29",
  storageBucket: "eventnic-93f29.firebasestorage.app",
  messagingSenderId: "323374030992",
  appId: "1:323374030992:web:6816bdd42ed855bc2cb815"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function setAdminRole() {
  try {
    console.log("Signing in as admin@eventnic.com to get UID...");
    const cred = await signInWithEmailAndPassword(auth, "admin@eventnic.com", "eventn1c26");
    console.log("Successfully signed in! UID:", cred.user.uid);
    
    console.log("Setting role to 'ADMIN' in Firestore...");
    await setDoc(doc(db, "users", cred.user.uid), {
      name: "System Admin",
      email: "admin@eventnic.com",
      role: "ADMIN",
      createdAt: new Date().toISOString()
    });
    console.log("Firestore document created successfully! The account is now an ADMIN.");
    
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

setAdminRole();
