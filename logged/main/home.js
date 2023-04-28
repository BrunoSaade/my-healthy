
import { auth } from '../../service/firebase/firebase.js'
import {query, collection, onSnapshot} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
import { db } from '../../service/firebase/firebase.js'
import { formatDoseName, formatDateEnToBr } from '../../service/mixins/mixins.js'

document.getElementById('addVaccineBtn').addEventListener('click', handleAddVaccine)

let vaccines = []

auth.onAuthStateChanged((user) => {
  getVaccines()
})

function handleAddVaccine() {
  window.location.href = "/logged/addVaccine/"
}

document.getElementById("search").addEventListener('input', () => {
  const searchString = document.getElementById("search").value.trim()
  fillCard(vaccines.filter(vaccine => vaccine.title.toUpperCase().includes(searchString.toUpperCase())))
})

function getVaccines() {
  let uid = auth.currentUser.uid
  const queryVaccines = query(collection(db, "users/" + uid + "/vaccines" ))
  onSnapshot(queryVaccines, (response) => {
    response.forEach((document) => {
      vaccines.push({
        title: document.data().name,
        info: document.data().dose,
        date: document.data().vaccinationDate,
        img: document.data().vaccinationImg,
        observation: document.data().nextVaccinationDate,
        id: document.id,
      })
      fillCard(vaccines)
    })
  })
}

function fillCard(vaccines) {
  document.getElementById("cards").innerHTML = ""
  vaccines.forEach((vaccine) => {
    createNrenderCard(
      vaccine.title, 
      formatDoseName(vaccine.info), 
      formatDateEnToBr(vaccine.date), 
      vaccine.img, 
      vaccine.observation, 
      vaccine.id
    )
  })
}

function createNrenderCard(title, info, date, img, observation, id) {

  const cardDiv = document.createElement("div");
  cardDiv.setAttribute("id", id)
  cardDiv.classList.add("section-main--card");

  const cardTitleElement = document.createElement("h1");
  cardTitleElement.classList.add("section-main--card-title");
  cardTitleElement.textContent = title;

  const cardInfoElement = document.createElement("p");
  cardInfoElement.classList.add("section-main--card-info");
  cardInfoElement.textContent = info;

  const cardDateElement = document.createElement("p");
  cardDateElement.classList.add("section-main--card-date");
  cardDateElement.textContent = date;

  const imgElement = document.createElement("img");
  imgElement.classList.add("section-main--card-img");
  imgElement.setAttribute("src", img);
  imgElement.setAttribute("alt", "Vacina imagem");

  const cardObservationElement = document.createElement("p");
  cardObservationElement.classList.add("section-main--card-observation");
  cardObservationElement.textContent = 
    observation === "" ? 
    "Não há próxima dose" :
    `Próxima dose em ${formatDateEnToBr(observation)}`;

  cardDiv.appendChild(cardTitleElement);
  cardDiv.appendChild(cardInfoElement);
  cardDiv.appendChild(cardDateElement);
  cardDiv.appendChild(imgElement);
  cardDiv.appendChild(cardObservationElement);

  cardDiv.addEventListener('click', () => {
    window.location.href = "/logged/editVaccine/?id=" + id
  })

  const divCards = document.getElementById("cards");
  divCards.appendChild(cardDiv);
}


  