class TrackingController < ApplicationController
  ALLOWED_EVENTS = %w[share_link_copied].freeze

  def create
    event = params[:event].to_s
    return head :bad_request unless ALLOWED_EVENTS.include?(event)

    ahoy.track event, params.permit(:trip_id).to_h.symbolize_keys
    head :ok
  end
end
