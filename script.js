const searchInput = document.getElementById("search-input");
const resultsDiv = document.getElementById("results");
const statusTxt = document.getElementById("status");

const heroSection = document.getElementById("hero");

// API - paprasta nuoroda i serverius kurie grazina informacija
const allShowsApi = "https://api.tvmaze.com/shows";
const searchShows = "https://api.tvmaze.com/search/shows?q=";

// .then suveiks tik tuo atveju jeigu pavyks
function getAllShows() {
  // kai pradedama funkcija
  statusTxt.textContent = "Loading movies....";

  fetch(allShowsApi)
    //   Apsirasome resolve
    .then((response) => {
      // .json irgi yra Promise (pazadu kad paversiu atsakyma json pavidalu)
      return response.json();
    })
    .then((data) => {
      console.log(data);
      statusTxt.textContent = `Loaded ${data.length} movies`;
      // data- jau is response paverstas i normalu json pavidala informacija, ateis INFO is JSON!!!!!
      // einu per masyva duomenu ir sukuriu korteles

      renderMovies(data);

      allShows = data;
      getGenres();
    }) // end of resolve
    // reject
    .catch((error) => {
      console.log(error);
      statusTxt.textContent = "An error occurred";
    });
  // end of reject
}

// ant puslapio uzkrovimo paleis sita funkcija
getAllShows();

searchInput.addEventListener("input", () => {
  const value = searchInput.value;

  if (value.length >= 2) {
    heroSection.classList.add("hidden");
    searchShowsByName(value);
  } else if (value.length === 0) {
    heroSection.classList.remove("hidden");
    getAllShows();
    resultsDiv.innerHTML = "";
  }
});

function searchShowsByName(value) {
  statusTxt.textContent = "Loading...";
  resultsDiv.innerHTML = "";

  fetch(`${searchShows}${value}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const movies = data.map((item) => item.show);
      statusTxt.textContent = `Found ${movies.length} movies`;

      renderMovies(movies);
    });
}

function renderMovies(movies) {
  resultsDiv.innerHTML = "";
  movies.forEach((movie) => {
    const div = document.createElement("div");
    div.className = "card";
    const rating = movie.rating?.average ?? "No rating available";
    const image = movie.image?.medium ?? "";

    div.innerHTML = `
        ${image ? `<img src="${image}" alt="photo">` : ""}
        <h3>${movie.name}</h3>
        <h3><i class="bi bi-star-fill"></i> (${rating})</h3>
        `;

    div.addEventListener("click", () => {
      // leidzia smogu nukreipti i kita arba vidini puslapi
      // indikacija, ant kurio filmo paspaudziam
      window.location.href = `details.html?id=${movie.id}`;
    });

    resultsDiv.appendChild(div);
  });
}

// GENRES LOGIC

const genresBox = document.getElementById("genres-select");

let allShows = [];

function getGenres() {
  let genres = [];

  allShows.forEach((show) => {
    show.genres.forEach((genre) => {
      genres.push(genre);
    });
  });

  const uniqueGenres = [...new Set(genres)];
  console.log(uniqueGenres);

  genresBox.innerHTML = "";

  const select = document.createElement("select");
  select.className = "genres-select";

  let options = `<option value="">All genres</option>`;

  uniqueGenres.forEach((genre) => {
    options += `<option value="${genre}">${genre}</option>`;
  });

  select.innerHTML = options;
  genresBox.appendChild(select);

  // Rendering cards by selected genre

  select.addEventListener("change", (event) => {
    const selectedGenre = event.target.value;
    let filtered = [];
    if (selectedGenre === "") {
      filtered = allShows;
    } else {
      filtered = allShows.filter((show) => {
        return show.genres.includes(selectedGenre);
      });
    }
    renderMovies(filtered);
  });
}
