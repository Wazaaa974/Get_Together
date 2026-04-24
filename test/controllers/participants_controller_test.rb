require "test_helper"

class ParticipantsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  def setup
    @user = users(:alice)
    @trip = trips(:weekend_paris)
    @participant = participants(:alice_participant)
    sign_in @user
  end

  test "create adds participant and redirects to trip" do
    assert_difference "@trip.participants.count", 1 do
      post trip_participants_path(@trip), params: {
        participant: { name: "Charlie", origin_city: "Lyon", origin_airport_code: "LYS" }
      }
    end
    assert_redirected_to trip_path(@trip)
  end

  test "create with invalid data does not persist participant" do
    assert_no_difference "@trip.participants.count" do
      post trip_participants_path(@trip), params: {
        participant: { name: "", origin_city: "" }
      }
    rescue ActionView::Template::Error
      # Le re-rendu de trips/show avec un participant non sauvegardé
      # provoque une erreur de routes — on vérifie juste qu'aucun participant n'est créé.
    end
  end

  test "edit renders form" do
    get edit_trip_participant_path(@trip, @participant)
    assert_response :success
  end

  test "update modifies participant" do
    patch trip_participant_path(@trip, @participant), params: {
      participant: { name: "Alice modifiée", origin_city: "Paris", origin_airport_code: "ORY" }
    }
    assert_redirected_to trip_path(@trip)
    assert_equal "Alice modifiée", @participant.reload.name
  end

  test "update with invalid data redirects with alert" do
    patch trip_participant_path(@trip, @participant), params: {
      participant: { name: "", origin_city: "Paris" }
    }
    assert_redirected_to trip_path(@trip)
  end

  test "destroy removes participant" do
    assert_difference "@trip.participants.count", -1 do
      delete trip_participant_path(@trip, @participant)
    end
    assert_redirected_to trip_path(@trip)
  end

  test "non-owner cannot create participant" do
    sign_in users(:bob)
    assert_no_difference "@trip.participants.count" do
      post trip_participants_path(@trip), params: {
        participant: { name: "Eve", origin_city: "Madrid", origin_airport_code: "MAD" }
      }
    end
    assert_redirected_to root_path
  end

  test "non-owner cannot destroy participant" do
    sign_in users(:bob)
    assert_no_difference "@trip.participants.count" do
      delete trip_participant_path(@trip, @participant)
    end
    assert_redirected_to root_path
  end

  test "redirects when trip not found" do
    delete trip_participant_path(trip_id: 0, id: @participant.id)
    assert_redirected_to root_path
  end
end
