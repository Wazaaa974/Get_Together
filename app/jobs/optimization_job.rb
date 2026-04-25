class OptimizationJob < ApplicationJob
  queue_as :default

  # With parallel city evaluation (one thread per city), the wall-clock time is
  # dominated by the slowest single city (~5-8 s per participant).
  # 90 s gives a comfortable 10× safety margin for 8 cities × 8 participants.
  TIMEOUT_SECONDS = 90

  def perform(trip_id)
    trip       = Trip.find(trip_id)
    started_at = Time.current
    trip.update!(optimization_status: "running")

    PopularDestinations.ensure_on_trip(trip)
    trip.route_quotes.destroy_all

    results = with_timeout(TIMEOUT_SECONDS) do
      TripOptimizer.call(trip)
    end

    elapsed = (Time.current - started_at).round(1)

    if results.any?
      trip.update!(status: "active", optimization_status: "done", last_optimized_at: Time.current)
      Rails.logger.info("[OptimizationJob] trip #{trip_id} done in #{elapsed}s — #{results.size} cities ranked")

      begin
        Ahoy::Event.create!(name: "optimization_completed", time: Time.current, properties: {
          trip_id: trip_id, duration_s: elapsed, cities_count: results.size,
          winning_city: results.first[:city].city_name, total_price_cents: results.first[:total_cents]
        })
      rescue => e
        Rails.logger.warn("[OptimizationJob] Ahoy tracking failed (non-fatal): #{e.class}: #{e.message}")
      end

      begin
        ResultsMailer.results_ready(trip).deliver_later if trip.notification_email.present?
      rescue => e
        Rails.logger.warn("[OptimizationJob] Mailer enqueue failed (non-fatal): #{e.class}: #{e.message}")
      end
    else
      trip.update!(optimization_status: "failed")
      Rails.logger.warn("[OptimizationJob] trip #{trip_id} — no results after #{elapsed}s")
    end
  rescue Timeout::Error
    Rails.logger.error("[OptimizationJob] Timeout after #{TIMEOUT_SECONDS}s for trip #{trip_id}")
    t = Trip.find_by(id: trip_id)
    t.update(optimization_status: "failed") if t && t.optimization_status != "done"
  rescue => e
    Rails.logger.error("[OptimizationJob] #{e.class}: #{e.message}")
    t = Trip.find_by(id: trip_id)
    t.update(optimization_status: "failed") if t && t.optimization_status != "done"
    raise
  end

  private

  def with_timeout(seconds, &block)
    Timeout.timeout(seconds, &block)
  end
end
