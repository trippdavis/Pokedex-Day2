# Pokedex: Templates, Views and Routing!

## Phase 4: Templates

We've mixed our HTML code very heavily into our JavaScript; our
`Pokedex.RootView` methods use jQuery to build all the HTML of the
page.

This is not very nice; it's really hard for us to read the code and
know that it is generating the right HTML. It also makes it hard to
see what the `Pokedex.RootView` is doing, because we have to look past
a bunch of spaghetti logic to build HTML.

The traditional solution is to use *client-side templates*. What Rails
calls a *view* (`index.html.erb`, `index.json.jbuilder`) is more
properly called a *template*. We will start out this project building
templates. The big difference is that these templates **will not be
evaluated by the server**, but instead be used by the client to
generate HTML.

Let's start by writing the `pokemon-detail-template` in
`app/views/shared/_templates"`. In this file are a series of script
tags; your template code will go here.

Write an EJS template to display a single Pokemon, mimicing the parts
of `renderPokemonDetail` function that display the Pokemon (but not
the list of toys yet!). Render the partial in the `root.html.erb` so
that these script tags are included in the HTML served by the
server. Remember to use `<%%= ... %>` in your template, so that Rails
doesn't try to interpret it.

When you have written this, check that the following code works:

```javascript
var templateCode = $("#pokemon-detail-template").html();
var templateFn = _.template(templateCode);

var pokemon = new Pokedex.Models.Pokemon({ id: 1 });
pokemon.fetch({
  success: function () {
    console.log(templateFn({ pokemon: pokemon }));
  }
});
```

When this seems to be producing valid HTML, edit `pokedex-4.js` to
Load the template and compile it, saving the template function as
`JST["pokemonDetail"]`.

Last, modify your `renderPokemonDetail` to use
`JST["pokemonDetail"]`. You'll still have jQuery code for building the
list of toys, but this should reduce the amount of jQuery code. Verify
that this works correctly as before.

## Phase 4B: More Templates!

Just as you wrote `#pokemon-detail-template`, write the following
templates, along the way changing the relevant method to use the
template:

* `pokemon-list-item-template`, `addPokemonToList`
* Extend your `pokemon-detail-template` to hold an empty
  `ul.toys`. Then write `toy-list-item-teplate` and update
  `addToyToList`.
* `toy-detail-template`, `renderToyDetail`
    * Write the `select` tag! You'll want to pass `this.pokes` into
      the template so it can iterate through the pokemons and make an
      `option` for each.
