import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["start", "end"]

  connect() {
    const { fri, mon } = this.#nextWeekend()
    if (!this.startTarget.value) this.startTarget.value = this.#fmt(fri)
    if (!this.endTarget.value)   this.endTarget.value   = this.#fmt(mon)
  }

  weekend(e) {
    e.preventDefault()
    const { fri, mon } = this.#nextWeekend()
    this.startTarget.value = this.#fmt(fri)
    this.endTarget.value   = this.#fmt(mon)
  }

  nextMonth(e) {
    e.preventDefault()
    const { fri, mon } = this.#firstWeekendNextMonth()
    this.startTarget.value = this.#fmt(fri)
    this.endTarget.value   = this.#fmt(mon)
  }

  // ── private ──────────────────────────────────────────────

  #nextWeekend() {
    const today = new Date()
    const day   = today.getDay() // 0=Sun … 6=Sat
    // days until next Friday (5). If today is Fri/Sat/Sun push to next week's Fri.
    const daysToFri = day <= 4 ? (5 - day) : (12 - day)
    const fri = new Date(today)
    fri.setDate(today.getDate() + daysToFri)
    const mon = new Date(fri)
    mon.setDate(fri.getDate() + 3)
    return { fri, mon }
  }

  #firstWeekendNextMonth() {
    const today     = new Date()
    const firstOfNM = new Date(today.getFullYear(), today.getMonth() + 1, 1)
    const day       = firstOfNM.getDay()
    const daysToFri = day <= 5 ? (5 - day) : (12 - day)
    const fri       = new Date(firstOfNM)
    fri.setDate(1 + (daysToFri < 0 ? daysToFri + 7 : daysToFri))
    const mon = new Date(fri)
    mon.setDate(fri.getDate() + 3)
    return { fri, mon }
  }

  #fmt(date) {
    return date.toISOString().slice(0, 10)
  }
}
