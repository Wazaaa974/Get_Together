class CreateCandidateCities < ActiveRecord::Migration[8.0]
  def change
    create_table :candidate_cities do |t|
      t.references :trip, null: false, foreign_key: true
      t.string :city_name
      t.string :country_code
      t.string :airport_code

      t.timestamps
    end
  end
end
