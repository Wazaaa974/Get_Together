import { Controller } from "@hotwired/stimulus"

const CHECK_SVG = '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>'

export default class extends Controller {
  static targets = ["container", "template"]

  connect() {
    this.containerTarget.addEventListener("input", this.onRowInput)
    this.containerTarget.querySelectorAll("[data-participant-row]").forEach(r => this.refreshRow(r))
  }

  disconnect() {
    this.containerTarget.removeEventListener("input", this.onRowInput)
  }

  add(e) {
    e.preventDefault()
    const idx = Date.now()
    const html = this.templateTarget.innerHTML.replace(/NEW_IDX/g, idx)
    this.containerTarget.insertAdjacentHTML("beforeend", html)
    const row = this.containerTarget.lastElementChild
    this.refreshRow(row)
    row.querySelector("input")?.focus()
  }

  remove(e) {
    e.preventDefault()
    e.currentTarget.closest("[data-participant-row]").remove()
  }

  onRowInput = (e) => {
    const row = e.target.closest("[data-participant-row]")
    if (row) this.refreshRow(row)
  }

  refreshRow(row) {
    const inputs = row.querySelectorAll('input[type="text"]')
    const valid  = inputs.length >= 2 && [...inputs].slice(0, 2).every(i => i.value.trim().length > 0)
    const wasValid = row.dataset.valid === "true"
    if (valid === wasValid) return

    row.dataset.valid = valid ? "true" : "false"
    const avatar = row.querySelector(".w-8.h-8.rounded-full")

    if (valid) {
      row.classList.remove("bg-gt-sand", "border-gt-line")
      row.classList.add("bg-[#E8F2EC]", "border-gt-forest-light", "shadow-[0_0_0_3px_rgba(74,122,101,0.08)]")
      if (avatar) {
        avatar.classList.remove("bg-gt-orange-light", "text-gt-orange")
        avatar.classList.add("bg-gt-forest", "text-white")
        avatar.innerHTML = CHECK_SVG
        avatar.animate(
          [{ transform: "scale(1)" }, { transform: "scale(1.18)" }, { transform: "scale(1)" }],
          { duration: 260, easing: "ease-out" }
        )
      }
    } else {
      row.classList.add("bg-gt-sand", "border-gt-line")
      row.classList.remove("bg-[#E8F2EC]", "border-gt-forest-light", "shadow-[0_0_0_3px_rgba(74,122,101,0.08)]")
      if (avatar) {
        avatar.classList.add("bg-gt-orange-light", "text-gt-orange")
        avatar.classList.remove("bg-gt-forest", "text-white")
        avatar.innerHTML = "g"
      }
    }
  }
}
