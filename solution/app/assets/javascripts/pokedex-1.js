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

Pokedex.RootView.prototype.createPokemon = function (attrs, callback) { // I
  // instantiate object
  // set attributes
  // save and call callback
  var poke = new Pokedex.Models.Pokemon(attrs);

  // Have an alert pop-up which confirms saving when that is complete.
  // Don't add the new pokemon until it is saved properly.
  poke.save(attrs, {
    success: (function() {
      this.pokes.add(poke)
      callback && callback.call(this, poke);
    }).bind(this)
  });

  return poke;
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

Pokedex.RootView.prototype.submitPokemonForm = function (event) { // II
  event.preventDefault();
  var pokeAttrs = ($(event.target).serializeJSON())['pokemon'];

  this.createPokemon(pokeAttrs, (function (pokemon) {
    this.renderPokemonDetail(pokemon);
    this.addPokemonToList(pokemon);
  }).bind(this));
};
