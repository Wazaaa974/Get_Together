class AddPerformanceIndexes < ActiveRecord::Migration[8.0]
  def change
    # Trips — filtrés par user + optimization_status
    add_index :trips, :optimization_status
    add_index :trips, [:user_id, :created_at]

    # RouteQuotes — aggregations par trip + candidate_city
    add_index :route_quotes, [:trip_id, :candidate_city_id]
    add_index :route_quotes, [:participant_id, :candidate_city_id]
  end
end
