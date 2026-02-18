const detailsDiv = document.getElementById("details");
const api = "https://api.tvmaze.com/shows/";

// Gaunu prieiga prie narsykles dabartines nuorodos
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

function getMovieDetails() {
  fetch(`${api}${movieId}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      detailsDiv.innerHTML = `
      <div>
        <h1>${data.name}</h1>
        ${data.image ? `<img src="${data.image.original}" alt="photo">` : ""}
        </div>
        <div class="details-txt">
        <p><strong>Rating:</strong> ${data.rating.average ?? "No rating"}</p>
        <p>${data.summary}</p>
        </div>
        `;
    })
    .catch((error) => {
      console.log(error);
    });
}

getMovieDetails();

const movieCastApi = `https://api.tvmaze.com/shows/${movieId}/cast`;
const castContainer = document.getElementById("cast-container");

function getCastDetails() {
  fetch(movieCastApi)
    .then((response) => {
      return response.json();
    })
    .then((cast) => {
      console.log(cast);
      renderCast(cast);
    })
    .catch((error) => {
      console.log(error);
    });
}

getCastDetails();

function renderCast(cast) {
  cast.forEach((actor) => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
<img src="${actor.person.image.medium}" alt="Actors photo"> 
<h3>${actor.person.name}</h3> 
<p>as ${actor.character.name}</p>
        `;
    castContainer.appendChild(div);
  });
}
