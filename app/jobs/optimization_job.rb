class OptimizationJob < ApplicationJob
  queue_as :default

  TIMEOUT_SECONDS = 180 # 3 minutes

  def perform(trip_id)
    trip = Trip.find(trip_id)
    trip.update!(optimization_status: "running")

    started_at = Time.current

    PopularDestinations.ensure_on_trip(trip)
    trip.route_quotes.destroy_all

    results = with_timeout(TIMEOUT_SECONDS) do
      TripOptimizer.call(trip)
    end

    if results.any?
      trip.update!(status: "active", optimization_status: "done", last_optimized_at: Time.current)
    else
      trip.update!(optimization_status: "failed")
    end
  rescue Timeout::Error
    Rails.logger.error("[OptimizationJob] Timeout after #{TIMEOUT_SECONDS}s for trip #{trip_id}")
    Trip.find_by(id: trip_id)&.update(optimization_status: "failed")
  rescue => e
    Rails.logger.error("[OptimizationJob] #{e.class}: #{e.message}")
    Trip.find_by(id: trip_id)&.update(optimization_status: "failed")
    raise
  end

  private

  def with_timeout(seconds, &block)
    Timeout.timeout(seconds, &block)
  end
end
