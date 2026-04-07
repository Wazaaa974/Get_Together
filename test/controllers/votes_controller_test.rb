require "test_helper"

class VotesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @trip = trips(:weekend_paris)
    @city = candidate_cities(:barcelona)
  end

  test "creates a new vote via turbo stream" do
    assert_difference "Vote.count", 1 do
      post trip_votes_path(@trip), params: { voter_name: "Charlie", candidate_city_id: @city.id },
           headers: { "Accept" => "text/vnd.turbo-stream.html" }
    end
    assert_response :success
    assert_match "votes-section-#{@trip.id}", response.body
  end

  test "updates existing vote for same voter_name" do
    amsterdam = candidate_cities(:amsterdam)
    # Alice already voted for barcelona (fixture)
    assert_no_difference "Vote.count" do
      post trip_votes_path(@trip), params: { voter_name: "Alice", candidate_city_id: amsterdam.id },
           headers: { "Accept" => "text/vnd.turbo-stream.html" }
    end
    assert_equal amsterdam, votes(:alice_vote).reload.candidate_city
  end

  test "returns error when voter_name is blank" do
    post trip_votes_path(@trip), params: { voter_name: "", candidate_city_id: @city.id },
         headers: { "Accept" => "text/vnd.turbo-stream.html" }
    assert_response :success
    assert_match "Entrez votre prénom", response.body
  end

  test "returns error when candidate_city not found" do
    post trip_votes_path(@trip), params: { voter_name: "Charlie", candidate_city_id: 0 },
         headers: { "Accept" => "text/vnd.turbo-stream.html" }
    assert_response :success
    assert_match "Destination introuvable", response.body
  end

  test "returns 404 for unknown trip" do
    post trip_votes_path(trip_id: 0), params: { voter_name: "Charlie", candidate_city_id: @city.id }
    assert_response :not_found
  end
end
