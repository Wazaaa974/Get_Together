// New Trip screen — wizard-style card on sand background.
// Friendly, playful, but structured. Shows group building + dates + candidate cities.

function NewTrip({ accent }) {
  return (
    <div style={{ background: GT.sand, minHeight: '100%' }}>
      <NavBar accent={accent} compact crumb="New trip"/>
      <div style={{ maxWidth: 960, margin: '24px auto 80px', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 30 }}>
          <div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: GT.muted, letterSpacing: 1.2, textTransform: 'uppercase' }}>Step 1 of 2 — Your crew</div>
            <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 56, color: GT.forest, letterSpacing: -1.5, margin: '8px 0 0', lineHeight: 1 }}>
              Who's <span style={{ fontStyle: 'italic', color: accent }}>getting together?</span>
            </h1>
          </div>
          <Stamp label="Draft · GT-0481" tone="forest"/>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 20 }}>
          {/* LEFT — Title + participants */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Card title="Trip name">
              <input defaultValue="Eurotrip with the bootcamp crew"
                style={inputStyleBig(accent)}/>
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                {['Bachelor party', 'Family reunion', 'Startup retreat', 'Birthday weekend'].map(s =>
                  <Chip key={s} tone="white">{s}</Chip>)}
              </div>
            </Card>

            <Card title="Travelers" count={4}>
              <PersonRow name="Thomas" city="Paris · CDG" tone="ember" self/>
              <PersonRow name="Margot" city="Madrid · MAD" tone="forest"/>
              <PersonRow name="Bryan"  city="London · LHR" tone="sky"/>
              <PersonRow name="Lina"   city="Berlin · BER" tone="plum"/>
              <AddPersonRow accent={accent}/>
            </Card>
          </div>

          {/* RIGHT — Dates + Candidates */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Card title="When">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <DateBox label="Depart" dow="Fri" day="14" mo="May"/>
                <DateBox label="Return" dow="Tue" day="18" mo="May"/>
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['This weekend', 'Next month', 'Flexible ±3 days'].map(s =>
                  <Chip key={s} tone="sand">{s}</Chip>)}
              </div>
            </Card>

            <Card title="Candidate cities" count={5} subtitle="We'll price all of them.">
              {[
                ['Lisbon', 'PT'], ['Dublin', 'IE'], ['Brussels', 'BE'], ['Barcelona', 'ES'], ['Amsterdam', 'NL'],
              ].map(([c, cc]) =>
                <CityRow key={c} city={c} country={cc}/>)}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10, padding: '10px 12px', background: GT.sand, borderRadius: 12, border: `1px dashed ${GT.line}` }}>
                <Pin color={accent}/>
                <input placeholder="Add another city…" style={{ border: 'none', background: 'transparent', outline: 'none', fontFamily: FONT_TEXT, fontSize: 14, flex: 1, color: GT.ink }}/>
                <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: GT.muted, letterSpacing: 1 }}>⏎ ADD</span>
              </div>
            </Card>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 28 }}>
          <span style={{ fontFamily: FONT_TEXT, fontSize: 13, color: GT.muted }}>
            By continuing, we'll fetch live fares from Duffel.
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            <BtnGhost>Save as draft</BtnGhost>
            <BtnPrimary accent={accent}>Find the fair city →</BtnPrimary>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, count, subtitle, children }) {
  return (
    <div style={{ background: GT.white, border: `1px solid ${GT.line}`, borderRadius: 18, padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: GT.muted, letterSpacing: 1.2, textTransform: 'uppercase' }}>
          {title} {count != null && <span style={{ color: GT.forest, marginLeft: 6 }}>· {count}</span>}
        </div>
        {subtitle && <span style={{ fontFamily: FONT_TEXT, fontSize: 12, color: GT.muted }}>{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

function inputStyleBig(accent) {
  return {
    width: '100%', padding: '14px 0', border: 'none', borderBottom: `1.5px solid ${GT.line}`,
    background: 'transparent', fontFamily: FONT_DISPLAY, fontSize: 26, color: GT.forest,
    outline: 'none', letterSpacing: -0.5,
  };
}

function PersonRow({ name, city, tone, self }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: `1px dashed ${GT.line}` }}>
      <Avatar initials={name[0] + (name[1] || '').toUpperCase()} tone={tone}/>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FONT_TEXT, fontSize: 15, color: GT.ink, fontWeight: 500 }}>
          {name}
          {self && <span style={{ fontFamily: FONT_MONO, fontSize: 9, marginLeft: 8, color: GT.muted, letterSpacing: 1 }}>YOU</span>}
        </div>
        <div style={{ fontFamily: FONT_TEXT, fontSize: 12, color: GT.muted, marginTop: 2 }}>{city}</div>
      </div>
      <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: GT.muted, cursor: 'pointer' }}>EDIT</span>
    </div>
  );
}

function AddPersonRow({ accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 12px', marginTop: 10, background: GT.sand, borderRadius: 12, border: `1px dashed ${GT.line}` }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: `1.5px dashed ${accent}`, display: 'grid', placeItems: 'center', color: accent, fontSize: 20, fontFamily: FONT_DISPLAY }}>+</div>
      <input placeholder="Add a friend — name or invite link…" style={{ border: 'none', background: 'transparent', outline: 'none', fontFamily: FONT_TEXT, fontSize: 14, flex: 1, color: GT.ink }}/>
      <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: GT.muted, letterSpacing: 1 }}>📋 COPY LINK</span>
    </div>
  );
}

function CityRow({ city, country }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px dashed ${GT.line}` }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: GT.sand, display: 'grid', placeItems: 'center', fontFamily: FONT_MONO, fontSize: 10, color: GT.forest, letterSpacing: 1 }}>{country}</div>
      <div style={{ flex: 1, fontFamily: FONT_TEXT, fontSize: 15, color: GT.ink }}>{city}</div>
      <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: GT.muted, cursor: 'pointer' }}>✕</span>
    </div>
  );
}

function DateBox({ label, dow, day, mo }) {
  return (
    <div style={{ padding: 14, border: `1px solid ${GT.line}`, borderRadius: 12, background: GT.sand }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: GT.muted, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 6 }}>
        <span style={{ fontFamily: FONT_TEXT, fontSize: 12, color: GT.muted }}>{dow}</span>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 32, color: GT.forest, lineHeight: 1, letterSpacing: -1 }}>{day}</span>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: GT.forest, fontStyle: 'italic' }}>{mo}</span>
      </div>
    </div>
  );
}

Object.assign(window, { NewTrip });
