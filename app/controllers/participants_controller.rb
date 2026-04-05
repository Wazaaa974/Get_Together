class ParticipantsController < ApplicationController
  before_action :set_trip

  def create
    @participant = @trip.participants.new(participant_params)
    if @participant.save
      redirect_to @trip
    else
      @new_candidate_city = CandidateCity.new
      @new_participant = @participant
      render "trips/show", status: :unprocessable_entity
    end
  end

  def destroy
    @participant = @trip.participants.find(params[:id])
    @participant.destroy
    redirect_to @trip
  end

  private

  def set_trip
    @trip = Trip.find(params[:trip_id])
  end

  def participant_params
    params.require(:participant).permit(:name, :origin_city, :origin_airport_code)
  end
end
