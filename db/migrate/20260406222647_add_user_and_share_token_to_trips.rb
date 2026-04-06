class AddUserAndShareTokenToTrips < ActiveRecord::Migration[8.0]
  def change
    add_reference :trips, :user, null: true, foreign_key: true
    add_column :trips, :share_token, :string
    add_index :trips, :share_token, unique: true
  end
end
