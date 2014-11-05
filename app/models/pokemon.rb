class Pokemon < ActiveRecord::Base
  serialize :levels, Array
	serialize :moves, Array
  TYPES = [
    "fire",
    "electric",
    "normal",
    "ghost",
    "psychic",
    "water",
    "bug",
    "dragon",
    "grass",
    "fighting",
    "ice",
    "flying",
    "poison",
    "ground",
    "rock",
    "steel"
  ].sort

  validates :name, :poke_type, :number, presence: true
  validates :poke_type, inclusion: { in: TYPES }

  has_many :toys
end
