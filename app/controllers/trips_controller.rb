class TripsController < ApplicationController
  before_action :authenticate_user!, except: [:shared]
  before_action :set_trip, only: [:show, :edit, :update, :destroy, :optimize, :results, :waiting, :optimization_status]
  before_action :require_trip_owner!, only: [:edit, :update, :destroy, :optimize]

  def index
    @trips = current_user.trips.includes(:participants, :route_quotes).order(created_at: :desc)
  end

  def new
    @trip = Trip.new
  end

  def create
    @trip = current_user.trips.new(trip_params)
    if @trip.save
      redirect_to @trip, notice: "Trip créé avec succès."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @new_participant = Participant.new
    @new_candidate_city = CandidateCity.new
    @is_owner = current_user == @trip.user
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
    redirect_to trips_path, notice: "Trip supprimé."
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

  # Public share route — no auth required
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
    @trip = current_user.trips.includes(:participants, :candidate_cities, :route_quotes).find_by(id: params[:id])
    unless @trip
      redirect_to trips_path, alert: "Trip introuvable."
    end
  end

  def require_trip_owner!
    unless @trip && @trip.user == current_user
      redirect_to trips_path, alert: "Vous n'avez pas accès à ce trip."
    end
  end

  def trip_params
    params.require(:trip).permit(:title, :start_date, :end_date, :status)
  end
end
