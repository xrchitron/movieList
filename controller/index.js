dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

searchForm.addEventListener("input", function onSearchFormInput(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyword));
  //Mode Checking
  if (currentMode === DISPLAY_MODE.CardMode) {
    renderMovieCard(getMoviesByPage(1));
  } else {
    renderMovieList(getMoviesByPage(1));
  }
  renderPaginator(filteredMovies.length);
});

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  if (!keyword.length) {
    return alert("please input a valid keyword.");
  }
  filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyword));
  if (filteredMovies.length === 0) {
    return alert(`There is no content matching "${keyword}".`);
  }
  //Mode Checking
  if (currentMode === DISPLAY_MODE.CardMode) {
    renderMovieCard(getMoviesByPage(1));
  } else {
    renderMovieList(getMoviesByPage(1));
  }
  renderPaginator(filteredMovies.length);
});

paginator.addEventListener("click", function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return;
  const page = Number(event.target.dataset.page);
  //Mode Checking
  if (currentMode === DISPLAY_MODE.CardMode) {
    renderMovieCard(getMoviesByPage(page));
  } else {
    renderMovieList(getMoviesByPage(page));
  }
});

displayMode.addEventListener("click", function onDisplayModeClicked(event) {
  console.log("clicked");
  console.log(event.target.classList);
  if (event.target.classList.contains("fa-grip")) {
    //switch to CardMode
    currentMode = DISPLAY_MODE.CardMode;
    renderMovieCard(getMoviesByPage(1));
  } else if (event.target.classList.contains("fa-bars")) {
    //switch to ListMode
    currentMode = DISPLAY_MODE.ListMode;
    renderMovieList(getMoviesByPage(1));
  }
});

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results);
    renderPaginator(movies.length);
    renderMovieCard(getMoviesByPage(1));
  })
  .catch((error) => {
    console.log(error);
  });
