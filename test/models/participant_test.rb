require "test_helper"

class ParticipantTest < ActiveSupport::TestCase
  test "valid participant" do
    trip = trips(:weekend_paris)
    participant = Participant.new(name: "Clara", origin_city: "Berlin", trip: trip)
    assert participant.valid?
  end

  test "invalid without name" do
    trip = trips(:weekend_paris)
    participant = Participant.new(origin_city: "Berlin", trip: trip)
    assert_not participant.valid?
  end

  test "invalid without origin_city" do
    trip = trips(:weekend_paris)
    participant = Participant.new(name: "Clara", trip: trip)
    assert_not participant.valid?
  end

  test "valid with correct IATA code" do
    trip = trips(:weekend_paris)
    participant = Participant.new(name: "Clara", origin_city: "Berlin", origin_airport_code: "BER", trip: trip)
    assert participant.valid?
  end

  test "invalid with malformed IATA code" do
    trip = trips(:weekend_paris)
    participant = Participant.new(name: "Clara", origin_city: "Berlin", origin_airport_code: "be", trip: trip)
    assert_not participant.valid?
    assert_not_empty participant.errors[:origin_airport_code]
  end

  test "valid without IATA code" do
    trip = trips(:weekend_paris)
    participant = Participant.new(name: "Clara", origin_city: "Berlin", trip: trip)
    assert participant.valid?
  end

  test "IATA code lowercase is invalid" do
    trip = trips(:weekend_paris)
    participant = Participant.new(name: "Clara", origin_city: "Berlin", origin_airport_code: "cdg", trip: trip)
    assert_not participant.valid?
  end
end
