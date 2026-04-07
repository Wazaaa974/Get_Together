require "test_helper"

class TripTest < ActiveSupport::TestCase
  test "valid trip with title" do
    user = users(:alice)
    trip = Trip.new(title: "Weekend Berlin", user: user)
    assert trip.valid?
  end

  test "invalid without title" do
    trip = Trip.new
    assert_not trip.valid?
    assert_includes trip.errors[:title], "ne peut pas être vide"
  end

  test "invalid when end_date before start_date" do
    user = users(:alice)
    trip = Trip.new(
      title: "Bad Dates",
      user: user,
      start_date: Date.today + 5,
      end_date: Date.today + 2
    )
    assert_not trip.valid?
    assert_includes trip.errors[:end_date], "doit être après la date de début"
  end

  test "valid when end_date equals start_date" do
    user = users(:alice)
    trip = Trip.new(
      title: "One Day Trip",
      user: user,
      start_date: Date.today + 5,
      end_date: Date.today + 5
    )
    assert trip.valid?
  end

  test "generates share_token on create" do
    user = users(:alice)
    trip = Trip.create!(title: "Token Trip", user: user)
    assert trip.share_token.present?
    assert trip.share_token.length > 10
  end

  test "share_token is unique" do
    trip1 = trips(:weekend_paris)
    trip2 = trips(:trip_bob)
    assert_not_equal trip1.share_token, trip2.share_token
  end

  test "belongs to user" do
    trip = trips(:weekend_paris)
    assert_equal users(:alice), trip.user
  end

  test "has many participants" do
    trip = trips(:weekend_paris)
    assert_equal 2, trip.participants.count
  end
end
