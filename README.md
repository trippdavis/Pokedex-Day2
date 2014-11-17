# w7d1 Backbone Pokedex

**Gotta Fetch 'em All**

In this project, we'll write an app to manage your `Pokemon` and their
`Toy`s. We've already setup migrations/models/controllers for you to
start with. **Set things up with `rake db:create db:migrate
db:seed`**.

Here's the schema:

```ruby
ActiveRecord::Schema.define(version: 20141105185704) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "pokemons", force: true do |t|
    t.string   "name",       null: false
    t.integer  "attack",     null: false
    t.integer  "defense",    null: false
    t.string   "poke_type",  null: false
    t.string   "moves",      null: false
    t.string   "image_url",  null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "toys", force: true do |t|
    t.integer  "pokemon_id", null: false
    t.string   "name",       null: false
    t.integer  "price",      null: false
    t.integer  "happiness",  null: false
    t.string   "image_url",  null: false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "toys", ["pokemon_id"], name: "index_toys_on_pokemon_id", using: :btree

end
```

And the routes file:

```ruby
Rails.application.routes.draw do
  root to: 'static_pages#root'

  resources(
    :pokemon,
    defaults: {format: :json},
    only: [:create, :destroy, :index, :show, :update]
  )
end
```

**Note the `defaults: {format: :json}`**. This means that HTTP
requests that Rails handles for the `pokemon` resource should be
assumed to be asking for a JSON response instead of HTTP. When we
render a template, instead of looking for `template.html.erb`, Rails
will look for `template.json.jbuilder`. We'll see that soon!

## Phase 0A: JBuilder

In `app/views/pokemon/` create three jbuilder files - one each for
`show` and `index`, and a partial called `_pokemon`. Your `show` and
`index` files should both call the partial to render individual
Pokemon. Render all the attributes of the `Pokemon`:

```json
{ "id":1,
  "attack":125,
  "defense":100,
  "image_url":"/assets/pokemon_snaps/127.png",
  "moves":["vicegrip"],
  "name":"Pinsir",
  "poke_type":"bug" }
```

You'll use `json.array!` `json.partial!` and `json.extract` in your
JBuilder templates. These are all the major JBuilder options!

**Test your views by visiting `/pokemon/123` and `/pokemon`. Call your
TA to review.**

## Phase 0B: `Models.Pokemon` and `Collections.Pokemon`

In `app/assets/javascripts/pokedex-0.js`, write a `Pokemon` model
class, saving it in the `Pokedex.Models` namespace. To start, you only
need to set the `urlRoot` property. Also write a `Pokemon` collection
class. You only need to set the `model` and `url` properties.

We've written and defined a "view" class `Pokedex.RootView`. This
class will be responsible for listening to user clicks and displaying
Pokemon data. Look at the class, but there is nothing to write for it
just yet.

**Test your model and collection.** In the Chrome console, make sure
the following work:

```js
// Should print out the attributes of Pokemon #1
Pokedex.Test.testShow(1);
// Should print out the attributes of all Pokemon!
Pokedex.Test.testIndex();
```

## Phase 1A: `refreshPokemon` and `addPokemonToList`

**addPokemonToList**

The first thing to do is get your app displaying `Pokemon`. To do
this, we should first fill out `addPokemonToList(pokemon)` method in
`pokemon-1A.js`. Create an `li` with jQuery, and list a few high-level
details of the Pokemon: `name` and `poke_type`. This is just an index
of Pokemon, so we won't display all data here. Append your `li` to
`this.$pokeList`.

If you give your `li` a class of `poke-list-item`, it'll style nicely
with the CSS rules we've provided. You can look at `application.css`
to check them out.

You can test your method in the console like so:

```js
var pokemon = new Pokedex.Models.Pokemon({ id: 1 });
pokemon.fetch({
  success: function () {
    window.Pokedex.rootView.addPokemonToList(pokemon);
  }
});
```

Does a Pokemon get added to the list?

**refreshPokemon**

Next, write `refreshPokemon` method. This method should fetch all the
Pokemon by fetching `this.pokes`. Iterate through the `this.pokes`,
calling `addPokemonToList`.

You can verify this is working by reloading the page; your Pokemon
should appear!

## Phase 1B: `renderPokemonDetail` and `selectPokemonFromList`

**renderPokemonDetail**

What we're going to do next is allow ourselves to see more detail
about a `Pokemon` by selecting it from the index.

We're going to show the details of the `Pokemon` in the
`this.$pokeDetail`. Create a `div.detail`. Add an image tag with the
Pokemon's photo; iterate through all the Pokemon properties, adding
each to the `div.detail`. Add the `div.detail` to `this.$pokeDetail`.

