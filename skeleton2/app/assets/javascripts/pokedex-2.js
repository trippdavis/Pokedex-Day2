Pokedex.RootView.prototype.addToyToList = function (toy) {
  var html = JST["toyListItem"]({toy: toy});
  this.$pokeDetail.find(".toys").append(html);
};

Pokedex.RootView.prototype.renderToyDetail = function (toy) { // III
  this.$toyDetail.empty();
  var html = JST["toyDetail"]({toy:toy, pokes: this.pokes})

  this.$toyDetail.html(html);
};

Pokedex.RootView.prototype.selectToyFromList = function (event) {
  var $target = $(event.currentTarget);

  var toyId = $target.data('id');
  var pokemonId = $target.data('pokemon-id');

  var pokemon = this.pokes.get(pokemonId);
  var toy = pokemon.toys().get(toyId);

  this.renderToyDetail(toy);
};
