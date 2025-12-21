// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNat57TsKLjI2EWLgi22S1ZlT3AW0Bqrk",
  authDomain: "luminaryauth.firebaseapp.com",
  projectId: "luminaryauth",
  storageBucket: "luminaryauth.firebasestorage.app",
  messagingSenderId: "25042123212",
  appId: "1:25042123212:web:26c531f65482f820d44569"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Use device language for OTP SMS
auth.useDeviceLanguage();