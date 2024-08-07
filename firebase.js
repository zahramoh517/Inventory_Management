// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3P1mcvk9aV4oKJOPgGAwoUwdYiML2XtA",
  authDomain: "inventory-management-app-eb88d.firebaseapp.com",
  projectId: "inventory-management-app-eb88d",
  storageBucket: "inventory-management-app-eb88d.appspot.com",
  messagingSenderId: "750409235034",
  appId: "1:750409235034:web:3e19545098f5b5d4323663",
  measurementId: "G-T5CXDYP8Q2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 
const db = getFirestore(app);
const firestore = getFirestore(app);

export { firestore };