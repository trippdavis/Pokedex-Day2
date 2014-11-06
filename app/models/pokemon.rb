require 'byebug'

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

  def image_url
    if read_attribute(:image_url)
      super
    else
      number = self.number.to_s
      while number.length < 3
        number = '0' + number
      end

      "/assets/pokemon_snaps/#{number}.png"
    end
  end
end
