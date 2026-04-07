class AddIsRoundTripToRouteQuotes < ActiveRecord::Migration[8.1]
  def change
    add_column :route_quotes, :is_round_trip, :boolean, default: false, null: false
  end
end
