import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCRq87OFt6hZWIhZqPWVHKLtf-tsjU0_24",
  authDomain: "aquawatch2-b8ee0.firebaseapp.com",
  projectId: "aquawatch2-b8ee0",
  storageBucket: "aquawatch2-b8ee0.firebasestorage.app",
  messagingSenderId: "223585886676",
  appId: "1:223585886676:web:01d324f50aa0165d177641",
  measurementId: "G-4KFSCJJS6V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
