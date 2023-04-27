import { auth } from "./firebase/firebase.js";
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"

document.getElementById('resetPasswordBtn').addEventListener('click', handleResetPassword)

const formData = {
  email: () => document.getElementById('email'),
  errorMsg: () => document.getElementById('erroMsg'),
}

function handleResetPassword() {
  const email = formData.email().value
  errorMsg.style.display = "none"
  sendPasswordResetEmail(auth, email).then(response => {
    console.log("sucesso", response)
    window.location.href = '/login'
  }).catch(error => {
    if (error.code === "auth/invalid-email") {
      errorMsg.style.display = "block"
    }
    console.log("erro", error)
  })
}