Pokedex.RootView.prototype.renderPokemonDetail = function (pokemon) {
  var $detail = $('<div class="detail">');
  // Show the image
  $detail.append('<img src="' + pokemon.get('image_url') + '"><br>');
  // Show the attributes
  for (var attr in pokemon.attributes) {
    if (pokemon.get(attr) && attr !== 'id' && attr !== 'image_url') {
      $detail.append('<span style="font-weight:bold;">' + attr + ':</span> ' +
            pokemon.get(attr) + '<br>');
    }
  }
  this.$pokeDetail.html($detail);

  // Phase 2C.
  var $toys = $('<ul class="toys"></ul>');
  $toys.append('<span style="font-weight: bold;">Toys:</span><br>');
  this.$pokeDetail.append($toys);

  pokemon.fetch({
    success: (function() {
      pokemon.toys().each((function(toy) {
        this.addToyToList(toy);
      }).bind(this));
    }).bind(this)
  });
};

Pokedex.RootView.prototype.selectPokemonFromList = function (event) {
  var $target = $(event.target);

  var pokeId = $target.data('id');
  var pokemon = this.pokes.get(pokeId);

  this.renderPokemonDetail(pokemon);
};
