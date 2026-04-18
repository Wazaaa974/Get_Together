class ApplicationController < ActionController::Base
  allow_browser versions: :modern

  def after_sign_in_path_for(resource)
    trips_path
  end

  def after_sign_out_path_for(resource_or_scope)
    new_user_session_path
  end

  private

  def owned_trip_tokens
    session[:owned_trip_tokens] ||= []
  end

  def owns_trip?(trip)
    return false unless trip
    (user_signed_in? && current_user == trip.user) ||
      owned_trip_tokens.include?(trip.owner_token)
  end

  def claim_trip_ownership(trip)
    owned_trip_tokens << trip.owner_token unless owned_trip_tokens.include?(trip.owner_token)
  end
end
