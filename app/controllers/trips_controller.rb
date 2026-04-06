class TripsController < ApplicationController
  before_action :set_trip, only: [:show, :edit, :update, :destroy, :optimize, :results, :waiting, :optimization_status]

  def index
    @trips = Trip.order(created_at: :desc)
  end

  def new
    @trip = Trip.new
  end

  def create
    @trip = Trip.new(trip_params)
    if @trip.save
      redirect_to @trip, notice: "Trip créé avec succès."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def show
    @new_participant = Participant.new
    @new_candidate_city = CandidateCity.new
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
    # If already done, redirect straight to results
    if @trip.optimization_status == "done"
      redirect_to results_trip_path(@trip)
    elsif @trip.optimization_status == "failed"
      redirect_to @trip, alert: "Le calcul a échoué. Vérifiez les participants."
    end
    # Otherwise render waiting.html.erb
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

  private

  def set_trip
    @trip = Trip.find(params[:id])
  end

  def trip_params
    params.require(:trip).permit(:title, :start_date, :end_date, :status)
  end
end
