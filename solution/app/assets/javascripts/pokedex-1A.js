Pokedex.RootView.prototype.addPokemonToList = function (pokemon) { // II
  // build LI
  // apped it to $pokeList
  var $li = $('<li class="poke-list-item">');
  $li.data('id', pokemon.get('id'));

  var shortInfo = ['name', 'poke_type'];
  shortInfo.forEach(function (attr) {
    $li.append(attr + ': ' + pokemon.get(attr) + '<br>');
  });

  this.$pokeList.append($li);
};

Pokedex.RootView.prototype.refreshPokemon = function (callback) { // I
  // fetch collection
  // print names async
  this.pokes.fetch({
    success: (function () {
      this.pokes.each(this.addPokemonToList.bind(this));
      callback && callback();
    }).bind(this)
  });
  return this.pokes;
};
