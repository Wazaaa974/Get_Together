class CandidateCitiesController < ApplicationController
  before_action :set_trip

  def create
    @candidate_city = @trip.candidate_cities.new(candidate_city_params)
    if @candidate_city.save
      redirect_to @trip
    else
      @new_participant = Participant.new
      @new_candidate_city = @candidate_city
      render "trips/show", status: :unprocessable_entity
    end
  end

  def destroy
    @candidate_city = @trip.candidate_cities.find(params[:id])
    @candidate_city.destroy
    redirect_to @trip
  end

  private

  def set_trip
    @trip = Trip.find(params[:trip_id])
  end

  def candidate_city_params
    params.require(:candidate_city).permit(:city_name, :country_code, :airport_code)
  end
end
