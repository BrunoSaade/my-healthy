import { app, auth } from './firebase/firebase.js'
import { db, storage } from './firebase/firebase.js'
import { signOut} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
import {  getDoc, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { uploadBytes, ref, deleteObject } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-storage.js"

let mustShowModal = false
let currentFile = null
let sourceImg = null
let mustBeDisabledNextVaccinationDate = false

const form = document.getElementById('editForm')

const elements = {
  dose: () => document.querySelector('input[name="dose"]:checked').value,
}

document.getElementById('deleteBtn').addEventListener('click', handleMustShowModal)
document.getElementById('deleteVaccineModalBkg').addEventListener('click', handleMustShowModal)
document.getElementById('cancelBtn').addEventListener('click', handleMustShowModal)

document.getElementById('selectImgBtn').addEventListener('click', handleButtonFileClicked)
document.getElementById('vaccinateImg').addEventListener('change', handleFileChoosed)
document.getElementById('saveBtn').addEventListener('click', handleSaveVaccine)

document.getElementById('confirmBtn').addEventListener('click', handleDeleteVaccine)

form.addEventListener('click', handleDisableInput)

auth.onAuthStateChanged((user) => {
  const vaccineId = getVaccineId()
  if(vaccineId) {
    getVaccineData(vaccineId)
  } 
})

function updateVaccine() {
  const uid = auth.currentUser.uid
  const vaccineId = getVaccineId()
  const vaccineData = {
    vaccinationDate: form.vaccinationDate.value,
    name: form.name.value,
    dose: elements.dose(),
    nextVaccinationDate: form.nextVaccinationDate.value,
  }

  if(currentFile) {
    vaccineData.vaccinationImg = sourceImg
  }

  updateDoc(doc(db, "users/" + uid + "/vaccines", vaccineId), vaccineData)
  .then((response) => {
    window.location.href = "/logged/main/"
  })
  .catch((error) => {
    console.log(error)
  })
}

function handleDeleteVaccine() {
  let uid = auth.currentUser.uid
  deleteVaccineImg(uid)
}

function deleteVaccineImg(uid) {
  deleteObject(ref(storage, sourceImg))
  .then((response) => {
    deleteVaccine(uid)
  })
  .catch((error) => {
    console.log(error)
  })
}

function deleteVaccine(uid) {
  const vaccineId = getVaccineId()
  deleteDoc(doc(db, "users/" + uid + "/vaccines/" + vaccineId))
  .then((response) => {
    window.location.href = "/logged/main/"
  })
  .catch((error) => {
    console.log(error)
  })
}

function getVaccineData(vaccineId) {
    const uid = auth.currentUser.uid
    getDoc(doc(db, "users/" + uid + "/vaccines/" + vaccineId))
    .then((response) => {
      form.vaccinationDate.value = response.data().vaccinationDate,
      form.name.value = response.data().name,
      form.dose.value = response.data().dose,
      sourceImg = response.data().vaccinationImg,
      form.nextVaccinationDate.value = response.data().nextVaccinationDate
      if(response.data().dose === 'onceDose') { handleDisableInput() }
      renderImgOnScreen(sourceImg)
    })
    .catch((error) => {
      console.log(error)
    })

}

function renderImgOnScreen(srcImg) {
  const choosedImgDiv = document.querySelector("#imgChoosed")
  const img = document.createElement('img');
  img.src = srcImg;
  choosedImgDiv.innerHTML = ''
  img.classList.add('section-main--img-choosed')
  choosedImgDiv.appendChild(img)
}

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

function getVaccineId() {
  return new URLSearchParams(window.location.search).get('id')
}

function validateFields() {
  return form.vaccinationDate.value !== "" &&
  form.name.value !== "" &&
  (mustBeDisabledNextVaccinationDate || form.nextVaccinationDate.value !== "")
}

function handleSaveVaccine() {
  if(validateFields() && currentFile) {
    uploadImage()
  } else if (validateFields()) {
    updateVaccine()
  }
}

function uploadImage() {
  uploadBytes(ref(storage, sourceImg), currentFile)
  .then((response) => {
    updateVaccine()
  })
  .catch((error) => {
    console.log(error)
  })
}

function handleMustShowModal() {
  const modalBkg = document.querySelector("#deleteVaccineModalBkg")
  const modal = document.querySelector("#deleteVaccineModal")
  const modalContainer = document.querySelector("#modalContainer")
  mustShowModal = !mustShowModal
  if(mustShowModal) {
    modalBkg.classList.add('show-modal')
    modal.classList.add('show-modal')
    modalContainer.classList.add('show-modal')
  } else {
    modalBkg.classList.remove('show-modal')
    modal.classList.remove('show-modal')
    modalContainer.classList.remove('show-modal')
  }
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