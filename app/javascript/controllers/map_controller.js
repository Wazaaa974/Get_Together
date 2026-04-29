import { Controller } from "@hotwired/stimulus"

// GT brand tokens (mirror DESIGN_SYSTEM.md)
const GT = {
  orange:       "#E8632A",
  orangeLight:  "#FDF0E8",
  orangeDark:   "#B54A1A",
  forest:       "#2D4A3E",
  forestLight:  "#4A7A65",
  sand:         "#F5F0E8",
  sandDark:     "#E8E0D0",
  muted:        "#8A8070",
  ink:          "#181512",
  white:        "#FEFCF8",
  line:         "#E8DFD0",
}

// Avatar tones, cycled per participant
const AVATAR_TONES = [
  { bg: GT.orangeLight, fg: GT.orangeDark, border: GT.orange },
  { bg: "#DDE7E1",      fg: GT.forest,     border: GT.forest },
  { bg: "#DCE8F1",      fg: "#3A6B92",     border: "#3A6B92" },
  { bg: "#EADCF0",      fg: "#7A3F8F",     border: "#7A3F8F" },
  { bg: GT.sandDark,    fg: GT.ink,        border: GT.muted },
]

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
      attributionControl: false,
    })
    this.map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right")

    this.markers      = []
    this.routeIds     = []
    this.planeIds     = []
    this.geocoded     = {}
    this._animFrames  = []

    this.map.on("load", async () => {
      this.applyBrandStyle()
      await this.loadPlaneSprite()
      await this.geocodeParticipants()
      this.addDestinationMarkers()
      this.selectDestination(this.selectedValue)
    })

    this.element._stimulus_controller = this
  }

  disconnect() {
    this._animFrames.forEach(id => cancelAnimationFrame(id))
    this.map?.remove()
  }

  // 1. ── Custom map style: warm sand/forest palette ─────────────────────
  applyBrandStyle() {
    const safe = (id, prop, val) => {
      if (this.map.getLayer(id)) {
        try { this.map.setPaintProperty(id, prop, val) } catch (e) {}
      }
    }
    safe("background", "background-color", GT.sand)
    safe("land", "background-color", GT.sand)
    safe("landcover", "fill-color", GT.sandDark)
    safe("national-park", "fill-color", "#DDE7E1")
    safe("water", "fill-color", "#E0D9C8")
    safe("waterway", "line-color", "#E0D9C8")
    safe("admin-0-boundary", "line-color", GT.muted)
    safe("admin-0-boundary", "line-opacity", 0.4)
    safe("admin-1-boundary", "line-opacity", 0.15)
    safe("road-primary", "line-color", "#EFE7D6")
    safe("road-secondary-tertiary", "line-color", "#EFE7D6")
    safe("road-street", "line-opacity", 0)
    safe("road-minor", "line-opacity", 0)
    ;["country-label", "state-label", "settlement-major-label", "settlement-minor-label"]
      .forEach(id => {
        safe(id, "text-color", GT.forest)
        safe(id, "text-halo-color", GT.sand)
        safe(id, "text-halo-width", 1.5)
      })
  }

  // 2. ── Plane sprite (SVG → image, registered with Mapbox) ─────────────
  async loadPlaneSprite() {
    if (this.map.hasImage("gt-plane")) return
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M3 12 L21 5 L15 12 L21 19 Z M3 12 L9 10 L11 12 L9 14 Z" fill="${GT.orange}" stroke="${GT.white}" stroke-width="0.6" stroke-linejoin="round"/></svg>`
    const img = new Image(32, 32)
    img.src = "data:image/svg+xml;base64," + btoa(svg)
    await new Promise(r => { img.onload = r })
    this.map.addImage("gt-plane", img, { pixelRatio: 2 })
  }

  // ── Participants: avatar markers in brand style ───────────────────────
  async geocodeParticipants() {
    const participants = this.participantsValue
    await Promise.all(participants.map(async (p, idx) => {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(p.city)}.json?access_token=${this.tokenValue}&types=place&limit=1&bbox=-30,25,55,75`
      try {
        const res  = await fetch(url)
        const data = await res.json()
        if (data.features?.length > 0) {
          const [lng, lat] = data.features[0].center
          this.geocoded[p.city] = { lat, lng, name: p.name }

          const tone = AVATAR_TONES[idx % AVATAR_TONES.length]
          const el = document.createElement("div")
          el.className = "gt-participant-marker"
          el.innerHTML = `
            <div style="position:relative;">
              <div style="
                width:36px;height:36px;border-radius:50%;
                background:${tone.bg};color:${tone.fg};
                border:2px solid ${GT.white};
                box-shadow:0 0 0 1.5px ${tone.border}, 0 6px 18px rgba(24,21,18,0.18);
                display:grid;place-items:center;
                font-family:'Inter',system-ui,sans-serif;
                font-size:13px;font-weight:600;letter-spacing:-0.2px;
              ">${p.name[0].toUpperCase()}</div>
            </div>`

          new mapboxgl.Marker({ element: el })
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup({ offset: 22, className: "gt-popup" })
              .setHTML(`<div style="font-family:'Fraunces',serif;font-size:16px;color:${GT.forest};">${p.name}</div><div style="font-family:'Inter',sans-serif;font-size:12px;color:${GT.muted};margin-top:2px;">${p.city}</div>`))
            .addTo(this.map)
        }
      } catch (e) { /* ignore */ }
    }))
  }

  // 3. ── Destination markers: rank ribbon, halo + star on #1 ────────────
  addDestinationMarkers() {
    this.resultsValue.forEach((result, i) => {
      if (!result.lat || !result.lng) return
      const rank    = i + 1
      const isFirst = rank === 1
      const isPodium = rank <= 3

      const el = document.createElement("div")
      el.className = "gt-destination-marker"
      el.style.cursor = "pointer"
      el.dataset.index = i

      const ringColor   = isFirst ? GT.orange : isPodium ? GT.forestLight : GT.muted
      const fillColor   = isFirst ? GT.orange : GT.white
      const textColor   = isFirst ? GT.white  : (isPodium ? GT.forest : GT.muted)

      const haloHTML = isFirst ? `
        <span style="position:absolute;inset:-14px;border-radius:50%;
          background:${GT.orange};opacity:0.25;animation:gt-pulse-ring 2.4s ease-out infinite;"></span>
        <span style="position:absolute;inset:-8px;border-radius:50%;
          background:${GT.orange};opacity:0.35;animation:gt-pulse-ring 2.4s ease-out infinite .6s;"></span>` : ""

      const starHTML = isFirst ? `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="${GT.white}"
             style="position:absolute;top:-6px;right:-6px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.25));">
          <path d="M12 2 L14.6 8.6 L21.6 9.2 L16.3 13.7 L18 20.5 L12 16.8 L6 20.5 L7.7 13.7 L2.4 9.2 L9.4 8.6 Z"/>
        </svg>` : ""

      const labelHTML = isFirst ? `
        <div style="
          position:absolute;left:50%;top:calc(100% + 12px);transform:translateX(-50%);
          background:${GT.white};border:1px solid ${GT.line};border-radius:10px;
          padding:6px 10px 8px;white-space:nowrap;
          box-shadow:0 8px 22px rgba(24,21,18,0.12);
          font-family:'Inter',system-ui,sans-serif;
        ">
          <div style="font-family:'JetBrains Mono',ui-monospace,monospace;font-size:9px;letter-spacing:1.4px;
                      text-transform:uppercase;color:${GT.orangeDark};font-weight:600;">★ Best fit</div>
          <div style="font-family:'Fraunces',serif;font-size:15px;color:${GT.forest};line-height:1.1;margin-top:2px;">
            ${result.city_name}
          </div>
          ${result.total_price ? `<div style="font-family:'Fraunces',serif;font-style:italic;font-size:14px;color:${GT.orange};margin-top:2px;">€${result.total_price}</div>` : ""}
        </div>` : `
        <div style="
          position:absolute;left:50%;top:calc(100% + 6px);transform:translateX(-50%);
          background:${GT.white};border:1px solid ${GT.line};border-radius:6px;
          padding:2px 6px;white-space:nowrap;
          font-family:'Inter',system-ui,sans-serif;font-size:11px;color:${GT.forest};
          box-shadow:0 2px 6px rgba(24,21,18,0.08);
        ">${result.city_name}</div>`

      el.innerHTML = `
        <div style="position:relative;">
          ${haloHTML}
          <div style="
            width:${isFirst ? 44 : 34}px;height:${isFirst ? 44 : 34}px;
            border-radius:50%;background:${fillColor};color:${textColor};
            border:2px solid ${isFirst ? GT.white : ringColor};
            box-shadow:0 0 0 ${isFirst ? "2.5px" : "0"} ${ringColor}, 0 6px 18px rgba(24,21,18,0.16);
            display:grid;place-items:center;
            font-family:'Fraunces',serif;font-size:${isFirst ? 18 : 14}px;font-weight:500;
            transition:transform .18s ease;position:relative;
          " class="gt-dest-pin">${rank}</div>
          ${starHTML}
          ${labelHTML}
        </div>`

      el.addEventListener("mouseenter", () => {
        el.querySelector(".gt-dest-pin").style.transform = "scale(1.12)"
      })
      el.addEventListener("mouseleave", () => {
        el.querySelector(".gt-dest-pin").style.transform = ""
      })
      el.addEventListener("click", () => {
        this.selectedValue = i
        this.selectDestination(i)
        this.dispatch("select", { detail: { index: i } })
      })

      new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat([result.lng, result.lat])
        .addTo(this.map)
    })
  }

  // 4. ── Routes: solid orange for winner, dashed forest for the rest ────
  // 5. ── Animated planes gliding along the routes ───────────────────────
  selectDestination(index) {
    const result = this.resultsValue[index]
    if (!result?.lat) return

    this.clearRoutes()
    const dest    = [result.lng, result.lat]
    const isWinner = index === 0

    const participants = Object.values(this.geocoded)
    if (participants.length) {
      const bounds = new mapboxgl.LngLatBounds()
      bounds.extend(dest)
      participants.forEach(p => bounds.extend([p.lng, p.lat]))
      this.map.fitBounds(bounds, { padding: 80, duration: 1200, maxZoom: 5.5 })
    } else {
      this.map.flyTo({ center: dest, zoom: 4.5, duration: 1200 })
    }

    participants.forEach((p, i) => {
      const origin   = [p.lng, p.lat]
      const routeId  = `route-${i}`
      const planeId  = `plane-${i}`
      const tone     = AVATAR_TONES[i % AVATAR_TONES.length]

      const arc = this.curveBetween(origin, dest, 32)

      const geojson = { type: "Feature", geometry: { type: "LineString", coordinates: arc } }
      this.routeIds.push(routeId)
      this.planeIds.push(planeId)

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
            "line-color": isWinner ? GT.orange : tone.border,
            "line-width": isWinner ? 2.5 : 1.5,
            "line-opacity": isWinner ? 0.85 : 0.55,
            "line-dasharray": isWinner ? [1, 0] : [0, 2, 3],
          }
        })
      }

      const planeFeature = {
        type: "Feature",
        geometry: { type: "Point", coordinates: arc[0] },
        properties: { bearing: this.bearing(arc[0], arc[1]) },
      }
      if (this.map.getSource(planeId)) {
        this.map.getSource(planeId).setData(planeFeature)
      } else {
        this.map.addSource(planeId, { type: "geojson", data: planeFeature })
      }
      if (!this.map.getLayer(planeId)) {
        this.map.addLayer({
          id: planeId,
          type: "symbol",
          source: planeId,
          layout: {
            "icon-image": "gt-plane",
            "icon-size": isWinner ? 0.85 : 0.6,
            "icon-rotate": ["get", "bearing"],
            "icon-rotation-alignment": "map",
            "icon-allow-overlap": true,
            "icon-ignore-placement": true,
          },
          paint: { "icon-opacity": isWinner ? 1 : 0.7 }
        })
      }

      const duration = 5200
      const start = performance.now() + i * 250
      const tick = (now) => {
        const elapsed = (now - start) % (duration + 600)
        if (elapsed < 0) {
          this._animFrames.push(requestAnimationFrame(tick))
          return
        }
        const t = Math.min(1, elapsed / duration)
        const idx = Math.min(arc.length - 1, Math.floor(t * (arc.length - 1)))
        const next = Math.min(arc.length - 1, idx + 1)
        const here = arc[idx], there = arc[next]

        const src = this.map.getSource(planeId)
        if (src) {
          src.setData({
            type: "Feature",
            geometry: { type: "Point", coordinates: here },
            properties: { bearing: this.bearing(here, there) },
          })
        }

        if (!isWinner && this.map.getLayer(routeId)) {
          const step = (now / 80) % 10
          this.map.setPaintProperty(routeId, "line-dasharray", [step * 0.4, 4, 3])
        }

        this._animFrames.push(requestAnimationFrame(tick))
      }
      this._animFrames.push(requestAnimationFrame(tick))
    })
  }

  clearRoutes() {
    this._animFrames.forEach(id => cancelAnimationFrame(id))
    this._animFrames = []
    ;[...this.routeIds, ...this.planeIds].forEach(id => {
      if (this.map.getLayer(id))  this.map.removeLayer(id)
      if (this.map.getSource(id)) this.map.removeSource(id)
    })
    this.routeIds = []
    this.planeIds = []
  }

  curveBetween(a, b, steps = 32) {
    const dx = b[0] - a[0], dy = b[1] - a[1]
    const dist = Math.sqrt(dx * dx + dy * dy)
    const mx = (a[0] + b[0]) / 2
    const my = (a[1] + b[1]) / 2
    const nx = -dy / dist, ny = dx / dist
    const lift = Math.min(dist * 0.22, 6)
    const cx = mx + nx * lift
    const cy = my + ny * lift
    const pts = []
    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      const x = (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * cx + t * t * b[0]
      const y = (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * cy + t * t * b[1]
      pts.push([x, y])
    }
    return pts
  }

  bearing(a, b) {
    const toRad = d => d * Math.PI / 180
    const toDeg = r => r * 180 / Math.PI
    const φ1 = toRad(a[1]), φ2 = toRad(b[1])
    const Δλ = toRad(b[0] - a[0])
    const y = Math.sin(Δλ) * Math.cos(φ2)
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)
    return (toDeg(Math.atan2(y, x)) + 360) % 360
  }
}
