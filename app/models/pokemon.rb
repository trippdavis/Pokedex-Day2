class Pokemon < ActiveRecord::Base
  serialize :levels, Array
	serialize :moves, Array
end
