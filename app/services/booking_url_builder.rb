class BookingUrlBuilder
  MARKER       = ENV.fetch("TRAVELPAYOUTS_MARKER", "722195")
  BOOKING_PROMO = ENV.fetch("TRAVELPAYOUTS_BOOKING_PROMO", "84")
  OMIO_PROMO    = ENV.fetch("TRAVELPAYOUTS_OMIO_PROMO", "91")

  def initialize(destination_iata:, destination_name:, origin_iata: nil, start_date: nil, end_date: nil, adults: 1)
    @destination_iata = destination_iata
    @destination_name = destination_name
    @origin_iata      = origin_iata
    @start_date       = start_date
    @end_date         = end_date
    @adults           = [adults, 1].max
  end

  def flight_url
    params = { destination: @destination_iata, adults: @adults, marker: MARKER }
    params[:origin]       = @origin_iata      if @origin_iata.present?
    params[:depart_date]  = fmt(@start_date)  if @start_date.present?
    params[:return_date]  = fmt(@end_date)    if @end_date.present?
    "https://www.aviasales.com/?" + params.to_query
  end

  def hotel_url
    checkin  = fmt(@start_date)
    checkout = fmt(@end_date || (@start_date&.+ 3.days))
    deep = "https://www.booking.com/searchresults.html?" + {
      ss:            @destination_name,
      checkin:       checkin,
      checkout:      checkout,
      group_adults:  @adults
    }.to_query
    "https://tp.media/click?" + {
      shmarker:    MARKER,
      promo_id:    BOOKING_PROMO,
      source_type: "customlink",
      type:        "click",
      custom_url:  deep
    }.to_query
  end

  def train_url
    # Omio search: origin is blank (the user books from their city), destination is city name
    deep = "https://www.omio.com/results/trains/#{CGI.escape(@destination_name)}/#{fmt(@start_date)}/1"
    "https://tp.media/click?" + {
      shmarker:    MARKER,
      promo_id:    OMIO_PROMO,
      source_type: "customlink",
      type:        "click",
      custom_url:  deep
    }.to_query
  end

  private

  def fmt(date)
    date&.strftime("%Y-%m-%d")
  end
end
