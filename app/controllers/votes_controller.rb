class VotesController < ApplicationController
  before_action :set_trip

  def create
    candidate_city = @trip.candidate_cities.find_by(id: params[:candidate_city_id])
    unless candidate_city
      render turbo_stream: turbo_stream.replace("votes-section-#{@trip.id}",
        partial: "votes/section", locals: { trip: @trip, error: "Destination introuvable." })
      return
    end

    voter_name = params[:voter_name].to_s.strip
    if voter_name.blank?
      render turbo_stream: turbo_stream.replace("votes-section-#{@trip.id}",
        partial: "votes/section", locals: { trip: @trip, error: "Entrez votre prénom pour voter." })
      return
    end

    vote = @trip.votes.find_or_initialize_by(voter_name: voter_name)
    vote.candidate_city = candidate_city

    if vote.save
      ahoy.track "vote_cast", trip_id: @trip.id,
        candidate_city_id: candidate_city.id, city_name: candidate_city.city_name
      render turbo_stream: turbo_stream.replace("votes-section-#{@trip.id}",
        partial: "votes/section", locals: { trip: @trip.reload, error: nil })
    else
      render turbo_stream: turbo_stream.replace("votes-section-#{@trip.id}",
        partial: "votes/section", locals: { trip: @trip, error: vote.errors.full_messages.first })
    end
  end

  private

  def set_trip
    @trip = Trip.find_by(id: params[:trip_id])
    unless @trip
      head :not_found
    end
  end
end
