class AddNotificationEmailToTrips < ActiveRecord::Migration[8.1]
  def change
    add_column :trips, :notification_email, :string
  end
end
