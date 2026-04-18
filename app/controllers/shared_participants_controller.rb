class SharedParticipantsController < ApplicationController
  def create
    @trip = Trip.find_by(share_token: params[:share_token])
    unless @trip
      redirect_to root_path, alert: "Lien de partage invalide."
      return
    end

    @participant = @trip.participants.new(participant_params)
    if @participant.save
      redirect_to shared_trip_path(@trip.share_token), notice: "Vous avez rejoint le trip !"
    else
      @new_participant = @participant
      @new_candidate_city = CandidateCity.new
      @is_owner = false
      @shared_view = true
      render "trips/show", status: :unprocessable_entity
    end
  end

  private

  def participant_params
    params.require(:participant).permit(:name, :origin_city, :origin_airport_code)
  end
end
