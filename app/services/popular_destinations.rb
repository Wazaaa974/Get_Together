class PopularDestinations
  # Destinations populaires — variété nord/sud/est/ouest, city-break.
  CITIES = [
    { city_name: "Amsterdam",  country_code: "NL", airport_code: "AMS", lat: 52.3676,  lng:  4.9041 },
    { city_name: "Barcelone",  country_code: "ES", airport_code: "BCN", lat: 41.3851,  lng:  2.1734 },
    { city_name: "Prague",     country_code: "CZ", airport_code: "PRG", lat: 50.0755,  lng: 14.4378 },
    { city_name: "Lisbonne",   country_code: "PT", airport_code: "LIS", lat: 38.7223,  lng: -9.1393 },
    { city_name: "Vienne",     country_code: "AT", airport_code: "VIE", lat: 48.2082,  lng: 16.3738 },
    { city_name: "Rome",       country_code: "IT", airport_code: "FCO", lat: 41.9028,  lng: 12.4964 },
    { city_name: "Budapest",   country_code: "HU", airport_code: "BUD", lat: 47.4979,  lng: 19.0402 },
    { city_name: "Porto",      country_code: "PT", airport_code: "OPO", lat: 41.1579,  lng: -8.6291 },
    { city_name: "Berlin",     country_code: "DE", airport_code: "BER", lat: 52.5200,  lng: 13.4050 },
    { city_name: "Copenhague", country_code: "DK", airport_code: "CPH", lat: 55.6761,  lng: 12.5683 },
    { city_name: "Dublin",     country_code: "IE", airport_code: "DUB", lat: 53.3498,  lng: -6.2603 },
    { city_name: "Athènes",    country_code: "GR", airport_code: "ATH", lat: 37.9838,  lng: 23.7275 },
    { city_name: "Cracovie",   country_code: "PL", airport_code: "KRK", lat: 50.0647,  lng: 19.9450 },
    { city_name: "Édimbourg",  country_code: "GB", airport_code: "EDI", lat: 55.9533,  lng: -3.1883 },
    { city_name: "Stockholm",  country_code: "SE", airport_code: "ARN", lat: 59.3293,  lng: 18.0686 },
    { city_name: "Séville",    country_code: "ES", airport_code: "SVQ", lat: 37.3891,  lng: -5.9845 },
  ].freeze

  def self.ensure_on_trip(trip)
    participant_airports = trip.participants.pluck(:origin_airport_code).compact.map(&:upcase).to_set

    CITIES.each do |data|
      trip.candidate_cities.find_or_create_by(airport_code: data[:airport_code]) do |city|
        city.city_name    = data[:city_name]
        city.country_code = data[:country_code]
        city.excluded     = participant_airports.include?(data[:airport_code].upcase)
      end
    end
  end

  def self.coordinates_for(airport_code)
    city = CITIES.find { |c| c[:airport_code] == airport_code }
    city ? [city[:lat], city[:lng]] : nil
  end
end