You can verify this is working:

```javascript
var pokemon = new Pokedex.Models.Pokemon({ id: 1 });
pokemon.fetch({
  success: function () {
    Pokedex.rootView.renderPokemonDetail(pokemon);
  }
});
```

**selectPokemonFromList**

We want to call `renderPokemonDetail` in response to clicks. However,
when a user clicks on a `Pokemon` list item in the `this.$pokeList`,
we need to figure out what `Pokemon` they are clicking on, so that we
can pass that pokemon object to `renderPokemonDetail`.

To do this, modify your `addPokemonToList` method to also set a `id`
data-attribute on the Pokemon list item. Next, in the `RootView`
constructor, write a click handler that calls
`this.selectPokemonFromList`. In the click handler, recover the `id`
from `event.target`; look up the `Pokemon` in `this.pokes` with the
id. Finally, use `renderPokemonDetail` to display the Pokemon.

**Test it out; you should be able to click a Pokemon and see more
details about it.**

## Phase IC: `createPokemon` and `submitPokemonForm`

**createPokemon**

As you encounter new Pokemon, you will want to record your findings
and share your wisdom with other poke-scientists. For this reason, we
have provided you with a form. It doesn't do anything yet.

Before we play with the form, let's write a
`createPokemon(attributes)` method. This should build a new `Pokemon`
model and save it. You'll want to manually add the pokemon to the
`this.pokes` collection and call `addPokemonToList`. Do both of these
in the success callback; that way, you don't add the pokemon to the
collection or list **unless it was saved properly**.

You can test it:

```javascript
Pokedex.rootView.createPokemon({
  name: "PikachuAndAsh",
  image_url: "http://upload.wikimedia.org/wikipedia/en/9/92/Pok%C3%A9mon_episode_1_screenshot.png",
  poke_type: "bug",
  attack: 0,
  defense: 0,
  moves: ["spinning!", "twirling!"]
});
```

Verify that a new pokemon is added to the list. Likewise, make sure a
new pokemon **is not added to the list** for an invalid pokemon:

```javascript
Pokedex.rootView.createPokemon({
  name: "PikachuAndAsh",
  // No image! Invalid!
  poke_type: "bug",
  attack: 0,
  defense: 0,
  moves: ["spinning!", "twirling!"]
});
```

**submitPokemonForm**

Again, we want to improve our user interface so the user can create a
Pokemon through the form, not the console.

To do this, write a `submitPokemonForm` method; in the `RootView`
constructor, install this as a submit handler on the form. In the
handler, use `serializeJSON` on the target to extract the data from
the form and convert it to a JS object. Then call your `createPokemon`
method.

**Display Details of Newly Created Pokemon**

Lastly, we'd like to to display the Pokemon details when creating a
new Pokemon. Modify your `createPokemon` method so that it accepts two
arguments: attributes, and a callback. On successful save of a newly
created Pokemon, your `createPokemon` method should call the callback,
passing the newly created Pokemon as the argument.

The `submitPokemonForm` method can now pass `this.renderPokemonDetail`
(after properly binding it).

Adding callback arguments to asynchronous methods is extremely common,
because it gives the caller flexibility to optionally do more work
**after** the asynchronous work of the method is completed.

## TODO

### Jasmine Specs

For this phase of the project, you will be writing your first Backbone
models and collections. From this point you will be doing most of your
work in `app/javascripts/pokedex.js`. There are Jasmine specs that
test the methods in this file. To run the test suite, run `rake
jasmine` from the command line, then navigate to `localhost:8888` in
your browser.

Your client-side application will live under the namespace
`Pokedex`. When you create a `new Pokedex()`, it should create a new
Pokemon collection. Fill out `listPokemon`

* Fill out the Pokemon model. This should have at least a `urlRoot`
  property.
* Fill out the Pokemon collection. This should have a pointer to its
  `model`, as well as a `url` property.
    * Once these are filled out correctly, you can test them by
      starting your server and making them in the browser console. Try
      fetching, creating, and updating models this way.
* Fill out `listPokemon`. This method will be passed a callback as the
  only argument.
    * In the constructor function for `Pokedex`, set an instance
      variable pointing to a new Pokemon collection.
    * `listPokemon` should call fetch on this collection, and call the
      callback once it hears back from the server and fills the
      collection.
    * Since fetching the collection is an asynchronous event, how do
      we make sure that we don't call the callback too early?
* Fill out `createPokemon`. This method will be passed two arguments:
  An object containing the attributes of the Pokemon-to-be, and a
  callback to be invoked once the Pokemon is saved to the server.
    * After being saved, add the new Pokemon to the Pokemon collection.
    * Just like in `listPokemon`, how can we make sure to only call
      the callback function once the Pokemon has been successfully
      saved?

