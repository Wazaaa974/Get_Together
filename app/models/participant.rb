class Participant < ApplicationRecord
  belongs_to :trip
  has_many :route_quotes, dependent: :destroy

  validates :name, :origin_city, presence: true
end
