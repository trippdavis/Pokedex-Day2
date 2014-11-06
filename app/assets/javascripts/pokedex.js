// Comments:
// * Pass in an el. OK
// * I removed comparator.
// * Fix weird rendering bug.
// * Definitely add the form. 
// * Each pokemon has many of Xs. When clicking detail view, show all
//   the Xs. Allow them to click for a detail view of the x.
//     * I think this needs: (1) association method, (2) association collection, (3) parse method.
// * **Maybe as a bonus build some wizard for saving nested collection.**

window.Pokedex = function ($el) {
  this.$el = $el; // II
  this.pokes = new Pokedex.Collections.Pokemon; // I
	this.$pokeList = this.$el.find('.pokemon-list'); // II
	this.$pokeDetail = this.$el.find('.pokemon-detail'); // II
  this.$newPoke = this.$el.find('.new-pokemon'); // II

	this.$pokeList.on('click', 'li', this.selectPokemonFromList.bind(this)); // II
  this.$newPoke.on('submit', this.submitPokemonForm.bind(this)); // II
}

Pokedex.Models = {}; // I
Pokedex.Collections = {}; // I

// create Pokemon Backbone model
//
// #toys function - memoize collection with _toys. return _toys
//   or new Toys collection
//
// #parse function - accepts 'jsonResponse' as argument. Take jsonResponse
//   and check if there is a 'pokemon' key. If so, call #set on our toys collection
//   with the value of the pokemon key. 
Pokedex.Models.Pokemon = Backbone.Model.extend({ // I
	urlRoot: '/pokemon', // I

  parse: function(payload) { // III
    if(payload.toys) {
      this.toys().set(payload.toys),
      delete payload.toys;
    } 
    return payload;
  },

  toys: function() { // III
    if(!this._toys) {
      this._toys = new Pokedex.Collections.Toys([], this);
    }
    return this._toys;
  }
});

// create Pokemon Backbone collection
Pokedex.Collections.Pokemon = Backbone.Collection.extend({
  model: Pokedex.Models.Pokemon, // I
	url: '/pokemon', // I
  comparator: 'number', // bonus?
});

Pokedex.Models.Toy = Backbone.Model.extend({ // III 
  urlRoot: '/toys'
});

Pokedex.Collections.Toys = Backbone.Collection.extend({ // III 
  model: Pokedex.Models.Toy,
  initialize: function(models, pokemon) {
    this.pokemon = pokemon;
  }
});

Pokedex.prototype.createPokemon = function (attrs, callback) { // I
	// instantiate object
	// set attributes
	// save and call callback
	var poke = new Pokedex.Models.Pokemon(attrs);

  // Have an alert pop-up which confirms saving when that is complete.
  // Don't add the new pokemon until it is saved properly.
	var that = this;
  poke.save(attrs, {
    success: function() {
      that.pokes.add(poke)
      callback && callback.call(this, poke);
    }
  });

  return poke;
};

Pokedex.prototype.listPokemon = function (callback) { // I
	// create collection
	// fetch collection
	// print names asynch
  this.pokes.fetch({
  	success: (function () {
  		this.pokes.each(this.renderListItem.bind(this));
      callback && callback();
  	}).bind(this)
  });
  return this.pokes;
};

Pokedex.prototype.renderDetail = function (pokemon) { // II
  // fetch pokemon on renderDetail - this calls the show action on 
  // pokemon controller and delivers @pokemon.toys through jbuilder
  // on success, render toys and append to $pokeDetail
  this.$pokeDetail.empty();
  var that = this;

  pokemon.fetch({ // III
    success: function() {
      var $toys = $('<ul class="toys"></ul>');
      $toys.append('<span style="font-weight: bold;">Toys:</span><br>');
      pokemon.toys().each(function(toy) { // III
        var $li = $('<li class="toy">');
        $li.append("name: " + toy.get('name') + '<br>');
        $li.append("happiness: " + toy.get('happiness') + '<br>');
        $li.append("price: $" + toy.get('price') + '<br>');
        $toys.append($li);
      });
      that.$pokeDetail.append($toys);
    }
  });

	var num = pokemon.get('number');
  
  // num can be string or number depending on whether it came
  // from the server or not #=> convert to str if it's a number
  if(typeof num === 'number') {
    num = "" + num;
  }
	while(num.length < 3) {
    num = '0' + num;
	}

  var $detail = $('<div class="detail">');

	$detail.append('<img src="assets/pokemon_snaps/' + num + '.png"' +
				'style="float:left;"><br>');
	for(var attr in pokemon.attributes) {
		if(pokemon.get(attr) && attr !== 'id') {
			$detail.append('<span style="font-weight:bold;">' + attr + ':</span> ' +
						pokemon.get(attr) + '<br>');
		}
	}

	this.$pokeDetail.html($detail);
};

Pokedex.prototype.renderListItem = function (pokemon) { // II 
	// build LI
	// apped it to $pokeList
	var $li = $('<li class="poke-list-item" data-id=' +
				pokemon.get('id') + '>');
	var shortInfo = ['name', 'number', 'poke_type'];
	shortInfo.forEach(function (attr) {
		$li.append(attr + ': ' + pokemon.get(attr) + '<br>');
	});

	this.$pokeList.append($li);
};

Pokedex.prototype.selectPokemonFromList = function (event) { // II
  var $target = $(event.target);

	var pokeId = $target.data('id');
	var pokemon = this.pokes.get(pokeId);

	this.renderDetail(pokemon);
};

Pokedex.prototype.submitPokemonForm = function(event) { // II
  event.preventDefault();
  var pokeAttrs = $(event.target).serializeJSON()['pokemon'];

  var that = this;
  this.createPokemon(pokeAttrs, function(pokemon) {
    that.renderDetail(pokemon);
    that.renderListItem(pokemon);
  });
};

$(function() {
  var $rootEl = $('#pokedex');

	var pokedex = new Pokedex($rootEl);
  pokedex.listPokemon();
});
