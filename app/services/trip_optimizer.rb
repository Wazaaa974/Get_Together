# Runs the full optimization for a trip in parallel (one thread per city).
#
# .call(trip)          — fetches quotes via API and stores them, returns sorted results
# .results_from_db(trip) — reads already-stored quotes without hitting the API
class TripOptimizer
  def self.call(trip)
    results = []

    trip.candidate_cities.each do |city|
      quotes      = CandidateCityEvaluator.call(trip, city)
      total_cents = ScoreCalculator.call(quotes)
      next if quotes.empty?

      results << { city: city, quotes: quotes, total_cents: total_cents }
    end

    results.sort_by { |r| r[:total_cents] }
  rescue => e
    Rails.logger.error("[TripOptimizer] #{e.class}: #{e.message}")
    []
  end

  def self.results_from_db(trip)
    trip.candidate_cities.map do |city|
      quotes = city.route_quotes.where(trip: trip).includes(:participant).to_a
      next nil if quotes.empty?

      total_cents = ScoreCalculator.call(quotes)
      { city: city, quotes: quotes, total_cents: total_cents }
    end.compact.sort_by { |r| r[:total_cents] }
  end
end
