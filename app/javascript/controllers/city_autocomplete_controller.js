import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "dropdown"]
  static values  = { token: String }

  connect() {
    this.token     = this.hasTokenValue ? this.tokenValue : document.querySelector('meta[name="mapbox-token"]')?.content
    this.debounce  = null
    this.active    = -1   // keyboard nav index
  }

  onInput() {
    clearTimeout(this.debounce)
    const q = this.inputTarget.value.trim()
    if (q.length < 2) { this.clear(); return }

    this.debounce = setTimeout(() => this.fetch(q), 280)
  }

  async fetch(query) {
    if (!this.token) return
    try {
      const url  = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json` +
                   `?access_token=${this.token}&types=place,locality&language=fr,en&limit=5&bbox=-30,25,55,75`
      const res  = await fetch(url)
      const data = await res.json()
      this.show(data.features || [])
    } catch { this.clear() }
  }

  show(features) {
    if (!features.length) { this.clear(); return }

    this.dropdownTarget.innerHTML = features.map((f, i) => `
      <li role="option"
          data-index="${i}"
          data-value="${f.place_name.split(",")[0]}"
          class="px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer flex items-center gap-2 transition-colors">
        <svg class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        </svg>
        <span>
          <span class="font-medium">${f.place_name.split(",")[0]}</span>
          <span class="text-gray-400 text-xs ml-1">${f.place_name.split(",").slice(1).join(",").trim()}</span>
        </span>
      </li>
    `).join("")

    this.dropdownTarget.classList.remove("hidden")
    this.active = -1
  }

  select(event) {
    const li = event.target.closest("li[data-value]")
    if (!li) return
    this.inputTarget.value = li.dataset.value
    this.clear()
    this.inputTarget.focus()
  }

  onKeydown(event) {
    const items = this.dropdownTarget.querySelectorAll("li")
    if (!items.length) return

    if (event.key === "ArrowDown") {
      event.preventDefault()
      this.active = Math.min(this.active + 1, items.length - 1)
      this.highlight(items)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      this.active = Math.max(this.active - 1, 0)
      this.highlight(items)
    } else if (event.key === "Enter" && this.active >= 0) {
      event.preventDefault()
      this.inputTarget.value = items[this.active].dataset.value
      this.clear()
    } else if (event.key === "Escape") {
      this.clear()
    }
  }

  highlight(items) {
    items.forEach((li, i) => {
      li.classList.toggle("bg-indigo-50", i === this.active)
      li.classList.toggle("text-indigo-700", i === this.active)
    })
  }

  onFocusOut(event) {
    // delay so click on dropdown fires first
    setTimeout(() => {
      if (!this.element.contains(document.activeElement)) this.clear()
    }, 150)
  }

  clear() {
    this.dropdownTarget.innerHTML = ""
    this.dropdownTarget.classList.add("hidden")
    this.active = -1
  }
}
