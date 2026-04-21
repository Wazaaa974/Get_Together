import { Controller } from "@hotwired/stimulus"

// Simple toggle for the mobile navbar menu.
// Usage:
//   data-controller="mobile-nav"
//   data-mobile-nav-target="menu"   -> the panel to show/hide
//   data-action="click->mobile-nav#toggle"
export default class extends Controller {
  static targets = ["menu", "iconOpen", "iconClose"]

  toggle() {
    if (!this.hasMenuTarget) return
    const isHidden = this.menuTarget.classList.toggle("hidden")
    if (this.hasIconOpenTarget)  this.iconOpenTarget.classList.toggle("hidden", !isHidden)
    if (this.hasIconCloseTarget) this.iconCloseTarget.classList.toggle("hidden", isHidden)
  }

  close() {
    if (!this.hasMenuTarget) return
    this.menuTarget.classList.add("hidden")
    if (this.hasIconOpenTarget)  this.iconOpenTarget.classList.remove("hidden")
    if (this.hasIconCloseTarget) this.iconCloseTarget.classList.add("hidden")
  }
}
