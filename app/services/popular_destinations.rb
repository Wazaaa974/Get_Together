# Curated list of popular European hub cities that are always evaluated
# when a user launches an optimization, even without manually adding cities.
class PopularDestinations
  CITIES = [
    { city_name: "Amsterdam",  country_code: "NL", airport_code: "AMS" },
    { city_name: "Barcelone",  country_code: "ES", airport_code: "BCN" },
    { city_name: "Prague",     country_code: "CZ", airport_code: "PRG" },
    { city_name: "Lisbonne",   country_code: "PT", airport_code: "LIS" },
    { city_name: "Vienne",     country_code: "AT", airport_code: "VIE" },
    { city_name: "Rome",       country_code: "IT", airport_code: "FCO" },
    { city_name: "Dublin",     country_code: "IE", airport_code: "DUB" },
    { city_name: "Bruxelles",  country_code: "BE", airport_code: "BRU" },
    { city_name: "Budapest",   country_code: "HU", airport_code: "BUD" },
    { city_name: "Porto",      country_code: "PT", airport_code: "OPO" },
  ].freeze

  # Creates CandidateCity records for popular destinations that are not
  # already present on the trip (matched by airport_code to avoid duplicates).
  def self.ensure_on_trip(trip)
    CITIES.each do |data|
      trip.candidate_cities.find_or_create_by(airport_code: data[:airport_code]) do |city|
        city.city_name    = data[:city_name]
        city.country_code = data[:country_code]
      end
    end
  end
end
