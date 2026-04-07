require "test_helper"

class TransportQuoteFetcherTest < ActiveSupport::TestCase
  # ── parse_iso_duration ─────────────────────────────────────────────────────

  test "parses hours and minutes" do
    assert_equal 150, TransportQuoteFetcher.send(:parse_iso_duration, "PT2H30M")
  end

  test "parses hours only" do
    assert_equal 120, TransportQuoteFetcher.send(:parse_iso_duration, "PT2H")
  end

  test "parses minutes only" do
    assert_equal 45, TransportQuoteFetcher.send(:parse_iso_duration, "PT45M")
  end

  test "returns nil for nil input" do
    assert_nil TransportQuoteFetcher.send(:parse_iso_duration, nil)
  end

  test "returns nil for empty string" do
    assert_nil TransportQuoteFetcher.send(:parse_iso_duration, "")
  end

  # ── normalize_date ─────────────────────────────────────────────────────────

  test "returns future date unchanged" do
    future = Date.today + 10
    assert_equal future, TransportQuoteFetcher.send(:normalize_date, future.to_s)
  end

  test "returns today + 30 for past date" do
    past = (Date.today - 5).to_s
    result = TransportQuoteFetcher.send(:normalize_date, past)
    assert_equal Date.today + 30, result
  end

  test "returns today + 30 for invalid date string" do
    result = TransportQuoteFetcher.send(:normalize_date, "not-a-date")
    assert_equal Date.today + 30, result
  end

  # ── call — same origin/destination ────────────────────────────────────────

  test "returns nil when origin equals destination" do
    assert_nil TransportQuoteFetcher.call(origin: "CDG", destination: "CDG", date: Date.today + 5)
  end

  test "returns nil when origin equals destination case-insensitive" do
    assert_nil TransportQuoteFetcher.call(origin: "cdg", destination: "CDG", date: Date.today + 5)
  end

  # ── caching — cache key format ────────────────────────────────────────────
  # The test environment uses :null_store so we can't test a real cache hit.
  # Instead we verify that the cache key is built deterministically from the
  # normalised (future) date, so past-date trips map to the same key as the
  # equivalent future date.

  test "past date normalises to today+30, ensuring stable cache key" do
    past   = Date.today - 5
    future = Date.today + 30
    assert_equal future, TransportQuoteFetcher.send(:normalize_date, past.to_s)
    assert_equal future, TransportQuoteFetcher.send(:normalize_date, future.to_s)
  end

  test "cache TTL constant is 6 hours" do
    assert_equal 6.hours, TransportQuoteFetcher::CACHE_TTL
  end
end
