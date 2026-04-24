require "test_helper"

class TripsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def setup
    @user = users(:alice)
    @trip = trips(:weekend_paris)
    sign_in @user
  end

  test "index lists current_user trips" do
    get trips_path
    assert_response :success
    assert_match @trip.title, response.body
  end

  test "index is empty when not signed in" do
    sign_out @user
    get trips_path
    assert_response :success
  end

  test "new renders form" do
    get new_trip_path
    assert_response :success
  end

  test "create persists trip and redirects to show" do
    assert_difference "Trip.count", 1 do
      post trips_path, params: { trip: { title: "Voyage test", start_date: "2026-09-01", end_date: "2026-09-05" } }
    end
    assert_redirected_to trip_path(Trip.last)
    follow_redirect!
    assert_match "Trip créé avec succès", response.body
  end

  test "create with invalid title rerenders new" do
    assert_no_difference "Trip.count" do
      post trips_path, params: { trip: { title: "" } }
    end
    assert_response :unprocessable_entity
  end

  test "show renders trip for owner" do
    get trip_path(@trip)
    assert_response :success
    assert_match @trip.title, response.body
  end

  test "show redirects when not owner" do
    sign_in users(:bob)
    get trip_path(@trip)
    assert_redirected_to root_path
    follow_redirect!
    assert_match "Accès non autorisé", response.body
  end

  test "show redirects when trip not found" do
    get trip_path(id: 0)
    assert_redirected_to root_path
  end

  test "edit renders form for owner" do
    get edit_trip_path(@trip)
    assert_response :success
  end

  test "update modifies trip and redirects" do
    patch trip_path(@trip), params: { trip: { title: "Nouveau titre" } }
    assert_redirected_to trip_path(@trip)
    assert_equal "Nouveau titre", @trip.reload.title
  end

  test "update with invalid data rerenders edit" do
    patch trip_path(@trip), params: { trip: { title: "" } }
    assert_response :unprocessable_entity
  end

  test "destroy deletes trip and redirects" do
    assert_difference "Trip.count", -1 do
      delete trip_path(@trip)
    end
    assert_redirected_to trips_path
  end

  test "optimize redirects to waiting page" do
    post optimize_trip_path(@trip)
    assert_redirected_to waiting_trip_path(@trip)
    assert_equal "pending", @trip.reload.optimization_status
  end

  test "optimize without participants redirects with alert" do
    @trip.participants.destroy_all
    post optimize_trip_path(@trip)
    assert_redirected_to trip_path(@trip)
    follow_redirect!
    assert_match "au moins un participant", response.body
  end

  test "non-owner cannot optimize" do
    sign_in users(:bob)
    post optimize_trip_path(@trip)
    assert_redirected_to root_path
  end

  test "results renders when quotes exist" do
    get results_trip_path(@trip)
    assert_response :success
  end

  test "results redirects when no quotes" do
    @trip.route_quotes.destroy_all
    get results_trip_path(@trip)
    assert_redirected_to trip_path(@trip)
  end

  test "optimization_status returns json" do
    get optimization_status_trip_path(@trip)
    assert_response :success
    assert_equal "application/json", response.media_type
  end

  test "save_notification_email accepts valid email" do
    post save_notification_email_trip_path(@trip), params: { notification_email: "x@y.com" }
    assert_response :success
    assert_equal "x@y.com", @trip.reload.notification_email
  end

  test "save_notification_email rejects invalid email" do
    post save_notification_email_trip_path(@trip), params: { notification_email: "not-an-email" }
    assert_response :unprocessable_entity
  end
end
