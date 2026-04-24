class BookingsController < ApplicationController
  ALLOWED_TYPES = %w[flight hotel train].freeze

  def out
    type          = params[:type].to_s
    trip_id       = params[:trip_id]
    destination   = params[:destination].to_s.truncate(100)
    destination_iata = params[:destination_iata].to_s.upcase.slice(0, 3)

    return head :bad_request unless ALLOWED_TYPES.include?(type)

    ahoy.track "booking_link_clicked", {
      type:        type,
      trip_id:     trip_id,
      destination: destination
    }

    trip = Trip.find_by(id: trip_id)
    builder = BookingUrlBuilder.new(
      destination_iata: destination_iata,
      destination_name: destination,
      start_date:       trip&.start_date,
      end_date:         trip&.end_date,
      adults:           trip&.participants&.count || 1
    )

    url = case type
          when "flight" then builder.flight_url
          when "hotel"  then builder.hotel_url
          when "train"  then builder.train_url
          end

    redirect_to url, allow_other_host: true, status: :found
  end
end
