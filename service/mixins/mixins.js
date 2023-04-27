export function formatDoseName(dose) {
  if(dose === "firstDose") {
    return "1a. dose"
  }
  if(dose === "secondDose") {
    return "2a. dose"
  }
  if(dose === "thirdDose") {
    return "3a. dose"
  }
  if(dose === "reinforcement") {
    return "Reforço"
  }
  if(dose === "onceDose") {
    return "Dose única"
  }
}

export function formatDateEnToBr(date) {
  return date.split('-').reverse().join('/');
}