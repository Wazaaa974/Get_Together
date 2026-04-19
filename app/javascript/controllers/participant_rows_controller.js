import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["container", "template"]

  add(e) {
    e.preventDefault()
    const idx = Date.now()
    const html = this.templateTarget.innerHTML
      .replace(/NEW_IDX/g, idx)
    this.containerTarget.insertAdjacentHTML("beforeend", html)
  }

  remove(e) {
    e.preventDefault()
    e.currentTarget.closest("[data-participant-row]").remove()
  }
}
