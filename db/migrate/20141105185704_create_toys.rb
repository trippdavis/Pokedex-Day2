class CreateToys < ActiveRecord::Migration
  def change
    create_table :toys do |t|
      t.references :pokemon, index: true
      t.string :name
      t.integer :price
      t.integer :happiness

      t.timestamps
    end
  end
end
