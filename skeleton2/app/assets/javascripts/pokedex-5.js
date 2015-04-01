Pokedex.Views = {}

Pokedex.Views.PokemonIndex = Backbone.View.extend({
  events: {
    "click li" : "selectPokemonFromList"
  },

  initialize: function () {
    this.collection = new Pokedex.Collections.Pokemon();
  },

  addPokemonToList: function (pokemon) {
    var html = JST["pokemonListItem"]({pokemon: pokemon});
    this.$el.append(html);
  },

  refreshPokemon: function (options) {
    this.collection.fetch({
      success: function () {
        this.render();
        if (options.success) {
          options.success();
        }
      }.bind(this)
    })
  },

  render: function () {
    this.$el.empty();
    this.collection.forEach(function(pokemon) {
      this.addPokemonToList(pokemon);
    }.bind(this));
  },

  selectPokemonFromList: function (event) {
    var $target = $(event.currentTarget);
    var pokeId = $target.data('id');
    $(".toy-detail").empty();
    Backbone.history.navigate("/pokemon/" + pokeId, { trigger: true});

  }
});

Pokedex.Views.PokemonDetail = Backbone.View.extend({
  events: {
    "click .toys li": "selectToyFromList",
    "submit .new-toy": "createNewToy"
  },

  refreshPokemon: function (options) {
    this.model.fetch({
      success: function () {
        this.render();
        if (options.success){
          options.success()
        }
      }.bind(this)
    });
  },

  render: function () {
    var templateFn = JST["pokemonDetail"];
    var $html = $(templateFn({pokemon: this.model}));
    this.model.toys().each(function(toy) {
      var toyHtml = JST["toyListItem"]({toy: toy});
      $html.find(".toys").append(toyHtml);
    });

    this.$el.html($html);
  },

  selectToyFromList: function (event) {
    var $target = $(event.currentTarget);
    var toyId = $target.data('id');
    var pokemonId = $target.data('pokemon-id');

    Backbone.history.navigate("pokemon/" + pokemonId + "/toys/" + toyId, {trigger:true});

    // var toy = this.model.toys().get(toyId);
    //
    // var toyDetail = new Pokedex.Views.ToyDetail({model: toy});
    // $("#pokedex .toy-detail").html(toyDetail.$el);
    // toyDetail.render();
  },

  createNewToy: function (event) {
    event.preventDefault();
    var data = $(event.currentTarget).serializeJSON();
    var pokemon = new Pokedex.Models.Pokemon(data.toy['pokemon_id']);
    debugger
    pokemon.fetch({
      success: function () {
        var newToy = new Pokedex.Models.Toy(data.toy);
        newToy.save({}, {
          success: function () {
            debugger
            pokemon.toys().add(newToy);
            Backbone.history.navigate("pokemon/" + pokemon.id + "/toys/" + newToy.id);
          }
        });
      }
    });


  }
});

Pokedex.Views.ToyDetail = Backbone.View.extend({
  events: {
    "change select": "reassignToy"
  },

  render: function () {
    var html = JST["toyDetail"]({toy: this.model, pokes: this.collection});
    this.$el.append(html);
  },

  reassignToy: function (event) {
    var $currentTarget = $(event.currentTarget);
    var oldPokemon = this.collection.get($currentTarget.data('pokemon-id'));
    var toy = oldPokemon.toys().get($currentTarget.data('toy-id'));
    toy.set('pokemon_id', $currentTarget.val());
    toy.save({}, {
      success: function () {
        oldPokemon.toys().remove(toy);
        Backbone.history.navigate("pokemon/" + $currentTarget.val(), {trigger:true});
      }.bind(this)
    });

  }
});


// $(function () {
//   var pokemonIndex = new Pokedex.Views.PokemonIndex();
//   pokemonIndex.refreshPokemon();
//   $("#pokedex .pokemon-list").html(pokemonIndex.$el);
// });
