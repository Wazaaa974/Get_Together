# Resolves a city name to its main IATA airport code.
# Used when a participant or candidate city doesn't have an explicit airport code.
class AirportResolver
  AIRPORT_CODES = {
    # France
    "paris"        => "CDG",
    "lyon"         => "LYS",
    "marseille"    => "MRS",
    "nice"         => "NCE",
    "toulouse"     => "TLS",
    "bordeaux"     => "BOD",
    "nantes"       => "NTE",
    "strasbourg"   => "SXB",
    "lille"        => "LIL",
    "rennes"       => "RNS",
    # UK
    "london"       => "LHR",
    "londres"      => "LHR",
    "manchester"   => "MAN",
    "edinburgh"    => "EDI",
    "birmingham"   => "BHX",
    "bristol"      => "BRS",
    "glasgow"      => "GLA",
    # Spain
    "madrid"       => "MAD",
    "barcelona"    => "BCN",
    "valencia"     => "VLC",
    "seville"      => "SVQ",
    "séville"      => "SVQ",
    "malaga"       => "AGP",
    "málaga"       => "AGP",
    "bilbao"       => "BIO",
    # Germany
    "berlin"       => "BER",
    "munich"       => "MUC",
    "frankfurt"    => "FRA",
    "hamburg"      => "HAM",
    "cologne"      => "CGN",
    "düsseldorf"   => "DUS",
    "dusseldorf"   => "DUS",
    # Italy
    "rome"         => "FCO",
    "roma"         => "FCO",
    "milan"        => "MXP",
    "milano"       => "MXP",
    "naples"       => "NAP",
    "napoli"       => "NAP",
    "venice"       => "VCE",
    "florence"     => "FLR",
    "bologna"      => "BLQ",
    # Netherlands
    "amsterdam"    => "AMS",
    # Belgium
    "brussels"     => "BRU",
    "bruxelles"    => "BRU",
    # Portugal
    "lisbon"       => "LIS",
    "lisbonne"     => "LIS",
    "porto"        => "OPO",
    # Ireland
    "dublin"       => "DUB",
    "cork"         => "ORK",
    # Switzerland
    "zurich"       => "ZRH",
    "zürich"       => "ZRH",
    "geneva"       => "GVA",
    "genève"       => "GVA",
    "geneve"       => "GVA",
    # Austria
    "vienna"       => "VIE",
    "vienne"       => "VIE",
    # Denmark
    "copenhagen"   => "CPH",
    "copenhague"   => "CPH",
    # Sweden
    "stockholm"    => "ARN",
    "gothenburg"   => "GOT",
    # Norway
    "oslo"         => "OSL",
    # Finland
    "helsinki"     => "HEL",
    # Poland
    "warsaw"       => "WAW",
    "varsovie"     => "WAW",
    "krakow"       => "KRK",
    "cracovie"     => "KRK",
    # Czech Republic
    "prague"       => "PRG",
    # Hungary
    "budapest"     => "BUD",
    # Greece
    "athens"       => "ATH",
    "athènes"      => "ATH",
    "thessaloniki" => "SKG",
    # Romania
    "bucharest"    => "OTP",
    "bucarest"     => "OTP",
    # Croatia
    "zagreb"       => "ZAG",
    "split"        => "SPU",
    "dubrovnik"    => "DBV",
  }.freeze

  def self.call(city_name)
    normalized = city_name.to_s.downcase.strip
    AIRPORT_CODES[normalized] || fallback(city_name)
  end

  private

  def self.fallback(city_name)
    city_name.to_s.upcase.gsub(/[^A-Z]/, "")[0..2]
  end
end
