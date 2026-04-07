class CreateVotes < ActiveRecord::Migration[8.0]
  def change
    create_table :votes do |t|
      t.references :trip,           null: false, foreign_key: true
      t.references :candidate_city, null: false, foreign_key: true
      t.string     :voter_name,     null: false

      t.timestamps
    end

    add_index :votes, [:trip_id, :voter_name], unique: true
  end
end
