const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIES_PER_PAGE = 12;
const movies = [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator");
const displayMode = document.querySelector("#display-mode");
const favoriteList = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
let filteredMovies = [];
const DISPLAY_MODE = {
  CardMode: "CardMode",
  ListMode: "ListMode",
};
let currentMode = DISPLAY_MODE.CardMode;

function renderMovieCard(data) {
  let rawHTML = "";

  //processing
  data.forEach((item) => {
    //title, image
    rawHTML += `
    <div class="col-sm-3">
          <div class="mb-2">
            <div class="card">
              <img
                src="${POSTER_URL + item.image}"
                class="card-img-top"
                alt="Movie Poster" />
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
              </div>
              <div class="card-footer text-body-secondary">
                <button
                  class="btn btn-primary btn-show-movie"
                  data-bs-toggle="modal"
                  data-bs-target="#movie-modal"
                  data-id="${item.id}">
                  More
                </button>
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
    `;
  });

  dataPanel.innerHTML = rawHTML;
}

function renderMovieList(data) {
  let rawHTML = "";
  rawHTML += `<ul class="list-group">`;
  //processing
  data.forEach((item) => {
    //title, id
    rawHTML += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            ${item.title}
            <div>
              <button
                class="btn btn-primary btn-show-movie"
                data-bs-toggle="modal"
                data-bs-target="#movie-modal"
                data-id="${item.id}">
                More
              </button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </li>
    `;
  });
  rawHTML += `</ul>`;
  dataPanel.innerHTML = rawHTML;
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE);
  let rawHTML = "";
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

function getMoviesByPage(page) {
  // page 1 -> movies 0 - 11
  // page 2 -> movies 12 - 23
  // page 3 -> movies 24 - 35
  // ...
  const data = filteredMovies.length ? filteredMovies : movies;
  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE);
}
function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title");
  const modalImage = document.querySelector("#movie-modal-image");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;
    modalTitle.innerText = data.title;
    modalDate.innerText = "Release Date: " + data.release_date;
    modalDescription.innerText = data.description;
    modalImage.innerHTML = `<img
        src="${POSTER_URL + data.image}"
        class="img-fluid"
        alt="Movie Poster" />`;
  });
}

function addToFavorite(id) {
  //   console.log(id); //To check whether get the id correctly
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find((movie) => movie.id === id);
  if (list.some((movie) => movie.id === id)) {
    return alert("This film has colleted in the favorite library.");
  }
  list.push(movie);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

function removeFromFavorite(id) {
  // const targetMovie = favoriteList.find((item) => item.id === id);
  // const targetIndex = favoriteList.indexOf(targetMovie);
  if (!favoriteList || !favoriteList.length) return;

  // find index through id to remove the movie
  const targetIndex = favoriteList.findIndex((item) => item.id === id);
  if (targetIndex === -1) return;

  //remove the target movie
  favoriteList.splice(targetIndex, 1);
  //store the information back to local storage
  localStorage.setItem("favoriteMovies", JSON.stringify(favoriteList));
  //refresh page
  renderMovieCard(favoriteList);
}
