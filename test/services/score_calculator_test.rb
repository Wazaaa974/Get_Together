require "test_helper"

class ScoreCalculatorTest < ActiveSupport::TestCase
  test "sums price_cents of all quotes" do
    quotes = route_quotes(:alice_to_barcelona, :bob_to_barcelona)
    total  = ScoreCalculator.call(quotes)
    assert_equal 8500 + 9200, total
  end

  test "returns 0 for empty array" do
    assert_equal 0, ScoreCalculator.call([])
  end

  test "works with a single quote" do
    quote = route_quotes(:alice_to_barcelona)
    assert_equal 8500, ScoreCalculator.call([quote])
  end
end