### User Interface

Now that your specs are passing, let's make use of these methods and
render your Pokemon on the page.

In your Pokedex constructor, set up instance variables that point to
the various important sections of your page: `.pokemon-list`,
`.pokemon-detail`, `.new-pokemon`.

Write a method `addPokemonToList`. This method should accept one
`pokemon` model, render its (basic - no picture) attributes in an
`li`, and append it to the `.pokemon-list`.

Write a method `addAllPokemonToList`. This method should simply
iterate over the `pokemon` collection, calling `addPokemonToList` on
each one. You may also want to make sure to `empty` the list of its
current contents.

Write a method `showPokemonDetail`. This method should:

* Accept one `pokemon` model, and `fetch` it.
* Remove any content from `.pokemon-detail`.
* Build an `img` tag with the `pokemon`'s `image_url`, append this to
  `.pokemon-detail`.
* Add the rest of the `pokemon`'s attributes to `.pokemon-detail`,
  displaying more detailed information than the list item.

#### Listen for events:

Write a method `selectPokemonFromList` that will be called on `click`
of one of the `.pokemon-list` `li`s. This should take a single `event`
as an argument. In this method:

* Get the `data-id` of your `pokemon` from its `li`. (You may have to
  include this in your `addPokemonToList` method).
* Using this `id`, use `get` on your `pokemon` collection to find the
  corresponding model.
* Call `showPokemonDetail`, passing in this model.

Write a method `submitNewPokemonForm` that will be called on `submit`
of your new Pokemon form. It should take a single `event` as an
argument. In this method:

* Use serializeJSON to get the form data. Make sure you key into the
  returned data object with 'pokemon' to get the correct information.
* Call `createPokemon`, passing in the attributes and an anonymous
  callback function that will both `addPokemonToList` and
  `showPokemonDetail`.

## Phase II: `updatePokemon`

Now we're listing Pokemon! You're on the path to becoming a true
master! In this phase, lets add the capability to update your
`pokemon`'s information.

Write the method `updatePokemon` - this should take a `pokemon` model
and a set of attributes, as well as a callback to be executed on
successful update. Set the new attributes on the `pokemon` and `save`
it to update the database. Make the appropriate routes and controller
actions.

Now we will convert our Pokemon Detail view into a form that we can
use to update our Pokemon.

0. Edit your `showPokemonDetail` method. Instead of rendering the
   `pokemon`'s attributes as text, render a form with pre-filled
   `input`s for each attribute.
0. Continue to show the picture, but show the `image_url` field as well.
0. Write a method `submitUpdatePokemonForm` that will be passed an
   event object as an argument. Serialize the form data and call
   `updatePokemon`, passing in the right `pokemon` model. As a
   callback, pass in `showPokemonDetail`.
0. Add a jQuery event listener on `submit` that calls
   `submitUpdatePokemonForm`.
    * What is the best time to attach this listener? If you do it on
      initialization of your Pokedex, the form won't exist yet. How
      can you account for this?

### Avoid Poke-info mis-match

#### (manually) With a 'refresh' button:

Now our Pokemon are updating and re-rendering, cool! But what about
the Pokemon list? This list may now be showing out-of-date
information. Let's make sure that any updates that we make in our
Detail view are reflected in the list of Pokemon.

0. Add a "refresh list" button to your `.pokemon-list` `div`.
0. Set up a listener that calls `addAllPokemonToList` when this button
   is clicked. Now, when you update your Pokemon, you should be able
   to click this button, and see its updated details.

#### (automatically) with Backbone `trigger`s:

As we are saving, updating, and fetching our Backbone Models and
Collections, these objects are firing `trigger`s silently in the
background. Similar to binding jQuery events, we can bind callbacks
that listen for when these `trigger`s are called.

In our `Pokedex` constructor, after we build our `this.pokes`
collection, set up a listener like so: `this.pokes.on(...)`

