Pokedex.Views = (Pokedex.Views || {});

Pokedex.Views.PokemonForm = Backbone.View.extend({
  events: {
    "submit form" : "savePokemon"
  },

  render: function () {
    var html = JST["pokemonForm"]();
    this.$el.html(html);

  },

  savePokemon: function (event) {
    event.preventDefault();
    var $currentTarget = $(event.currentTarget);
    var data = $currentTarget.serializeJSON();
    this.model.save(data.pokemon, {
      success: function () {
          this.collection.add(this.model);
          Backbone.history.navigate("/pokemon/" + this.model.id, {trigger:true});
        }.bind(this)
    });
  }
});
