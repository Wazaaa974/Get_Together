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
    started_at  = Time.current
    trip_id     = trip.id
    # Remove quotes for participants no longer on this trip so results_from_db stays consistent.
    current_participant_ids = trip.participants.pluck(:id)
    RouteQuote.where(trip: trip).where.not(participant_id: current_participant_ids).delete_all

    # Snapshot city IDs before spawning threads — avoids sharing the AR object
    # across threads and triggering @association_cache race conditions.
    city_ids    = trip.candidate_cities.included.pluck(:id)
    n_cities    = city_ids.size

    futures = city_ids.map do |city_id|
      Concurrent::Future.execute(executor: thread_pool) do
        ActiveRecord::Base.connection_pool.with_connection do
          # Each thread reloads its own AR objects → independent association caches,
          # no concurrent writes to shared Ruby state.
          fresh_trip = Trip.includes(:participants).find(trip_id)
          fresh_city = CandidateCity.find(city_id)

          quotes      = CandidateCityEvaluator.call(fresh_trip, fresh_city)
          total_cents = ScoreCalculator.call(quotes)
          quotes.empty? ? nil : { city: fresh_city, quotes: quotes, total_cents: total_cents }
        end
      end
    end

    results = futures.filter_map do |f|
      begin
        f.value
      rescue => e
        Rails.logger.error("[TripOptimizer] future failed: #{e.class}: #{e.message}")
        nil
      end
    end

    elapsed = (Time.current - started_at).round(1)
    Rails.logger.info("[TripOptimizer] #{results.size}/#{n_cities} cities in #{elapsed}s (parallel)")

    results.sort_by { |r| r[:total_cents] }
  rescue => e
    Rails.logger.error("[TripOptimizer] #{e.class}: #{e.message}")
    []
  end

  def self.results_from_db(trip)
    current_participant_ids = trip.participants.pluck(:id)
    return [] if current_participant_ids.empty?

    trip.candidate_cities.included.map do |city|
      quotes = city.route_quotes
                   .where(trip: trip, participant_id: current_participant_ids)
                   .includes(:participant).to_a
      next nil if quotes.empty?
      # Skip cities where some participants are missing a quote (stale data from a previous run)
      next nil if quotes.map(&:participant_id).uniq.sort != current_participant_ids.sort

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
