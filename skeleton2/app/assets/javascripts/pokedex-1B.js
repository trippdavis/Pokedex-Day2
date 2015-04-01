Pokedex.RootView.prototype.renderPokemonDetail = function (pokemon) {
  var templateFn = JST["pokemonDetail"]
  var html = templateFn({pokemon: pokemon})
  this.$pokeDetail.html(html);
  // Phase 2C.

  pokemon.fetch({
    success: (function() {
      this.renderToysList(pokemon.toys());
    }).bind(this)
  });
};

Pokedex.RootView.prototype.selectPokemonFromList = function (event) {
  // Phase II
  this.$toyDetail.empty();

  // Phase IB
  var $target = $(event.currentTarget);

  var pokeId = $target.data('id');
  var pokemon = this.pokes.get(pokeId);

  this.renderPokemonDetail(pokemon);
};
