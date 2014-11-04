window.Pokedex = function() {
  this.pokes = new Pokedex.Collections.Pokemon;
	this.$pokeList = $('.poke-list');
	this.$pokeDetail = $('.poke-detail');
	
	this.$pokeList.on('click', 'li', this.showDetail.bind(this));	
}

Pokedex.Models = {};
Pokedex.Collections = {};

// create Pokemon Backbone model
Pokedex.Models.Pokemon = Backbone.Model.extend({
	urlRoot: '/pokemon'
});

// create Pokemon Backbone collection
Pokedex.Collections.Pokemon = Backbone.Collection.extend({
  model: Pokedex.Models.Pokemon,
	url: '/pokemon',
	comparator: 'number'
});

Pokedex.prototype.listPokemon = function (pokes, callback) {
	// create collection
	// fetch collection
	// print names asynch
  this.pokes = pokes || this.pokes || new Pokedex.Collections.Pokemon();
  var that = this;
  this.pokes.fetch({
  	success: function() {
  		that.pokes.each(function(poke) {
  			that.renderListItem(poke);
        callback && callback();
  		});
  	}
  });
  return this.pokes;
}

Pokedex.prototype.renderListItem = function (pokemon) {
	// build LI
	// apped it to $pokeList
	var $li = $('<li class="poke-list-item" data-id=' + 
				pokemon.get('id') + '>');
	var shortInfo = ['name', 'number', 'poke_type'];
	shortInfo.forEach(function(attr) {
		$li.append(attr + ': ' + pokemon.get(attr) + '<br>');
	});

	this.$pokeList.append($li);
}

Pokedex.prototype.createPokemon = function (attrs, callback) {
	// instantiate object
	// set attributes
	// save and call callback
	var poke = new Pokedex.Models.Pokemon(attrs);
	poke.save();

  this.pokes = this.pokes || new Pokedex.Collections.Pokemon();
	this.pokes.add(poke);
	callback && callback.call(this, poke);
  // then use this.pokes.create({
  // success: callback
  // })
  return poke;
}

Pokedex.prototype.renderDetail = function (pokemon) {
	var num = JSON.stringify(pokemon.get('number'));
	while(num.length < 3) {
    num = '0' + num;
	}
	var string = '<img src="assets/pokemon_snaps/' + num + '.png"' + 
				'style="float:left;"><br>';
	for(var attr in pokemon.attributes) {
		if(pokemon.get(attr) && attr !== 'id') {
			string += '<span style="font-weight:bold;">' + attr + ':</span> ' + 
						pokemon.get(attr) + '<br>';
		}
	}

	this.$pokeDetail.html(string);
}

Pokedex.prototype.showDetail = function (event) {
  var $target = $(event.target);

	var pokeId = $target.data('id');
	var pokemon = this.pokes.get(pokeId);

	this.renderDetail(pokemon);
}

$(function() {
	pokedex = new Pokedex;
  pokedex.listPokemon();
});
