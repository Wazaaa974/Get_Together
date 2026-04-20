class ResultsMailer < ApplicationMailer
  def results_ready(trip)
    @trip    = trip
    @results = TripOptimizer.results_from_db(trip)
    return if @results.empty?

    @best      = @results.first
    @total_eur = (@best[:total_cents] / 100.0).round
    @avg_eur   = (@total_eur.to_f / [trip.participants.count, 1].max).round
    @results_url = shared_trip_results_url(trip.share_token)

    mail(
      to:      trip.notification_email,
      subject: "#{trip.title} → #{@best[:city].city_name} pour #{@total_eur}€ 🗺️"
    )
  end
end
