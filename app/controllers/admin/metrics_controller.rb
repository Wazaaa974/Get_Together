class Admin::MetricsController < ApplicationController
  before_action :require_admin!

  def show
    @since = 30.days.ago.beginning_of_day

    @trips_per_day = Ahoy::Event
      .where(name: "trip_created", time: @since..)
      .group(Arel.sql("date_trunc('day', time AT TIME ZONE 'Europe/Paris')::date"))
      .order(Arel.sql("1"))
      .count

    @funnel = {
      created:      Ahoy::Event.where(name: "trip_created",           time: @since..).count,
      optimized:    Ahoy::Event.where(name: "optimization_started",   time: @since..).count,
      completed:    Ahoy::Event.where(name: "optimization_completed", time: @since..).count,
      shared_opens: Ahoy::Event.where(name: "trip_opened_via_share",  time: @since..).count,
      voted:        Ahoy::Event.where(name: "vote_cast",              time: @since..).count,
    }

    @share_copies = Ahoy::Event.where(name: "share_link_copied", time: @since..).count

    @avg_votes_per_trip = begin
      votes = Ahoy::Event.where(name: "vote_cast", time: @since..)
                         .group("properties->>'trip_id'").count
      votes.values.sum.to_f / votes.size if votes.any?
    end

    @top_winning_cities = Ahoy::Event
      .where(name: "optimization_completed", time: @since..)
      .pluck(Arel.sql("properties->>'winning_city'"))
      .tally
      .sort_by { |_, v| -v }
      .first(5)
  end

  private

  def require_admin!
    admin_emails = ENV.fetch("ADMIN_EMAILS", "").split(",").map(&:strip)
    unless user_signed_in? && admin_emails.include?(current_user.email)
      redirect_to root_path, alert: "Accès non autorisé."
    end
  end
end
