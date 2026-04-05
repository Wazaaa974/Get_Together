class Trip < ApplicationRecord
  has_many :participants, dependent: :destroy
  has_many :candidate_cities, dependent: :destroy
  has_many :route_quotes, dependent: :destroy

  validates :title, presence: true
end
