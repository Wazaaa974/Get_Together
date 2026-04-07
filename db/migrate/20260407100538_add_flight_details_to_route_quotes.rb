class AddFlightDetailsToRouteQuotes < ActiveRecord::Migration[8.1]
  def change
    add_column :route_quotes, :departure_at, :datetime
    add_column :route_quotes, :arrival_at, :datetime
    add_column :route_quotes, :airline_name, :string
  end
end
