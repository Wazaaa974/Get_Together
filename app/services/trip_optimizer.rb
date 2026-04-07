require "concurrent"

# Runs the full optimization for a trip in parallel (one thread per city).
#
# .call(trip)          — fetches quotes via API in parallel, stores them, returns sorted results
# .results_from_db(trip) — reads already-stored quotes without hitting the API
#
# Parallelisation strategy:
#   One Concurrent::Future per candidate city — cities are evaluated simultaneously.
#   Each future checks out its own DB connection from the pool, so writes are safe.
#   With 8 cities the wall-clock time ≈ slowest single city (~5-8 s) instead of
#   the sum of all cities (~40-60 s).
class TripOptimizer
  # Number of cities evaluated in parallel. Capped to avoid exhausting the DB pool.
  THREAD_POOL_SIZE = 8

  def self.call(trip)
    started_at = Time.current

    futures = trip.candidate_cities.map do |city|
      Concurrent::Future.execute(executor: thread_pool) do
        ActiveRecord::Base.connection_pool.with_connection do
          quotes      = CandidateCityEvaluator.call(trip, city)
          total_cents = ScoreCalculator.call(quotes)
          quotes.empty? ? nil : { city: city, quotes: quotes, total_cents: total_cents }
        end
      end
    end

    results = futures.filter_map do |f|
      begin
        f.value  # blocks until this future completes (or raises)
      rescue => e
        Rails.logger.error("[TripOptimizer] future failed: #{e.class}: #{e.message}")
        nil
      end
    end

    elapsed = (Time.current - started_at).round(1)
    Rails.logger.info("[TripOptimizer] #{results.size}/#{futures.size} cities in #{elapsed}s (#{trip.candidate_cities.size} cities, parallel)")

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

  private

  # Shared, bounded thread pool — reused across calls, avoids spawning a new pool every time.
  def self.thread_pool
    @thread_pool ||= Concurrent::FixedThreadPool.new(THREAD_POOL_SIZE)
  end
end
