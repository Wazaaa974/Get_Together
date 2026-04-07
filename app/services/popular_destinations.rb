class PopularDestinations
  # 8 destinations — chosen for variety (north/south/east/west) and city-break popularity.
  # Kept at 8 to balance coverage with parallelisation speed (one thread per city).
  CITIES = [
    { city_name: "Amsterdam",  country_code: "NL", airport_code: "AMS", lat: 52.3676,  lng:  4.9041 },
    { city_name: "Barcelone",  country_code: "ES", airport_code: "BCN", lat: 41.3851,  lng:  2.1734 },
    { city_name: "Prague",     country_code: "CZ", airport_code: "PRG", lat: 50.0755,  lng: 14.4378 },
    { city_name: "Lisbonne",   country_code: "PT", airport_code: "LIS", lat: 38.7223,  lng: -9.1393 },
    { city_name: "Vienne",     country_code: "AT", airport_code: "VIE", lat: 48.2082,  lng: 16.3738 },
    { city_name: "Rome",       country_code: "IT", airport_code: "FCO", lat: 41.9028,  lng: 12.4964 },
    { city_name: "Budapest",   country_code: "HU", airport_code: "BUD", lat: 47.4979,  lng: 19.0402 },
    { city_name: "Porto",      country_code: "PT", airport_code: "OPO", lat: 41.1579,  lng: -8.6291 },
  ].freeze

  def self.ensure_on_trip(trip)
    CITIES.each do |data|
      trip.candidate_cities.find_or_create_by(airport_code: data[:airport_code]) do |city|
        city.city_name    = data[:city_name]
        city.country_code = data[:country_code]
      end
    end
  end

  def self.coordinates_for(airport_code)
    city = CITIES.find { |c| c[:airport_code] == airport_code }
    city ? [city[:lat], city[:lng]] : nil
  end
end
