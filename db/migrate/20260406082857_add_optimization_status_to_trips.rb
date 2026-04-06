class AddOptimizationStatusToTrips < ActiveRecord::Migration[8.0]
  def change
    add_column :trips, :optimization_status, :string, default: "idle", null: false
  end
end
