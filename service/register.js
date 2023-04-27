import { auth } from "./firebase/firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
import { db } from './firebase/firebase.js'
import { setDoc, doc, } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"

const form = document.getElementById('registerForm')

const elements = {
  gender: () => document.querySelector('input[name="gender"]:checked').value,
  errorMsg: () => document.getElementById('erroMsg'),
  registerBtn: () => document.getElementById('registerBtn'),
}

let isPasswordEqual = false

form.confirmPassword.addEventListener('input', handlePassword)
elements.registerBtn().addEventListener('click', handleRegister)


function handlePassword() {
  if (form.confirmPassword.value === "") {
    errorMsg.style.display = "none"
  } else if (form.password.value !== form.confirmPassword.value) {
    errorMsg.style.display = "block"
  } else {
    errorMsg.style.display = "none"
  } 
  if (form.password.value === form.confirmPassword.value) {
    isPasswordEqual = true;
  } else {
    isPasswordEqual = false;
  }
}

function validateFields() {
  return form.name.value !== "" &&
   form.date.value !== "" &&
   form.email.value !== "" &&
   isPasswordEqual
}

function handleRegister() {
  if (validateFields()) {
    createUserWithEmailAndPassword(auth, form.email.value, form.password.value)
    .then(response => {
      setUserProfile(response.user.uid)
    })
    .catch(error => {
      console.log(error)
      console.log(error)
    })
  }
}

function setUserProfile(uid) {
  setDoc(doc(db, 'users', uid), {
    name: form.name.value,
    gender: elements.gender(),
    date: form.date.value,
    email: form.email.value,
    password: form.password.value,
  })
  .then((response) => {
    window.location.href = "/login/"
  })
  .catch(error => {
    console.log(error)
  })
}