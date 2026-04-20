import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values  = { url: String, resultsUrl: String, tripUrl: String }
  static targets = ["statusText", "steps", "progressBar", "progressLabel"]

  connect() {
    this.step  = 0
    this.steps = [
      "Connexion aux APIs de vols",
      "Évaluation des destinations",
      "Calcul des scores et prix",
      "Classement final",
    ]
    // Progress checkpoints: [stepIndex, percentage]
    this.progressMap = [0, 15, 40, 70, 90]
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
          this.setProgress(100, "Résultats prêts !")
          this.advanceChips(this.steps.length)
          setTimeout(() => { window.location.href = this.resultsUrlValue }, 600)
          return
        }

        if (data.status === "failed") {
          if (this.hasStatusTextTarget) this.statusTextTarget.textContent = "Une erreur est survenue. Redirection…"
          setTimeout(() => { window.location.href = this.tripUrlValue }, 800)
          return
        }

        this.step = Math.min(this.step + 1, this.steps.length - 1)
        const pct = this.progressMap[this.step] || 90
        this.setProgress(pct, this.steps[this.step] + "…")
        this.advanceChips(this.step)
        this.poll()
      } catch {
        this.poll()
      }
    }, 2500)
  }

  setProgress(pct, label) {
    if (this.hasProgressBarTarget)
      this.progressBarTarget.style.width = `${pct}%`
    if (this.hasProgressLabelTarget)
      this.progressLabelTarget.textContent = `${pct}%`
    if (this.hasStatusTextTarget)
      this.statusTextTarget.textContent = label
  }

  advanceChips(upTo) {
    if (!this.hasStepsTarget) return
    const chips = this.stepsTarget.querySelectorAll("[data-step]")
    chips.forEach((chip, i) => {
      const status = chip.querySelector(".step-status")
      if (!status) return
      if (i < upTo) {
        chip.classList.remove("border-dashed", "border-gt-line")
        chip.classList.add("border-gt-forest/30", "bg-[#DDE7E1]")
        status.textContent = "✓"
        status.className = "step-status text-gt-forest font-medium"
      } else if (i === upTo) {
        chip.classList.add("border-gt-orange/40")
        status.textContent = "…"
        status.className = "step-status text-gt-orange animate-pulse"
      }
    })
  }
}
