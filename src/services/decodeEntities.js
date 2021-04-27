export default function decodeEntities(encodedString) {
  const txt = document.createElement("textarea");
  txt.innerHTML = encodedString;
  return txt.value;
}

// Function created by Rafael Quinteiro (Trybe - T5).
