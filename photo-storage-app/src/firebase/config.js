import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyBgvy87vlqBu1P6vXYI4QJN6I4gLWAIHPQ",
    authDomain: "joi-photoapp.firebaseapp.com",
    projectId: "joi-photoapp",
    storageBucket: "joi-photoapp.appspot.com",
    messagingSenderId: "681003636582",
    appId: "1:681003636582:web:9bfa5816981c6787c39aa7",
    measurementId: "G-KDTDQY584J"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);