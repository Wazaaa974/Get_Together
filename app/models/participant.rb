class Participant < ApplicationRecord
  belongs_to :trip
  has_many :route_quotes, dependent: :destroy

  validates :name, presence: { message: "Le prénom est obligatoire" }
  validates :origin_city, presence: { message: "La ville de départ est obligatoire" }
  validates :origin_airport_code,
    format: { with: /\A[A-Z]{3}\z/, message: "Le code IATA doit être 3 lettres (ex: CDG)" },
    allow_blank: true
end
