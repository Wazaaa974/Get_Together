class CandidateCity < ApplicationRecord
  belongs_to :trip
  has_many :route_quotes, dependent: :destroy
  has_many :votes, dependent: :destroy

  validates :city_name, presence: true

  scope :included, -> { where(excluded: false) }
  scope :excluded, -> { where(excluded: true) }

  def participant_city?(trip)
    return false if airport_code.blank?
    trip.participants.any? { |p| p.origin_airport_code.present? && p.origin_airport_code == airport_code }
  end
end
