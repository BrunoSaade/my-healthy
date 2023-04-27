import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { initializeFirestore } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCyecgfLtNTA0j0HEnFFZVpt-Nc9DLg9ow",
  authDomain: "my-healthy-beb5e.firebaseapp.com",
  projectId: "my-healthy-beb5e",
  storageBucket: "my-healthy-beb5e.appspot.com",
  messagingSenderId: "838509152559",
  appId: "1:838509152559:web:2b3af8b2bcc2cdea5ab9da"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {experimentalForceLongPolling: true})

const storage = getStorage(app)

export {app, auth, db, storage}