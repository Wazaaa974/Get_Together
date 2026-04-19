import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    token: String,
    participants: Array,
    results: Array,
    selected: Number
  }

  async connect() {
    if (typeof mapboxgl === "undefined") return

    mapboxgl.accessToken = this.tokenValue

    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/mapbox/light-v11",
      center: [10, 50],
      zoom: 3.5,
    })

    this.markers    = []
    this.routeIds   = []
    this.geocoded   = {}

    this.map.on("load", async () => {
      await this.geocodeParticipants()
      this.addDestinationMarkers()
      this.selectDestination(this.selectedValue)
    })

    this.element._stimulus_controller = this
  }

  disconnect() {
    this.map?.remove()
  }

  // Geocode participant city names via Mapbox API
  async geocodeParticipants() {
    const participants = this.participantsValue
    await Promise.all(participants.map(async (p) => {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(p.city)}.json?access_token=${this.tokenValue}&types=place&limit=1&bbox=-30,25,55,75`
      try {
        const res  = await fetch(url)
        const data = await res.json()
        if (data.features?.length > 0) {
          const [lng, lat] = data.features[0].center
          this.geocoded[p.city] = { lat, lng, name: p.name }

          // Add participant marker
          const el = document.createElement("div")
          el.className = "participant-marker"
          el.innerHTML = `<div class="w-9 h-9 rounded-full bg-white border-2 border-indigo-500 shadow-lg flex items-center justify-center text-sm font-bold text-indigo-600">${p.name[0].toUpperCase()}</div>`
          new mapboxgl.Marker({ element: el })
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup({ offset: 20 }).setHTML(`<strong>${p.name}</strong><br>${p.city}`))
            .addTo(this.map)
        }
      } catch (e) { /* ignore geocoding errors */ }
    }))
  }

  addDestinationMarkers() {
    this.resultsValue.forEach((result, i) => {
      if (!result.lat || !result.lng) return

      const el      = document.createElement("div")
      el.className  = "destination-marker cursor-pointer"
      el.dataset.index = i

      const rank    = i + 1
      const isFirst = rank === 1
      el.innerHTML  = `
        <div class="relative">
          <div class="w-10 h-10 rounded-full shadow-lg flex items-center justify-center font-bold text-sm transition-transform hover:scale-110 ${isFirst ? "bg-indigo-600 text-white" : "bg-white text-gray-700 border-2 border-gray-300"}">
            ${rank}
          </div>
          <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-medium text-gray-700 bg-white px-1.5 py-0.5 rounded shadow-sm">
            ${result.city_name}
          </div>
        </div>`

      el.addEventListener("click", () => {
        this.selectedValue = i
        this.selectDestination(i)
        // Dispatch event so result cards update
        this.dispatch("select", { detail: { index: i } })
      })

      new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([result.lng, result.lat])
        .addTo(this.map)
    })
  }

  selectDestination(index) {
    const result = this.resultsValue[index]
    if (!result?.lat) return

    this.clearRoutes()

    const dest = [result.lng, result.lat]

    // Fly to destination
    this.map.flyTo({ center: dest, zoom: 4.5, duration: 1200 })

    // Draw animated route from each participant to destination
    const participants = Object.values(this.geocoded)
    participants.forEach((p, i) => {
      const origin = [p.lng, p.lat]
      const routeId = `route-${i}`
      this.routeIds.push(routeId)

      const geojson = {
        type: "Feature",
        geometry: { type: "LineString", coordinates: [origin, dest] }
      }

      if (this.map.getSource(routeId)) {
        this.map.getSource(routeId).setData(geojson)
      } else {
        this.map.addSource(routeId, { type: "geojson", data: geojson })
      }

      if (!this.map.getLayer(routeId)) {
        this.map.addLayer({
          id: routeId,
          type: "line",
          source: routeId,
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": "#6366f1",
            "line-width": 2,
            "line-opacity": 0.7,
            "line-dasharray": [0, 4, 3]
          }
        })
      }

      // Animate dashes
      let step = 0
      const animate = () => {
        if (!this.routeIds.includes(routeId)) return
        step = (step + 1) % 10
        this.map.setPaintProperty(routeId, "line-dasharray", [step * 0.4, 4, 3])
        requestAnimationFrame(animate)
      }
      requestAnimationFrame(animate)
    })
  }

  clearRoutes() {
    this.routeIds.forEach(id => {
      if (this.map.getLayer(id)) this.map.removeLayer(id)
      if (this.map.getSource(id)) this.map.removeSource(id)
    })
    this.routeIds = []
  }
}
