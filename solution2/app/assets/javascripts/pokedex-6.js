Pokedex.Router = Backbone.Router.extend({
  routes: {
    "": "pokemonIndex",
    "pokemon/:id": "pokemonDetail"
  },

  pokemonDetail: function (id) {
    if (!this._pokemonIndex) {
      this.pokemonIndex((function () {
        this.pokemonDetail(id);
      }).bind(this));
      return;
    }

    var pokemon = this._pokemonIndex.collection.get(id);

    var pokemonDetail =
        new Pokedex.Views.PokemonDetail({ model: pokemon });
    $("#pokedex .pokemon-detail").html(pokemonDetail.$el);
    pokemonDetail.refreshPokemon();
  },

  pokemonIndex: function (callback) {
    this._pokemonIndex = new Pokedex.Views.PokemonIndex()
    $("#pokedex .pokemon-list").html(this._pokemonIndex.$el);
    this._pokemonIndex.refreshPokemon({
      success: callback
    });
  }
});

$(function () {
  new Pokedex.Router();
  Backbone.history.start();
});
