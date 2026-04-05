class CreateTrips < ActiveRecord::Migration[8.0]
  def change
    create_table :trips do |t|
      t.string :title
      t.date :start_date
      t.date :end_date
      t.string :status

      t.timestamps
    end
  end
end
