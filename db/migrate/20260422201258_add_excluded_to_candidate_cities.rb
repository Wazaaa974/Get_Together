class AddExcludedToCandidateCities < ActiveRecord::Migration[8.1]
  def change
    add_column :candidate_cities, :excluded, :boolean, default: false, null: false
  end
end
