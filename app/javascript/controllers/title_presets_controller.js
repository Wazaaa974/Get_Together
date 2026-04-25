import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input"]

  apply(e) {
    e.preventDefault()
    const value = e.currentTarget.dataset.value
    if (this.hasInputTarget && value != null) {
      this.inputTarget.value = value
      this.inputTarget.dispatchEvent(new Event("input", { bubbles: true }))
    }
  }
}
