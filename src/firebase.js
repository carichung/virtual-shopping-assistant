// Import Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase project config (Replace with your actual credentials)
const firebaseConfig = {
    apiKey: "AIzaSyDNl9S9K-gJgtatR3Fb8UvEKnTWuiA1TNE",
    authDomain: "virtual-shopping-assista-44d89.firebaseapp.com",
    projectId: "virtual-shopping-assista-44d89",
    storageBucket: "virtual-shopping-assista-44d89.firebasestorage.app",
    messagingSenderId: "935335366524",
    appId: "1:935335366524:web:6607d25168fc4cc845def9",
    measurementId: "G-EML04XYH1P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore database
const db = getFirestore(app);
export { db };
export const auth = getAuth(app);
