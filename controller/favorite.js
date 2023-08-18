dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(event.target.dataset.id);
  } else if (event.target.matches(".btn-delete-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id));
  }
});
renderMovieCard(favoriteList);
