class CandidateCity < ApplicationRecord
  belongs_to :trip
  has_many :route_quotes, dependent: :destroy

  validates :city_name, presence: true
end
