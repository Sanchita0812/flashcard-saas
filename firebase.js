// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJe9xXtVLyCVXtzzNMHXS9ZlFspMNFzUo",
  authDomain: "flashcards-caeef.firebaseapp.com",
  projectId: "flashcards-caeef",
  storageBucket: "flashcards-caeef.appspot.com",
  messagingSenderId: "903290804248",
  appId: "1:903290804248:web:f8806f3ad6467aa712cb6d",
  measurementId: "G-MY1N4H4ZRV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const db = getFirestore(app);

export {db};