import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { url: String, resultsUrl: String, tripUrl: String }
  static targets = ["bar", "statusText"]

  connect() {
    this.messages = [
      "Connexion aux APIs de vols…",
      "Évaluation des destinations européennes…",
      "Calcul des meilleurs prix pour le groupe…",
      "On y est presque…",
    ]
    this.msgIndex = 0
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
          this.statusTextTarget.textContent = "Résultats prêts ! Redirection…"
          window.location.href = this.resultsUrlValue
          return
        }

        if (data.status === "failed") {
          this.statusTextTarget.textContent = "Une erreur est survenue."
          window.location.href = this.tripUrlValue
          return
        }

        // Cycle through messages
        this.msgIndex = (this.msgIndex + 1) % this.messages.length
        this.statusTextTarget.textContent = this.messages[this.msgIndex]
        this.poll()
      } catch {
        this.poll()
      }
    }, 2500)
  }
}
