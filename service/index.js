import { auth } from './firebase/firebase.js'
import { signOut } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"

if(document.getElementById('logoutBtn')) {
  document.getElementById('logoutBtn').addEventListener('click', handleLogout)
}

auth.onAuthStateChanged(() => {
  if (!auth.currentUser) {
      window.location.href = "/"
  } 
})

function handleLogout() {
  signOut(auth)
}