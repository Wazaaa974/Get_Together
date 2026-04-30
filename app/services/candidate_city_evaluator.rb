# Fetches and stores a RouteQuote for every participant → candidate_city pair.
# Returns the list of saved RouteQuote records.
class CandidateCityEvaluator
  def self.call(trip, candidate_city)
    date        = trip.start_date&.to_s || Date.today.to_s
    return_date = trip.end_date&.to_s

    trip.participants.map do |participant|
      origin = participant.origin_airport_code.presence
      unless origin
        origin = AirportResolver.call(participant.origin_city)
        participant.update_column(:origin_airport_code, origin) if origin
      end
      destination = candidate_city.airport_code.presence ||
                    AirportResolver.call(candidate_city.city_name)

      quote_data = if origin.upcase == destination.upcase
        # Participant is already in this city — travel is free
        { price_cents: 0, currency: "EUR", duration_minutes: 0, is_round_trip: false }
      else
        TransportQuoteFetcher.call(
          origin:       origin,
          destination:  destination,
          date:         date,
          return_date:  return_date
        )
      end

      next nil if quote_data.nil?

      route_quote = RouteQuote.find_or_initialize_by(
        trip: trip,
        participant: participant,
        candidate_city: candidate_city
      )

      route_quote.update!(
        price_cents:      quote_data[:price_cents],
        currency:         quote_data[:currency],
        duration_minutes: quote_data[:duration_minutes],
        transport_type:   "flight",
        departure_at:     quote_data[:departure_at],
        arrival_at:       quote_data[:arrival_at],
        airline_name:     quote_data[:airline_name],
        is_round_trip:    quote_data[:is_round_trip] || false
      )

      route_quote
    end.compact
  end
end
