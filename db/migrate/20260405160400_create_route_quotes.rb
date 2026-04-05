class CreateRouteQuotes < ActiveRecord::Migration[8.0]
  def change
    create_table :route_quotes do |t|
      t.references :trip, null: false, foreign_key: true
      t.references :participant, null: false, foreign_key: true
      t.references :candidate_city, null: false, foreign_key: true
      t.integer :price_cents
      t.string :currency
      t.integer :duration_minutes
      t.string :transport_type

      t.timestamps
    end
  end
end
