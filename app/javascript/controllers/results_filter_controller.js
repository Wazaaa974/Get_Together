import { Controller } from "@hotwired/stimulus"

// Filters and re-sorts the top-3 result cards by a chosen criterion.
// Supports both legacy <select> (target: filter) and pill buttons (target: pill).
export default class extends Controller {
  static values  = { data: Array }
  static targets = ["filter", "pill", "cards", "table"]

  connect() {
    this.original = this.dataValue
    // Activate the first pill by default
    if (this.hasPillTarget) {
      this._activatePill(this.pillTargets[0])
    }
  }

  // Legacy: called by <select> change event
  apply() {
    if (!this.hasFilterTarget) return
    const mode            = this.filterTarget.value
    const participantName = this.filterTarget.dataset.participantName
    this._sort(mode, participantName)
  }

  // New: called by pill button click event
  applyPill(event) {
    const btn  = event.currentTarget
    const mode = btn.dataset.value
    const participantName = btn.dataset.participantName ||
      this.pillTargets.find(p => p.dataset.participantName)?.dataset.participantName

    this._activatePill(btn)
    this._sort(mode, participantName)
  }

  _activatePill(activeBtn) {
    this.pillTargets.forEach(btn => {
      const isActive = btn === activeBtn
      btn.classList.toggle("bg-white",      isActive)
      btn.classList.toggle("text-gray-800", isActive)
      btn.classList.toggle("shadow-sm",     isActive)
      btn.classList.toggle("text-gray-500", !isActive)
      btn.classList.toggle("hover:text-gray-700", !isActive)
    })
  }

  _sort(mode, participantName) {
    let sorted = [...this.original]

    if (mode === "total_asc") {
      sorted.sort((a, b) => a.total_cents - b.total_cents)
    } else if (mode === "duration_asc") {
      sorted.sort((a, b) => (a.max_duration || 9999) - (b.max_duration || 9999))
    } else if (mode === "cheapest_for_me" && participantName) {
      sorted.sort((a, b) => {
        const priceA = a.quotes.find(q => q.name === participantName)?.price ?? 9999
        const priceB = b.quotes.find(q => q.name === participantName)?.price ?? 9999
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
