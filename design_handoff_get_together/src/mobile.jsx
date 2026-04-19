// Mobile variant — single condensed frame showcasing key screens stacked.

function MobileFrame({ children, label }) {
  return (
    <div style={{ width: 320, height: 650, borderRadius: 38, background: '#1a1a1a', padding: 10, boxShadow: '0 30px 80px rgba(24,21,18,0.2)' }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 30, overflow: 'hidden', background: GT.sand, position: 'relative' }}>
        {/* status bar */}
        <div style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', fontFamily: FONT_TEXT, fontSize: 11, color: GT.ink, fontWeight: 600 }}>
          <span>9:41</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: GT.muted, letterSpacing: 1 }}>{label}</span>
          <span>●●● 􀙇</span>
        </div>
        <div style={{ height: 'calc(100% - 32px)', overflow: 'hidden' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function MobileLanding({ accent }) {
  return (
    <MobileFrame label="LANDING">
      <div style={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Logo accent={accent} size={16}/>
          <button style={{ padding: '6px 12px', borderRadius: 999, background: accent, color: '#fff', border: 'none', fontFamily: FONT_TEXT, fontSize: 11, fontWeight: 500 }}>Start</button>
        </div>
        <Chip tone="ember" style={{ marginTop: 22 }}>◉ Group travel, solved</Chip>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 42, lineHeight: 0.96, color: GT.forest, letterSpacing: -1.2, margin: '14px 0 0' }}>
          Where should <span style={{ fontStyle: 'italic', color: accent }}>all of you</span> meet?
        </h1>
        <p style={{ fontFamily: FONT_TEXT, fontSize: 13, color: GT.inkSoft, lineHeight: 1.5, marginTop: 12 }}>
          Drop in your crew. We find the city that's cheapest for everyone.
        </p>
        <div style={{ margin: '18px 0', textAlign: 'center' }}><Globe size={150}/></div>
        <button style={{ width: '100%', padding: 14, background: accent, color: '#fff', border: 'none', borderRadius: 14, fontFamily: FONT_TEXT, fontSize: 14, fontWeight: 500, boxShadow: `0 8px 20px ${accent}44` }}>Plan a trip →</button>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 20, fontFamily: FONT_TEXT, fontSize: 11, color: GT.muted }}>
          <span><b style={{ color: GT.forest, fontFamily: FONT_DISPLAY, fontSize: 16 }}>200+</b> cities</span>
          <span><b style={{ color: GT.forest, fontFamily: FONT_DISPLAY, fontSize: 16 }}>~30s</b> answer</span>
          <span><b style={{ color: GT.forest, fontFamily: FONT_DISPLAY, fontSize: 16 }}>Free</b></span>
        </div>
      </div>
    </MobileFrame>
  );
}

function MobileResults({ accent }) {
  return (
    <MobileFrame label="RESULTS">
      <div style={{ padding: 16, height: '100%', overflow: 'auto' }}>
        <div style={{
          borderRadius: 18, padding: 18, position: 'relative', overflow: 'hidden',
          background: `linear-gradient(150deg, ${GT.night} 0%, ${GT.forest} 100%)`, color: '#fff',
        }}>
          <div style={{ position: 'absolute', right: -30, top: -30, width: 120, height: 120, borderRadius: '50%',
            background: `radial-gradient(circle, ${accent}66 0%, transparent 70%)` }}/>
          <div style={{ position: 'relative' }}>
            <Chip tone="dark">★ Best fit</Chip>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.7, marginTop: 10 }}>Meet in</div>
            <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 60, letterSpacing: -2, margin: '2px 0', lineHeight: 0.95 }}>
              Lisbon<span style={{ color: accent }}>.</span>
            </h1>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontStyle: 'italic', opacity: 0.8 }}>Portugal · LIS</div>
            <div style={{ display: 'flex', gap: 16, marginTop: 14 }}>
              <div><div style={{ fontSize: 9, opacity: 0.65, fontFamily: FONT_MONO, letterSpacing: 1 }}>TOTAL</div><div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontStyle: 'italic' }}>€164</div></div>
              <div><div style={{ fontSize: 9, opacity: 0.65, fontFamily: FONT_MONO, letterSpacing: 1 }}>PER PERSON</div><div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontStyle: 'italic' }}>€41</div></div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 12, background: GT.white, border: `1px solid ${GT.line}`, borderRadius: 14, padding: 14 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: GT.muted, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 }}>Fare breakdown</div>
          {[
            ['Thomas', 'CDG', '€42', 'ember'],
            ['Margot', 'MAD', '€28', 'forest'],
            ['Bryan', 'LHR', '€61', 'sky'],
            ['Lina', 'BER', '€33', 'plum'],
          ].map(([n, ap, p, tone], i) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: i < 3 ? `1px dashed ${GT.line}` : 'none' }}>
              <Avatar initials={n[0]+n[1]} tone={tone} size={28}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: FONT_TEXT, fontSize: 12, color: GT.ink, fontWeight: 500 }}>{n}</div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: GT.muted }}>{ap} → LIS</div>
              </div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 16, fontStyle: 'italic', color: accent }}>{p}</div>
            </div>
          ))}
        </div>

        <button style={{ width: '100%', marginTop: 12, padding: 12, background: accent, color: '#fff', border: 'none', borderRadius: 12, fontFamily: FONT_TEXT, fontSize: 13, fontWeight: 500 }}>Book on Google Flights →</button>
      </div>
    </MobileFrame>
  );
}

Object.assign(window, { MobileFrame, MobileLanding, MobileResults });
