class CreatePokemons < ActiveRecord::Migration
  def change
    create_table :pokemons do |t|
      t.string :name
      t.integer :number
      t.integer :attack
      t.integer :defense
      t.integer :evolve_level
      t.integer :evolve_to
      t.string :poke_type
      t.string :moves
      t.string :levels
      t.integer :probability
      t.float :curve

      t.timestamps
    end
  end
end
