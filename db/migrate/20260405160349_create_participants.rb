class CreateParticipants < ActiveRecord::Migration[8.0]
  def change
    create_table :participants do |t|
      t.references :trip, null: false, foreign_key: true
      t.string :name
      t.string :origin_city
      t.string :origin_airport_code

      t.timestamps
    end
  end
end
