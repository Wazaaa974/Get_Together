class TripOgImageGenerator
  def self.call(trip)
    new(trip).call
  end

  def initialize(trip)
    @trip = trip
  end

  def call
    Grover.new(html, **grover_options).to_png
  end

  private

  attr_reader :trip

  def html
    ApplicationController.render(
      template: "og_images/trip",
      layout: false,
      assigns: {
        trip: trip,
        winner: winner,
        total_price_euros: total_price_euros,
        participants: participants,
        has_results: results.any?
      }
    )
  end

  def results
    @results ||= TripOptimizer.results_from_db(trip)
  end

  def winner
    results.first&.dig(:city)
  end

  def total_price_euros
    cents = results.first&.dig(:total_cents)
    cents ? (cents / 100.0).round : nil
  end

  def participants
    trip.participants.map { |p| { name: p.name.to_s.strip, city: p.origin_city.to_s.strip } }
  end

  def grover_options
    opts = {
      format: "A4",
      viewport: { width: 1200, height: 630 },
      device_scale_factor: 2,
      wait_until: "load",
      launch_args: %w[--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage --disable-gpu]
    }
    # Sur Railway/Docker, Puppeteer utilise le chromium système
    executable = ENV["PUPPETEER_EXECUTABLE_PATH"].presence ||
                 %w[/usr/bin/chromium /usr/bin/chromium-browser /usr/bin/google-chrome-stable].find { |p| File.exist?(p) }
    opts[:executable_path] = executable if executable
    opts
  end
end
