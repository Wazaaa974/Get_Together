class ApplicationController < ActionController::Base
  allow_browser versions: :modern

  before_action :set_locale

  def after_sign_in_path_for(resource)
    trips_path
  end

  def after_sign_out_path_for(resource_or_scope)
    new_user_session_path
  end

  def default_url_options
    return {} if I18n.locale == I18n.default_locale
    { locale: I18n.locale }
  end

  private

  def set_locale
    requested = params[:locale].presence || cookies[:locale].presence || browser_locale
    I18n.locale = if I18n.available_locales.map(&:to_s).include?(requested.to_s)
      requested.to_sym
    else
      I18n.default_locale
    end
    cookies[:locale] = { value: I18n.locale.to_s, expires: 1.year.from_now } if params[:locale].present?
  end

  def browser_locale
    accept = request.env["HTTP_ACCEPT_LANGUAGE"].to_s
    accept.scan(/[a-z]{2}/).find { |l| I18n.available_locales.map(&:to_s).include?(l) }
  end

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
