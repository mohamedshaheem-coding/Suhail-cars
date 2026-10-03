import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDeM6LSGuf9KttoZL7nxpzzVtcrtgMJk00",
    authDomain: "usedcars-33f62.firebaseapp.com",
    projectId: "usedcars-33f62",
    storageBucket: "usedcars-33f62.firebasestorage.app",
    messagingSenderId: "755352054932",
    appId: "1:755352054932:web:b1f86d3b04a54d35a91881"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Use initializeFirestore to force long polling (fixes many local network hangs)
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});
export const storage = null; // Firebase Storage not used — images uploaded via Cloudinary
export const auth = getAuth(app);

export default app;
