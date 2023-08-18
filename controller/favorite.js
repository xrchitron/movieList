const BASE_URL = "https://webdev.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/movies/";
const POSTER_URL = BASE_URL + "/posters/";
// const movies = [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const favoriteList = JSON.parse(localStorage.getItem("favoriteMovies")) || [];

//Contents to be added into HTML
function renderMovieList(data) {
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
                <button class="btn btn-danger btn-delete-favorite" data-id="${item.id}">
                  X
                </button>
              </div>
            </div>
          </div>
        </div>
    `;
  });

  dataPanel.innerHTML = rawHTML;
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
  renderMovieList(favoriteList);
}
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-delete-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id));
  }
});
renderMovieList(favoriteList);
