class ParticipantsController < ApplicationController
  before_action :set_trip
  before_action :require_trip_owner!

  def edit
    @participant = @trip.participants.find(params[:id])
  end

  def create
    @participant = @trip.participants.new(participant_params)
    if @participant.save
      redirect_to trip_path(@trip)
    else
      @new_candidate_city = CandidateCity.new
      @new_participant = @participant
      @is_owner = true
      render "trips/show", status: :unprocessable_entity
    end
  end

  def update
    @participant = @trip.participants.find(params[:id])
    if @participant.update(participant_params)
      redirect_to trip_path(@trip)
    else
      redirect_to trip_path(@trip), alert: @participant.errors.full_messages.first
    end
  end

  def destroy
    @participant = @trip.participants.find(params[:id])
    @participant.destroy
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

  def participant_params
    params.require(:participant).permit(:name, :origin_city, :origin_airport_code)
  end
end
