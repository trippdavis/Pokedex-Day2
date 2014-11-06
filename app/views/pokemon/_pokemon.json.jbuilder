json.extract!(pokemon, :id, :name, :number, :poke_type, :attack,
			:defense, :evolve_level, :evolve_to, :moves, :levels,
			:curve, :probability, :image_url)

toys ||= nil
unless toys.nil?
  json.toys(toys) do |toy| 
    json.partial! 'toys/toy', toy: toy
  end
end
