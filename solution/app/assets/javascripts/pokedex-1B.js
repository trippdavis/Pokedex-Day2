Pokedex.RootView.prototype.renderPokemonDetail = function (pokemon) {
  // TODO: move me to Phase 2 or somesuch...
  this.$toyDetail.empty();
  pokemon.fetch({
    success: (function() {
      var $toys = $('<ul class="toys"></ul>');
      $toys.append('<span style="font-weight: bold;">Toys:</span><br>');

      pokemon.toys().each((function(toy) {
        this.addToyToList(toy, $toys);
      }).bind(this));

      this.$pokeDetail.append($toys);
    }).bind(this)
  });

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
};

Pokedex.RootView.prototype.selectPokemonFromList = function (event) {
  var $target = $(event.target);

  var pokeId = $target.data('id');
  var pokemon = this.pokes.get(pokeId);

  this.renderPokemonDetail(pokemon);
};
