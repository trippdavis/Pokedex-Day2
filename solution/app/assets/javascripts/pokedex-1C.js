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

Pokedex.RootView.prototype.submitPokemonForm = function (event) { // II
  event.preventDefault();
  var pokeAttrs = ($(event.target).serializeJSON())['pokemon'];

  this.createPokemon(pokeAttrs, (function (pokemon) {
    this.renderPokemonDetail(pokemon);
    this.addPokemonToList(pokemon);
  }).bind(this));
};
