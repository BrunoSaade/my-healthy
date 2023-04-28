import { app, auth } from "../service/firebase/firebase.js";
import {signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"

document.getElementById('loginButton').addEventListener('click', handleLogin)

const formData = {
  email: () => document.getElementById('email'),
  password: () => document.getElementById('password'),
  errorMsg: () => document.getElementById('erroMsg'),
}

function handleLogin() {
  const email = formData.email().value
  const password = formData.password().value

  signInWithEmailAndPassword(auth, email, password)
  .then(response => {
    errorMsg.style.display = "none"
    window.location.href = '/logged/main'
  }).catch(error => {
    if (error.code === "auth/invalid-email" || error.code === "auth/wrong-password") {
      errorMsg.style.display = "block"
    }
    console.log(error)
  })
}
