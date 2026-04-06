import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["map", "button"]

  connect() {
    // Start collapsed on small screens
    if (window.innerWidth < 640) {
      this.mapTarget.classList.add("hidden")
      this.buttonTarget.textContent = "Voir la carte"
    }
  }

  toggle() {
    const hidden = this.mapTarget.classList.toggle("hidden")
    this.buttonTarget.textContent = hidden ? "Voir la carte" : "Masquer la carte"
  }
}
