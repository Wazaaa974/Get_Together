class OgImagesController < ApplicationController
  CACHE_DIR = Rails.root.join("tmp", "og_cache").freeze

  def show
    trip = Trip.find_by(share_token: params[:share_token])
    return head :not_found unless trip

    cache_path = CACHE_DIR.join(cache_filename(trip))

    unless cache_path.exist?
      FileUtils.mkdir_p(CACHE_DIR)
      png = TripOgImageGenerator.call(trip)
      cache_path.binwrite(png)
    end

    response.headers["Cache-Control"] = "public, max-age=300"
    send_file cache_path, type: "image/png", disposition: "inline"
  rescue => e
    Rails.logger.error("[OgImages] generation failed: #{e.class} #{e.message}")
    Rails.logger.error(e.backtrace.first(5).join("\n"))
    head :internal_server_error
  end

  private

  def cache_filename(trip)
    quote_ts = trip.route_quotes.maximum(:updated_at).to_i
    "trip_#{trip.id}_t#{trip.updated_at.to_i}_q#{quote_ts}.png"
  end
end
