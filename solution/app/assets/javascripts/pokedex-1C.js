Pokedex.RootView.prototype.createPokemon = function (attrs, callback) { // I
  // instantiate object
  // set attributes
  // save and call callback
  var pokemon = new Pokedex.Models.Pokemon(attrs);

  // Have an alert pop-up which confirms saving when that is complete.
  // Don't add the new pokemon until it is saved properly.
  pokemon.save(attrs, {
    success: (function() {
      this.pokes.add(pokemon);
      this.addPokemonToList(pokemon);
      callback && callback.call(this, pokemon);
    }).bind(this)
  });

  return pokemon;
};

Pokedex.RootView.prototype.submitPokemonForm = function (event) { // II
  event.preventDefault();
  var pokeAttrs = ($(event.target).serializeJSON())['pokemon'];

  this.createPokemon(pokeAttrs, this.renderPokemonDetail.bind(this));
};
