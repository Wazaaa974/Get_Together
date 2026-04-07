require "test_helper"

class VoteTest < ActiveSupport::TestCase
  def setup
    @trip = trips(:weekend_paris)
    @city = candidate_cities(:barcelona)
  end

  test "valid vote" do
    vote = Vote.new(trip: @trip, candidate_city: @city, voter_name: "Charlie")
    assert vote.valid?
  end

  test "invalid without voter_name" do
    vote = Vote.new(trip: @trip, candidate_city: @city, voter_name: "")
    assert_not vote.valid?
    assert_includes vote.errors[:voter_name], "ne peut pas être vide"
  end

  test "invalid without trip" do
    vote = Vote.new(trip: nil, candidate_city: @city, voter_name: "Charlie")
    assert_not vote.valid?
  end

  test "invalid without candidate_city" do
    vote = Vote.new(trip: @trip, candidate_city: nil, voter_name: "Charlie")
    assert_not vote.valid?
  end

  test "voter_name must be unique per trip" do
    # alice_vote fixture already exists for weekend_paris
    vote = Vote.new(trip: @trip, candidate_city: @city, voter_name: "Alice")
    assert_not vote.valid?
    assert_includes vote.errors[:voter_name], "a déjà voté pour ce trip"
  end

  test "same voter_name is allowed on different trips" do
    other_trip = trips(:trip_bob)
    other_city = candidate_cities(:amsterdam)
    vote = Vote.new(trip: other_trip, candidate_city: other_city, voter_name: "Alice")
    assert vote.valid?
  end

  test "upsert via find_or_initialize_by updates city" do
    vote = @trip.votes.find_or_initialize_by(voter_name: "Alice")
    vote.candidate_city = candidate_cities(:amsterdam)
    assert vote.save
    assert_equal "Amsterdam", vote.reload.candidate_city.city_name
  end
end
