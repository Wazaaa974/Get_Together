class Vote < ApplicationRecord
  belongs_to :trip
  belongs_to :candidate_city

  validates :voter_name, presence: true
  validates :voter_name, uniqueness: { scope: :trip_id, message: "a déjà voté pour ce trip" }
end
