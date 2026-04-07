import { Controller } from "@hotwired/stimulus"

// Filters and re-sorts the top-3 result cards + detail table by a chosen criterion.
// Expects data-results-filter-data-value to be a JSON array of result objects.
export default class extends Controller {
  static values  = { data: Array }
  static targets = ["filter", "cards", "table"]

  connect() {
    this.original = this.dataValue
  }

  apply() {
    const mode = this.filterTarget.value
    let sorted = [...this.original]

    if (mode === "total_asc") {
      sorted.sort((a, b) => a.total_cents - b.total_cents)
    } else if (mode === "duration_asc") {
      sorted.sort((a, b) => (a.max_duration || 9999) - (b.max_duration || 9999))
    } else if (mode === "cheapest_for_me") {
      const name = this.filterTarget.dataset.participantName
      sorted.sort((a, b) => {
        const priceA = a.quotes.find(q => q.name === name)?.price ?? 9999
        const priceB = b.quotes.find(q => q.name === name)?.price ?? 9999
        return priceA - priceB
      })
    }

    this.renderCards(sorted)
  }

  renderCards(results) {
    if (!this.hasCardsTarget) return
    const cards = this.cardsTarget.querySelectorAll(".result-card")
    results.slice(0, 3).forEach((r, i) => {
      if (!cards[i]) return
      cards[i].querySelector(".card-city").textContent  = r.city_name
      cards[i].querySelector(".card-total").textContent = `€${Math.round(r.total_cents / 100)}`
    })
  }
}
