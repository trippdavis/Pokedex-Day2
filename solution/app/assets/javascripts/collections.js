window.Pokedex = (window.Pokedex || {});
window.Pokedex.Collections = {}; // I

// create Pokemon Backbone collection
Pokedex.Collections.Pokemon = Backbone.Collection.extend({
  model: Pokedex.Models.Pokemon, // I
  url: '/pokemon' // I
});

Pokedex.Collections.PokemonToys = Backbone.Collection.extend({ // III
  model: Pokedex.Models.Toy,
  initialize: function(models, pokemon) {
    this.pokemon = pokemon;
  }

  // url: function () {
  //   return this.pokemon.url() + "/toys";
  // }
});
