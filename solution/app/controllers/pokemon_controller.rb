class PokemonController < ApplicationController
	def create
		@pokemon = Pokemon.new(pokemon_params)

		if @pokemon.save
			render 'show'
		else
			render json: @pokemon.errors.full_messages, status: 422
		end
	end

	def destroy
    @pokemon = Pokemon.find(params[:id])
    @pokemon.destroy
    render json: @pokemon
  end
  
  def index
		@pokemon = Pokemon.all
		render 'index'
	end

	def	show
		@pokemon = Pokemon.find(params[:id])
		render 'show'
	end

	private
	def pokemon_params
		params.require(:pokemon).permit(
			:name, :attack, :defense, :poke_type :image_url, moves: []
		)
	end
end
