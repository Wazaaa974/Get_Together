class RouteQuote < ApplicationRecord
  belongs_to :trip
  belongs_to :participant
  belongs_to :candidate_city

  def price_euros
    price_cents / 100.0
  end
end
