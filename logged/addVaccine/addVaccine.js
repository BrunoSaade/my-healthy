import { auth } from '../../service/firebase/firebase.js'
import { db, storage } from '../../service/firebase/firebase.js'
import { addDoc, collection } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { uploadBytes, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js";

let currentFile = null
const form = document.getElementById('registerForm')
let mustBeDisabledNextVaccinationDate = false
const elements = {
  dose: () => document.querySelector('input[name="dose"]:checked').value,
}

document.getElementById('selectImgBtn').addEventListener('click', handleButtonFileClicked)
document.getElementById('vaccinateImg').addEventListener('change', handleFileChoosed)
document.getElementById('registerBtn').addEventListener('click', handleRegister)
form.addEventListener('click', handleDisableInput)

function handleDisableInput() {
  if(form.dose.value === 'onceDose') {
    form.nextVaccinationDate.disabled = true
    mustBeDisabledNextVaccinationDate = true
    form.nextVaccinationDate.value = ""
  } else {
    form.nextVaccinationDate.disabled = false
    mustBeDisabledNextVaccinationDate = false
  }
}

function generateRandomId() {
  const id = Date.now().toString(16) + Math.random().toString(16)
  return id.replace(/\./g, '')
}

function validateFields() {
  return form.vaccinationDate.value !== "" &&
   form.name.value !== "" &&
   (mustBeDisabledNextVaccinationDate || form.nextVaccinationDate.value !== "")
}

function handleRegister() {
  if(validateFields()) {
    uploadImage()
  }
}

function uploadImage() {
  const fileRef = "images/" + generateRandomId()

  uploadBytes(ref(storage, fileRef), currentFile)
  .then((response) => {
    getImgUploadedSource(fileRef)
  })
  .catch((error) => {
    console.log(error)
  })
}

function getImgUploadedSource(fileRef) {
  getDownloadURL(ref(storage, fileRef))
  .then((response) => {
    handleAddVaccine(response, fileRef)
  })
  .catch((error) => {
    console.log(error)
  })
}

function handleAddVaccine(imgUrl, fileRef) {

  let uid = auth.currentUser.uid

  addDoc(collection(db, "users/" + uid + "/vaccines"), {
    vaccinationDate: form.vaccinationDate.value,
    name: form.name.value,
    dose: elements.dose(),
    vaccinationImg: imgUrl,
    nextVaccinationDate: form.nextVaccinationDate.value,
    sourceImg: fileRef
  })
  .then((response) => {
    window.location.href = "/logged/main/"
  })
  .catch((error) => {
    console.log(error)
  })
}

function handleButtonFileClicked() {
  const inputFile = document.getElementById("vaccinateImg")
  inputFile.click()
}

function handleFileChoosed(event) {

  const choosedImgDiv = document.querySelector("#imgChoosed")

  currentFile = event.target.files[0]

  if (currentFile) {
    const reader = new FileReader()

    reader.addEventListener('load', function(e) {
      const readerTarget = e.target;
      renderImgOnScreen(readerTarget.result)
    })

    reader.readAsDataURL(currentFile)
  } else {
    choosedImgDiv.innerHTML = ''
  }
}

function renderImgOnScreen(srcImg) {
  const choosedImgDiv = document.querySelector("#imgChoosed")
  const img = document.createElement('img');
  img.src = srcImg;
  choosedImgDiv.innerHTML = ''
  img.classList.add('section-main--img-choosed')
  choosedImgDiv.appendChild(img)
}