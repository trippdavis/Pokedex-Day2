Pokedex.RootView.prototype.renderPokemonDetail = function (pokemon) { // II
  // fetch pokemon on renderPokemonDetail - this calls the show action on
  // pokemon controller and delivers @pokemon.toys through jbuilder
  // on success, render toys and append to $pokeDetail
  this.$pokeDetail.empty();
  this.$toyDetail.empty();

  pokemon.fetch({ // III
    success: (function() {
      var $toys = $('<ul class="toys"></ul>');
      $toys.append('<span style="font-weight: bold;">Toys:</span><br>');

      pokemon.toys().each((function(toy) { // III
        this.renderToyListItem(toy, $toys);
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

Pokedex.RootView.prototype.selectPokemonFromList = function (event) { // II
  var $target = $(event.target);

  var pokeId = $target.data('id');
  var pokemon = this.pokes.get(pokeId);

  this.renderPokemonDetail(pokemon);
};
