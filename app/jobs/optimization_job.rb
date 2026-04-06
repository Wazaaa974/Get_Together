class OptimizationJob < ApplicationJob
  queue_as :default

  def perform(trip_id)
    trip = Trip.find(trip_id)
    trip.update!(optimization_status: "running")

    PopularDestinations.ensure_on_trip(trip)
    trip.route_quotes.destroy_all
    results = TripOptimizer.call(trip)

    if results.any?
      trip.update!(status: "active", optimization_status: "done")
    else
      trip.update!(optimization_status: "failed")
    end
  rescue => e
    Rails.logger.error("[OptimizationJob] #{e.class}: #{e.message}")
    Trip.find_by(id: trip_id)&.update(optimization_status: "failed")
    raise
  end
end
