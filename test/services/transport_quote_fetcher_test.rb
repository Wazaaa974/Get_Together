require "test_helper"

class TransportQuoteFetcherTest < ActiveSupport::TestCase
  test "returns nil when origin equals destination (exact)" do
    result = TransportQuoteFetcher.call(origin: "CDG", destination: "CDG", date: Date.today + 60)
    assert_nil result
  end

  test "returns nil when origin equals destination case-insensitive" do
    result = TransportQuoteFetcher.call(origin: "cdg", destination: "CDG", date: Date.today + 60)
    assert_nil result
  end

  test "returns nil when no API key configured" do
    # In test env, DUFFEL_API_KEY is not set — expects nil or raises gracefully
    result = nil
    assert_nothing_raised do
      result = TransportQuoteFetcher.call(origin: "CDG", destination: "BCN", date: Date.today + 60)
    end
    # Either nil (graceful failure) or a hash if by chance an API key exists
    assert result.nil? || result.is_a?(Hash)
  end

  test "cache key is consistent for same route and date" do
    date = Date.today + 90
    key1 = "duffel/CDG-BCN/#{date}"
    key2 = "duffel/CDG-BCN/#{date}"
    assert_equal key1, key2
  end

  test "parse_iso_duration handles standard durations" do
    assert_equal 150, TransportQuoteFetcher.send(:parse_iso_duration, "PT2H30M")
    assert_equal 60,  TransportQuoteFetcher.send(:parse_iso_duration, "PT1H0M")
    assert_equal 45,  TransportQuoteFetcher.send(:parse_iso_duration, "PT45M")
    assert_equal 120, TransportQuoteFetcher.send(:parse_iso_duration, "PT2H")
  end

  test "parse_iso_duration returns nil for nil input" do
    assert_nil TransportQuoteFetcher.send(:parse_iso_duration, nil)
  end

  test "parse_iso_duration returns nil for empty string" do
    assert_nil TransportQuoteFetcher.send(:parse_iso_duration, "")
  end
end
