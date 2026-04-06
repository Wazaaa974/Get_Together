import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values  = { url: String, resultsUrl: String, tripUrl: String }
  static targets = ["statusText", "steps"]

  connect() {
    this.step    = 0
    this.steps   = [
      "Connexion aux APIs de vols",
      "Évaluation des destinations",
      "Calcul des scores et prix",
      "Classement final",
    ]
    this.poll()
  }

  disconnect() {
    clearTimeout(this.timeout)
  }

  poll() {
    this.timeout = setTimeout(async () => {
      try {
        const res  = await fetch(this.urlValue, { headers: { Accept: "application/json" } })
        const data = await res.json()

        if (data.status === "done") {
          this.advanceStep(this.steps.length - 1)
          this.statusTextTarget.textContent = "Résultats prêts ! Redirection…"
          setTimeout(() => { window.location.href = this.resultsUrlValue }, 600)
          return
        }

        if (data.status === "failed") {
          this.statusTextTarget.textContent = "Une erreur est survenue. Redirection…"
          setTimeout(() => { window.location.href = this.tripUrlValue }, 800)
          return
        }

        // Advance step visually
        this.step = Math.min(this.step + 1, this.steps.length - 1)
        this.advanceStep(this.step)
        this.statusTextTarget.textContent = this.steps[this.step] + "…"
        this.poll()
      } catch {
        this.poll()
      }
    }, 2500)
  }

  advanceStep(upTo) {
    if (!this.hasStepsTarget) return
    const items = this.stepsTarget.querySelectorAll(".step-item")
    items.forEach((item, i) => {
      const icon  = item.querySelector(".step-icon")
      const label = item.querySelector(".step-label")
      if (i < upTo) {
        // completed
        icon.className  = "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 step-icon bg-indigo-600"
        icon.innerHTML  = `<svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`
        label.className = "text-sm text-indigo-700 font-medium step-label"
      } else if (i === upTo) {
        // active
        icon.className  = "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 step-icon bg-indigo-100"
        icon.innerHTML  = `<div class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>`
        label.className = "text-sm text-gray-800 font-medium step-label"
      } else {
        // pending
        icon.className  = "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 step-icon bg-gray-100"
        icon.innerHTML  = `<div class="w-1.5 h-1.5 rounded-full bg-gray-300"></div>`
        label.className = "text-sm text-gray-400 step-label"
      }
    })
  }
}
