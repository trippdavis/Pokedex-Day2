// TODO
Pokedex.RootView.prototype.createToy = function (attrs, callback) { // III

};

// TODO
Pokedex.RootView.prototype.renderToyForm = function ($list) {
  var $li = $('<li class="toy-list-item">');
  var $form = $('<form>');
  ['name', 'price', 'happiness'].forEach(function(el) {

  });
};

// TODO
Pokedex.RootView.prototype.submitToyForm = function (event) {
  event.preventDefault();
  var toyAttrs = $(event.target).serializeJSON()['toy'];

  var that = this;
  this.createToy(toyAttrs, function (toy) {
    that.renderToyDetail(toy);
    that.renderToyListItem(toy);
  });
};
