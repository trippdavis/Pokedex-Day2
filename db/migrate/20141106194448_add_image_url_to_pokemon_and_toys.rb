class AddImageUrlToPokemonAndToys < ActiveRecord::Migration
  def change
    add_column :pokemons, :image_url, :string
    add_column :toys, :image_url, :string
  end
end
