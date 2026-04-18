class CandidateCitiesController < ApplicationController
  before_action :set_trip
  before_action :require_trip_owner!

  def create
    @candidate_city = @trip.candidate_cities.new(candidate_city_params)
    if @candidate_city.save
      redirect_to trip_path(@trip)
    else
      @new_participant = Participant.new
      @new_candidate_city = @candidate_city
      @is_owner = true
      render "trips/show", status: :unprocessable_entity
    end
  end

  def destroy
    @candidate_city = @trip.candidate_cities.find(params[:id])
    @candidate_city.destroy
    redirect_to trip_path(@trip)
  end

  private

  def set_trip
    @trip = Trip.find_by(id: params[:trip_id])
    unless @trip
      redirect_to root_path, alert: "Trip introuvable."
    end
  end

  def require_trip_owner!
    unless owns_trip?(@trip)
      redirect_to root_path, alert: "Accès non autorisé."
    end
  end

  def candidate_city_params
    params.require(:candidate_city).permit(:city_name, :country_code, :airport_code)
  end
end
