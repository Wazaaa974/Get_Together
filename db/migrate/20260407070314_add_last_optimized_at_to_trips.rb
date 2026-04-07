class AddLastOptimizedAtToTrips < ActiveRecord::Migration[8.0]
  def change
    add_column :trips, :last_optimized_at, :datetime
  end
end
