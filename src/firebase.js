import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBar98QpDiLWJ6RijnoBF1QGJeeFvTDe7A",
  authDomain: "mini-project-af1f0.firebaseapp.com",
  projectId: "mini-project-af1f0",
  storageBucket: "mini-project-af1f0.firebasestorage.app",
  messagingSenderId: "324588716756",
  appId: "1:324588716756:web:c63a5f2066a3b73f4a3141",
  measurementId: "G-HSN82J0GQQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();