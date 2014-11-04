require 'rails_helper'

feature 'delivering JSON via jbuilder' do
  before :each do
    create_five_pokemon 
  end

  scenario 'showing a single Pokemon' do
    charmy = Pokemon.first
    visit pokemon_url(charmy)

    expect(page).to have_content "Charmander"
    expect(page).to have_content 4
    expect(page).to have_content "fire"
    expect(page).to have_content 52
    expect(page).to have_content 43
    expect(page).to have_content 'scratch'
    expect(page).to have_content 3
  end

  scenario 'showing all Pokemon' do
    visit pokemon_index_url

    expect(page).to have_content "Charmander"
    expect(page).to have_content 4
    expect(page).to have_content "fire"
    expect(page).to have_content 52
    expect(page).to have_content 43
    expect(page).to have_content 'scratch'
    expect(page).to have_content 3
    expect(page).to have_content 3
    expect(page).to have_content "Snorlax"
    expect(page).to have_content "Electabuzz"
    expect(page).to have_content "Articuno"
  end

end
