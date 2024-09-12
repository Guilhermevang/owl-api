// Import the functions you need from the SDKs you need
import admin from "firebase-admin";
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// const firebaseConfig = require("@root/firebase-config.json");
const serviceAccountKey = require("@root/service-account-key.json");
  
// Initialize Firebase
// const firebase_app = initializeApp(firebaseConfig);
const firebase_app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey)
});
// const analytics = getAnalytics(firebase_app);

export default firebase_app;