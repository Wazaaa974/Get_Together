require "test_helper"

class TripOptimizerTest < ActiveSupport::TestCase
  setup do
    @trip = trips(:weekend_paris)
  end

  test "results_from_db returns sorted results by total_cents" do
    results = TripOptimizer.results_from_db(@trip)
    assert results.is_a?(Array)
    # Barcelona has quotes, should appear
    assert results.any? { |r| r[:city].city_name == "Barcelona" }
    # Results should be sorted ascending by total_cents
    totals = results.map { |r| r[:total_cents] }
    assert_equal totals, totals.sort
  end

  test "results_from_db returns empty array when no route_quotes" do
    trip = trips(:trip_bob)
    results = TripOptimizer.results_from_db(trip)
    assert_equal [], results
  end

  test "results_from_db skips cities with no quotes" do
    # Amsterdam fixture exists but has no route_quotes
    results = TripOptimizer.results_from_db(@trip)
    result_cities = results.map { |r| r[:city].city_name }
    assert_includes result_cities, "Barcelona"
    # Amsterdam has no quotes in fixtures, should not appear
    assert_not_includes result_cities, "Amsterdam"
  end

  test "results_from_db includes correct total_cents" do
    results  = TripOptimizer.results_from_db(@trip)
    bcn      = results.find { |r| r[:city].city_name == "Barcelona" }
    assert bcn, "Barcelona should be in results"
    # alice(8500) + bob(9200) = 17700
    assert_equal 17700, bcn[:total_cents]
  end

  test "call returns empty array on error" do
    # Trip with no candidate cities returns []
    trip = Trip.new(title: "Empty", user: users(:alice))
    trip.save!(validate: false)
    results = TripOptimizer.call(trip)
    assert_equal [], results
  end
end
