// Comments:
// * Pass in an el. OK
// * I removed comparator.
// * Fix weird rendering bug.
// * Definitely add the form.
// * Each pokemon has many of Xs. When clicking detail view, show all
//   the Xs. Allow them to click for a detail view of the x.
//     * I think this needs: (1) association method, (2) association collection, (3) parse method.
// * **Maybe as a bonus build some wizard for saving nested collection.**

window.Pokedex.RootView = function ($el) {
  this.$el = $el; // II
  this.pokes = new Pokedex.Collections.Pokemon(); // I
	this.$pokeList = this.$el.find('.pokemon-list'); // II
	this.$pokeDetail = this.$el.find('.pokemon-detail'); // II
  this.$newPoke = this.$el.find('.new-pokemon'); // II
  this.$toyDetail = this.$el.find('.toy-detail'); // III

	this.$pokeList.on('click', 'li', this.selectPokemonFromList.bind(this)); // II
  this.$newPoke.on('submit', this.submitPokemonForm.bind(this)); // II
  this.$pokeDetail.on('click', 'li', this.selectToyFromList.bind(this)); // III

  // TODO: Not sure we'll want this.
  // this.pokes.on('change', this.addAllPokemonToList.bind(this));
};

// TODO: I might remove this.
Pokedex.RootView.prototype.addAllPokemonToList = function () {
  this.$pokeList.empty();
  var that = this;
  this.pokes.each(function(poke) {
    that.addPokemonToList(poke);
  });
};

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

// TODO
Pokedex.RootView.prototype.createToy = function (attrs, callback) { // III

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

Pokedex.RootView.prototype.renderToyDetail = function (toy) { // III
  this.$toyDetail.empty();

  var $detail = $('<div class="detail">');
  $detail.append('<img src="' + toy.get('image_url') + '"><br>');
  for (var attr in toy.attributes) {
    if(attr !== 'pokemon_id' && attr !== 'image_url') {
      var $span = $('<span style="font-weight:bold;">');
      $span.html(attr + ': ');
      $detail.append($span);
      $detail.append(toy.get(attr));
      $detail.append('<br>');
    }
  }

  this.$toyDetail.html($detail);
};

// TODO
Pokedex.RootView.prototype.renderToyForm = function ($list) {
  var $li = $('<li class="toy-list-item">');
  var $form = $('<form>');
  ['name', 'price', 'happiness'].forEach(function(el) {

  });
};

Pokedex.RootView.prototype.renderToyListItem = function (toy, $list) { // III
  var $li = $('<li class="toy-list-item">');
  $li.data('id', toy.get('id'));
  $li.data('pokemon-id', toy.get('pokemon_id'));

  var shortInfo = ['name', 'happiness', 'price'];
  shortInfo.forEach(function (attr) {
    $li.append(attr + ': ' + toy.get(attr) + '<br>');
  });

  $list.append($li);
};

Pokedex.RootView.prototype.selectPokemonFromList = function (event) { // II
  var $target = $(event.target);

	var pokeId = $target.data('id');
	var pokemon = this.pokes.get(pokeId);

	this.renderPokemonDetail(pokemon);
};

Pokedex.RootView.prototype.selectToyFromList = function (event) { // III
  var $target = $(event.target);

	var toyId = $target.data('id');
  var pokemonId = $target.data('pokemon-id');

	var pokemon = this.pokes.get(pokemonId);
  var toy = pokemon.toys().get(toyId);

  this.renderToyDetail(toy);
};

Pokedex.RootView.prototype.submitPokemonForm = function (event) { // II
  event.preventDefault();
  var pokeAttrs = ($(event.target).serializeJSON())['pokemon'];

  this.createPokemon(pokeAttrs, (function (pokemon) {
    this.renderPokemonDetail(pokemon);
    this.addPokemonToList(pokemon);
  }).bind(this));
};

// TODO
Pokedex.RootView.prototype.submitToyForm = function (event) {
  event.preventDefault();
  var toyAttrs = $(event.target).serializeJSON()['toy'];

  var that = this;
  this.createToy(toyAttrs, function (toy) {
    that.renderToyDetail(toy);
    that.renderToyListItem(toy);
  });
};

$(function() {
  var $rootEl = $('#pokedex');
	var pokedex = new Pokedex.RootView($rootEl);
  pokedex.refreshPokemon();
});
