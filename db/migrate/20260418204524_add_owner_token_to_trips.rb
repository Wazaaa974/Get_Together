class AddOwnerTokenToTrips < ActiveRecord::Migration[8.1]
  def change
    add_column :trips, :owner_token, :string
    add_index :trips, :owner_token, unique: true

    # Backfill existing trips
    Trip.find_each do |trip|
      loop do
        token = SecureRandom.urlsafe_base64(20)
        next if Trip.exists?(owner_token: token)
        trip.update_column(:owner_token, token)
        break
      end
    end
  end
end
