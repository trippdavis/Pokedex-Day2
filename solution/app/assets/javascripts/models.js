window.Pokedex = (window.Pokedex || {});
Pokedex.Models = {}; // I

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

  parse: function (payload) { // III
    if (payload.toys) {
      this.toys().set(payload.toys),
      delete payload.toys;
    }
    return payload;
  },

  toys: function () { // III
    if (!this._toys) {
      this._toys = new Pokedex.Collections.PokemonToys([], this);
    }
    return this._toys;
  }
});

Pokedex.Models.Toy = Backbone.Model.extend({ // III
  urlRoot: '/toys'
});
