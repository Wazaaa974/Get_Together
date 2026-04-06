require "test_helper"

class UserTest < ActiveSupport::TestCase
  test "valid user with email and password" do
    user = User.new(email: "test@example.com", password: "password123", password_confirmation: "password123")
    assert user.valid?
  end

  test "invalid without email" do
    user = User.new(password: "password123")
    assert_not user.valid?
  end

  test "invalid with duplicate email" do
    existing = users(:alice)
    user = User.new(email: existing.email, password: "password123")
    assert_not user.valid?
  end

  test "has many trips" do
    user = users(:alice)
    assert_respond_to user, :trips
  end

  test "alice has one trip" do
    user = users(:alice)
    assert_equal 1, user.trips.count
  end
end