* The first argument we pass to `on` is the `trigger` event to listen
  for. Take a look at the
  [full list of trigger events](http://backbonejs.org/#Events-catalog)
  to see what events we can listen to. In this case, we're going to
  listen to the _change_ event.
* The second argument to pass in is the callback function - lets use
  our `addAllPokemonToList` function here.

Now update a Pokemon from the web form - any changes you make should
be immediately reflected in the Pokemon list!

## Phase III: Work Hard Play Hard

Relationships between models in Backbone is a little trickier than in
Rails. We don't have access to ActiveRecord methods like `belongs_to`
or `has_many`, but we can build our own functions to model these
relationships.

Our Pokemon look bored - lets add a new model and associations for Toy
in our application.

### Jbuilder

Extend your current Jbuilder templates to include Toys. We want to
deliver the associated models when we call the `show` action, but not
the `index`.

* In `pokemon/show.json.jbuilder`, pass another local variable to the
  `_pokemon` template - `toys: @pokemon.toys`
* In `pokemon/_pokemon.json.jbuilder`, check to see if `toys` exists,
  and if so, include an array of all of a pokemon's toys in the JSON
  response.
    * You may have to call `toys = toys || nil`, to avoid a reference
      error when calling the `index` action.
    * Write another partial for `_toy` to fill out this array.

### Backbone

Create a model and collection for toys in Backbone. For now, don't
worry about adding a `urlRoot` or `url`. We will rely on
`Pokemon#Show` to deliver the JSON data.

The JSON data returned for a Pokemon should now look something like
this:

```json
{
  id: 1,
  name: 'Pikachu',
  poke_type: 'Electric',
  ...
  toys: [
    ...
  ]
}
```

`toys` is on the same level as the rest of our Pokemon's
attributes. But instead of being added as an attribute, we want to
create a new `Toys` collection, and store this on our `Pokemon` model.

To do this, we need to overwrite the `parse` method on our `Pokemon`
model. The `parse` method gets called when your model is reading the
data coming from the server, before it gets `set` on your model.

The `parse` method gets passed the `jsonResponse` from the server when
you fetch your model, then it returns the data to be set as attributes
on your model. By default, it just returns the same `jsonResponse`. We
can override this by writing out own `parse` method - we will not
disrupt the internal functionality of Backbone as long as we remember
to return our model's attributes at the end.

```javascript
// default:

parse: function (jsonResponse) {
  return jsonResponse;
}
```

**default:**
![](../images/parse_before.jpg)

```javascript
// modified:

parse: function (jsonResponse) {
  // your code here

  return modifiedJsonResponse; // return attributes for your model
}
```

**modified**
![](../images/parse_after.jpg)

Write the `parse` method for your `Pokemon` model. It should:

* Check to see if the jsonResponse object has a key named `toys`.
* If it does, set `this.toys` to a new `Toys` collection, and pass it
  the data from `toys`.
* Pass `this` as the second argument to the `Toys` constructor. We
  will see why in a moment.
* Remove the `toys` key from the jsonResponse object.
* return the modified jsonResponse, which Backbone will use to assign
  attributes on your model.

Hey cool! Now we can access a collection of all of a Pokemon model's
toys when we call `.toys`, just like ActiveRecord!

Now why did we pass in 'this' to the `Toys` constructor? We want to be
able to call `this.pokemon` on the `Toys` collection, and have it
return the correct `Pokemon` model.

* Write an initialize method on the `Toys` collection. It should take
  two arguments: `models` and `pokemon`. Save `pokemon` in an instance
  variable, so that we have a pointer to this.

### User Interface

Let's use our new functionality to add Toys to the Pokedex UI.

* Write a function inside `showPokemonDetail` called
  `addAllToysToList`. This function should clear any toys from the
  current list (or remove the current list), then build a list with
  all of your `pokemon.toys` and append it to
  `.pokemon-detail`. Include each `toy`'s `data-id`.
    * You may also want to include the `toy.pokemon`'s `data-id`.
* Call this function when you render the Pokemon Detail, then call it
  again in the success callback when you fetch the Pokemon.
* Bind an event to the 'click' event on a toy list item that will
  render the Toy Detail view in the final panel. Write a method,
  `showToyDetailView` that this event can call.

Now let's let the user create new toys.

* Write a `create` route and controller action for Toy. This should be
  nested under Pokemon.
* Render a new-toy form when you render Pokemon detail. Bind an event
  to the 'submit' of this form that will create a new Toy using the
  collection.
* What is the url for this route? It probably looks something like
  'pokemon/:pokemon_id/toys'. To make the correct ajax call, we need
  to build the correct url. When you submit the Toy form:
    * Use `this.pokes.get()`, passing in the `id` of the Pokemon
      currently in the detail view. Use this Pokemon's `.toys`
      collection `#create` method to make the ajax call.
        * Our `toys` collection doesn't have a url yet. Since the
          route is nested under Pokemon, we need to use the id of
          `this.pokemon` to build it. Assign a function to the `Toys`
          collection that calls `url` on `this.pokemon` and adds
          `/toys` to generate the correct string. (Make sure to return
          this value.)
        * Test that your `url` method is returning the right value by
          calling it in the console.
    * On `success` of your `create` function, add the toy to the toys
      list and show the Toy detail view.
