class TripsController < ApplicationController
  before_action :set_trip, only: [ :show, :edit, :update, :destroy, :optimize, :results, :waiting, :optimization_status, :claim ]
  before_action :require_owner!, only: [ :show, :edit, :update, :destroy, :optimize, :results, :waiting, :optimization_status ]

  def index
    @trips = user_signed_in? ? current_user.trips.includes(:participants, :route_quotes).order(created_at: :desc) : []
  end

  def new
    @trip = Trip.new
    3.times { @trip.participants.build }
  end

  def create
    @trip = Trip.new(trip_params)
    @trip.user = current_user if user_signed_in?
    if @trip.save
      claim_trip_ownership(@trip)
      redirect_to @trip, notice: "Trip créé avec succès."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @new_participant = Participant.new
    @new_candidate_city = CandidateCity.new
    @is_owner = true
  end

  def edit
  end

  def update
    if @trip.update(trip_params)
      redirect_to @trip, notice: "Trip mis à jour."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @trip.destroy
    redirect_to (user_signed_in? ? trips_path : root_path), notice: "Trip supprimé."
  end

  def claim
    if @trip.owner_token == params[:owner_token]
      claim_trip_ownership(@trip)
      redirect_to @trip, notice: "Accès administrateur activé pour ce trip."
    else
      redirect_to root_path, alert: "Lien invalide ou expiré."
    end
  end

  def optimize
    if @trip.participants.empty?
      redirect_to @trip, alert: "Ajoutez au moins un participant avant de lancer le calcul."
      return
    end

    @trip.update!(optimization_status: "pending")
    OptimizationJob.perform_later(@trip.id)
    redirect_to waiting_trip_path(@trip)
  end

  def waiting
    if @trip.optimization_status == "done"
      redirect_to results_trip_path(@trip)
    elsif @trip.optimization_status == "failed"
      redirect_to @trip, alert: "Le calcul a échoué. Vérifiez les participants et réessayez."
    end
  end

  def optimization_status
    render json: { status: @trip.optimization_status }
  end

  def results
    @results = TripOptimizer.results_from_db(@trip)

    if @results.empty?
      redirect_to @trip, alert: "Aucun résultat disponible. Lancez d'abord le calcul."
    end
  end

  def shared
    @trip = Trip.find_by(share_token: params[:share_token])
    if @trip.nil?
      redirect_to root_path, alert: "Ce lien de partage est invalide ou a expiré."
      return
    end
    @new_participant = Participant.new
    @new_candidate_city = CandidateCity.new
    @is_owner = false
    @shared_view = true
    render :show
  end

  private

  def set_trip
    @trip = Trip.includes(:participants, :candidate_cities, :route_quotes).find_by(id: params[:id])
    unless @trip
      redirect_to root_path, alert: "Trip introuvable."
    end
  end

  def require_owner!
    unless owns_trip?(@trip)
      redirect_to root_path, alert: "Accès non autorisé. Utilisez votre lien administrateur."
    end
  end

  def trip_params
    params.require(:trip).permit(
      :title, :start_date, :end_date, :status,
      participants_attributes: [:id, :name, :origin_city, :origin_airport_code, :_destroy]
    )
  end
end
