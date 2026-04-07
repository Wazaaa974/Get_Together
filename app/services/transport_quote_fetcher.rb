require "net/http"
require "json"

# Fetches a flight price between two airports for a given date via the Duffel API.
# Results are cached for 6 hours to avoid redundant API calls.
#
# Setup:
#   1. Run: EDITOR="nano" bin/rails credentials:edit
#   2. Add:  duffel_api_key: <your_token>
#
# Caching:
#   Results are cached in Rails.cache for CACHE_TTL (6 hours) keyed by
#   "duffel/<ORIGIN>-<DESTINATION>/<date>". This means that within the same day,
#   re-running the optimiser for the same route skips the Duffel round-trip entirely.
#
# Returns { price_cents: Integer, currency: String, duration_minutes: Integer }
# Returns nil if no offer is found or if the API call fails.
class TransportQuoteFetcher
  DUFFEL_BASE_URL = "https://api.duffel.com"
  CACHE_TTL       = 6.hours

  def self.call(origin:, destination:, date:)
    return nil if origin.upcase == destination.upcase

    search_date = normalize_date(date)
    cache_key   = "duffel/#{origin.upcase}-#{destination.upcase}/#{search_date}"

    # skip_nil: true prevents caching API failures (rate-limit, timeout, etc.)
    # so a re-run always retries routes that previously returned nil.
    Rails.cache.fetch(cache_key, expires_in: CACHE_TTL, skip_nil: true) do
      fetch_duffel(origin: origin.upcase, destination: destination.upcase, date: search_date)
    end
  rescue => e
    Rails.logger.error("[TransportQuoteFetcher] #{e.class}: #{e.message}")
    nil
  end

  private

  # Returns a future Date suitable for Duffel. Falls back to today+30 for past or invalid dates.
  def self.normalize_date(date)
    parsed = Date.parse(date.to_s)
    parsed > Date.today ? parsed : Date.today + 30
  rescue ArgumentError
    Date.today + 30
  end

  def self.fetch_duffel(origin:, destination:, date:)
    offer_request_id = create_offer_request(origin: origin, destination: destination, date: date)
    return nil unless offer_request_id

    offers = get_offers(offer_request_id: offer_request_id)
    return nil if offers.nil? || offers.empty?

    cheapest      = offers.first
    price_cents   = (cheapest["total_amount"].to_f * 100).round
    duration_mins = parse_iso_duration(cheapest.dig("slices", 0, "duration"))
    currency      = cheapest["total_currency"] || "EUR"

    { price_cents: price_cents, currency: currency, duration_minutes: duration_mins }
  end

  def self.create_offer_request(origin:, destination:, date:)
    uri  = URI("#{DUFFEL_BASE_URL}/air/offer_requests")
    body = {
      data: {
        slices:      [{ origin: origin, destination: destination, departure_date: date.to_s }],
        passengers:  [{ type: "adult" }],
        cabin_class: "economy"
      }
    }.to_json

    response = duffel_post(uri, body)
    return nil unless response&.code == "201"

    JSON.parse(response.body).dig("data", "id")
  end

  def self.get_offers(offer_request_id:)
    uri       = URI("#{DUFFEL_BASE_URL}/air/offers")
    uri.query = URI.encode_www_form(
      offer_request_id: offer_request_id,
      sort:             "total_amount",
      limit:            1
    )

    response = duffel_get(uri)
    return nil unless response&.code == "200"

    JSON.parse(response.body)["data"]
  end

  def self.duffel_post(uri, body)
    http              = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl      = true
    http.read_timeout = 30

    req                   = Net::HTTP::Post.new(uri)
    req["Authorization"]  = "Bearer #{ENV["DUFFEL_API_KEY"]}"
    req["Duffel-Version"] = "v2"
    req["Content-Type"]   = "application/json"
    req["Accept"]         = "application/json"
    req.body              = body

    http.request(req)
  end

  def self.duffel_get(uri)
    http              = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl      = true
    http.read_timeout = 30

    req                   = Net::HTTP::Get.new(uri)
    req["Authorization"]  = "Bearer #{ENV["DUFFEL_API_KEY"]}"
    req["Duffel-Version"] = "v2"
    req["Accept"]         = "application/json"

    http.request(req)
  end

  def self.parse_iso_duration(iso)
    return nil if iso.nil? || iso.empty?

    hours   = iso.match(/(\d+)H/)&.[](1).to_i || 0
    minutes = iso.match(/(\d+)M/)&.[](1).to_i || 0
    (hours * 60) + minutes
  end
end
