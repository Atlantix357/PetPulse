import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBKuyCzprfZbmAUoBzHX0zSFwUUcCS4gxM",
  authDomain: "petpulse-a2d42.firebaseapp.com",
  projectId: "petpulse-a2d42",
  storageBucket: "petpulse-a2d42.firebasestorage.app",
  messagingSenderId: "741706661416",
  appId: "1:741706661416:web:8f7e094ea0fdd7dbafbf1d",
  measurementId: "G-0LPLG2EQXM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
