# Calculates the total score (sum of prices) for a set of route quotes.
# Currently: sum of all price_cents (cheapest total wins).
# Extensible: could weight by CO2, travel time, etc. in future versions.
class ScoreCalculator
  def self.call(route_quotes)
    route_quotes.sum(&:price_cents)
  end
end
