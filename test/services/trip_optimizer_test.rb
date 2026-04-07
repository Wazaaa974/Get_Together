require "test_helper"

class TripOptimizerTest < ActiveSupport::TestCase
  def setup
    @trip = trips(:weekend_paris)
  end

  test "results_from_db returns empty array when no route_quotes exist" do
    @trip.route_quotes.destroy_all
    results = TripOptimizer.results_from_db(@trip)
    assert_equal [], results
  end

  test "results_from_db returns sorted results by total_cents" do
    city_a = candidate_cities(:barcelona)
    city_b = candidate_cities(:amsterdam)
    participant = @trip.participants.first

    # City A: cheaper
    RouteQuote.create!(
      trip: @trip, participant: participant, candidate_city: city_a,
      price_cents: 5000, currency: "EUR", duration_minutes: 90, transport_type: "flight"
    )
    # City B: more expensive
    RouteQuote.create!(
      trip: @trip, participant: participant, candidate_city: city_b,
      price_cents: 15000, currency: "EUR", duration_minutes: 120, transport_type: "flight"
    )

    results = TripOptimizer.results_from_db(@trip)
    assert_equal 2, results.size
    assert results.first[:total_cents] <= results.last[:total_cents],
           "Expected results sorted cheapest first"
  end

  test "results_from_db total_cents sums participant prices" do
    city = candidate_cities(:barcelona)
    @trip.route_quotes.destroy_all

    @trip.participants.each do |participant|
      RouteQuote.create!(
        trip: @trip, participant: participant, candidate_city: city,
        price_cents: 10000, currency: "EUR", duration_minutes: 90, transport_type: "flight"
      )
    end

    results = TripOptimizer.results_from_db(@trip)
    expected_total = 10000 * @trip.participants.count
    assert_equal expected_total, results.first[:total_cents]
  end

  test "call returns empty array gracefully when trip has no candidate cities" do
    # Temporarily remove all candidate cities from an ad-hoc trip (no fixtures)
    user = users(:alice)
    empty_trip = Trip.create!(title: "Empty Trip", user: user, start_date: Date.today + 10, end_date: Date.today + 12)
    results = TripOptimizer.call(empty_trip)
    assert_equal [], results
  end

  test "thread_pool is reused across calls" do
    pool1 = TripOptimizer.send(:thread_pool)
    pool2 = TripOptimizer.send(:thread_pool)
    assert_same pool1, pool2, "thread_pool should be a shared singleton"
  end
end
