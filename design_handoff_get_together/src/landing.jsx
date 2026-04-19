// Landing page — editorial, playful. Apple-keynote display type × Airbnb warmth.
// Three hero variants: "Keynote" (big headline), "Boarding Pass" (ticket motif), "Globe" (centered sphere).

function SearchWidget({ accent }) {
  const Field = ({ label, value, placeholder, flex = 1, divider = true }) => (
    <div style={{ flex, padding: '14px 22px', position: 'relative' }}>
      <div style={{ fontFamily: FONT_TEXT, fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', color: GT.muted }}>{label}</div>
      <div style={{ fontFamily: FONT_TEXT, fontSize: 14, color: value ? GT.ink : GT.muted, marginTop: 2 }}>{value || placeholder}</div>
      {divider && <div style={{ position: 'absolute', right: 0, top: 12, bottom: 12, width: 1, background: GT.line }}/>}
    </div>
  );
  return (
    <div style={{
      background: '#fff', borderRadius: 999, border: `1px solid ${GT.line}`,
      display: 'flex', alignItems: 'center', padding: 6,
      boxShadow: '0 14px 40px rgba(24,21,18,0.08)', maxWidth: 720,
    }}>
      <Field label="Friends" value="4 people" />
      <Field label="From" value="Paris · Madrid · London · Berlin" flex={1.4}/>
      <Field label="When" value="May 14 → 18" divider={false}/>
      <div style={{ padding: 4 }}>
        <button style={{
          background: accent, color: '#fff', border: 'none', borderRadius: 999,
          width: 52, height: 52, cursor: 'pointer', display: 'grid', placeItems: 'center',
          boxShadow: `0 8px 20px ${accent}44`,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        </button>
      </div>
    </div>
  );
}

function HeroKeynote({ accent }) {
  return (
    <section style={{ padding: '56px 64px 72px', position: 'relative' }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        <Chip tone="ember">◉ Now booking · Spring 2026</Chip>
        <Chip tone="white">3,840 groups met this month</Chip>
      </div>
      <h1 style={{
        fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 88, lineHeight: 0.95,
        color: GT.forest, margin: 0, letterSpacing: -2.5, maxWidth: 980,
      }}>
        Where should{' '}
        <span style={{ fontStyle: 'italic', color: accent }}>all of you</span>{' '}
        actually meet?
      </h1>
      <p style={{ fontFamily: FONT_TEXT, fontSize: 19, lineHeight: 1.5, color: GT.inkSoft, maxWidth: 560, marginTop: 24 }}>
        Drop in your crew and their cities. We compare real flight prices from every door and hand you the one place that's cheapest <em style={{ color: accent, fontStyle: 'italic' }}>for everyone</em>.
      </p>
      <div style={{ marginTop: 40 }}>
        <SearchWidget accent={accent}/>
      </div>
      <div style={{ display: 'flex', gap: 36, marginTop: 40, fontFamily: FONT_TEXT, fontSize: 13, color: GT.inkSoft }}>
        <Metric n="200+" label="destinations"/>
        <Divider style={{ width: 1, height: 32, borderTop: 0, borderLeft: `1px solid ${GT.line}` }}/>
        <Metric n="~30s" label="to a fair answer"/>
        <Divider style={{ width: 1, height: 32, borderTop: 0, borderLeft: `1px solid ${GT.line}` }}/>
        <Metric n="Free" label="no signup needed"/>
      </div>

      {/* Floating ornament — boarding-pass corner */}
      <div style={{ position: 'absolute', top: 80, right: 64, transform: 'rotate(6deg)' }}>
        <MiniTicket accent={accent}/>
      </div>
    </section>
  );
}

function Metric({ n, label }) {
  return (
    <div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: GT.forest, fontStyle: 'italic' }}>{n}</div>
      <div style={{ color: GT.muted, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function MiniTicket({ accent }) {
  return (
    <div style={{
      width: 260, background: GT.white, border: `1px solid ${GT.line}`, borderRadius: 14,
      overflow: 'hidden', boxShadow: '0 20px 50px rgba(24,21,18,0.08)',
      fontFamily: FONT_TEXT,
    }}>
      <div style={{ padding: '14px 18px', background: GT.forest, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.5 }}>BOARDING</span>
        <Plane size={16} color="#fff"/>
      </div>
      <div style={{ padding: '18px 18px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: GT.muted, letterSpacing: 1, textTransform: 'uppercase' }}>From</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: GT.forest, lineHeight: 1 }}>CDG</div>
        </div>
        <div style={{ flex: 1.5, borderBottom: `1px dashed ${GT.line}`, position: 'relative', margin: '0 4px 8px' }}>
          <Plane size={14} color={accent} style={{ position: 'absolute', right: -4, top: -7 }}/>
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: GT.muted, letterSpacing: 1, textTransform: 'uppercase' }}>To</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: GT.forest, lineHeight: 1 }}>LIS</div>
        </div>
      </div>
      <div style={{ padding: '0 18px 16px', display: 'flex', justifyContent: 'space-between', fontSize: 11, color: GT.muted }}>
        <span>Group of 4</span>
        <span style={{ color: accent, fontWeight: 600 }}>€184 total</span>
      </div>
    </div>
  );
}

function HeroBoardingPass({ accent }) {
  return (
    <section style={{ padding: '64px 64px 72px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 64, alignItems: 'center' }}>
      <div>
        <Chip tone="ember" style={{ marginBottom: 22 }}>No more group-chat chaos</Chip>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 76, lineHeight: 0.96, color: GT.forest, margin: 0, letterSpacing: -2 }}>
          One ticket, <span style={{ fontStyle: 'italic', color: accent }}>five friends,</span> one fair city.
        </h1>
        <p style={{ fontFamily: FONT_TEXT, fontSize: 18, color: GT.inkSoft, marginTop: 20, lineHeight: 1.55, maxWidth: 480 }}>
          Get Together compares flight prices from every person's city and picks the destination where nobody gets screwed.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 30 }}>
          <BtnPrimary accent={accent}>Plan a trip →</BtnPrimary>
          <BtnGhost>See how it works</BtnGhost>
        </div>
      </div>
      <div style={{ position: 'relative', height: 420 }}>
        <div style={{ position: 'absolute', top: 20, left: 20, transform: 'rotate(-6deg)' }}><MiniTicket accent={accent}/></div>
        <div style={{ position: 'absolute', top: 110, right: 10, transform: 'rotate(4deg)' }}><MiniTicket accent={GT.forest}/></div>
        <div style={{ position: 'absolute', bottom: 30, left: 60, transform: 'rotate(-2deg)' }}><MiniTicket accent={accent}/></div>
      </div>
    </section>
  );
}

function HeroGlobe({ accent }) {
  return (
    <section style={{ padding: '48px 64px 56px', textAlign: 'center', position: 'relative' }}>
      <Chip tone="ember" style={{ marginBottom: 22 }}>◉ Group travel, solved</Chip>
      <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 92, lineHeight: 0.95, color: GT.forest, margin: '0 auto', letterSpacing: -2.8, maxWidth: 900 }}>
        The world is <span style={{ fontStyle: 'italic', color: accent }}>smaller</span><br/>when you split it fairly.
      </h1>
      <div style={{ margin: '36px auto 28px' }}><Globe size={220}/></div>
      <div style={{ display: 'inline-flex' }}><SearchWidget accent={accent}/></div>
    </section>
  );
}

function HowItWorks({ accent }) {
  const steps = [
    { n: '01', t: 'Gather your people', d: 'One tap. One link. Everyone drops in their home airport.' },
    { n: '02', t: 'We price every option', d: 'Real Duffel fares, from every origin, to every candidate — simultaneously.' },
    { n: '03', t: 'One honest answer', d: 'The city where the total ticket cost is lowest, with a full per-person breakdown.' },
  ];
  return (
    <section style={{ padding: '72px 64px', background: GT.white, borderTop: `1px solid ${GT.line}`, borderBottom: `1px solid ${GT.line}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 36 }}>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 44, color: GT.forest, margin: 0, letterSpacing: -1 }}>
          Three steps. <span style={{ fontStyle: 'italic', color: accent }}>No spreadsheet.</span>
        </h2>
        <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: GT.muted, letterSpacing: 1.5, textTransform: 'uppercase' }}>— How it works</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
        {steps.map(s => (
          <div key={s.n} style={{ padding: 28, border: `1px solid ${GT.line}`, borderRadius: 18, background: GT.sand, position: 'relative' }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 52, color: accent, fontStyle: 'italic', lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: GT.forest, marginTop: 18, letterSpacing: -0.4 }}>{s.t}</div>
            <div style={{ fontFamily: FONT_TEXT, fontSize: 14, color: GT.inkSoft, marginTop: 10, lineHeight: 1.55 }}>{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DestStrip({ accent }) {
  const dests = [
    { c: 'Lisbon', p: '€164', rank: 1 },
    { c: 'Dublin', p: '€184' },
    { c: 'Brussels', p: '€196' },
    { c: 'Barcelona', p: '€211' },
    { c: 'Amsterdam', p: '€224' },
    { c: 'Berlin', p: '€238' },
  ];
  return (
    <section style={{ padding: '56px 64px 80px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 36, color: GT.forest, margin: 0, letterSpacing: -0.8 }}>
          Popular meet-ups <span style={{ fontStyle: 'italic', color: GT.muted }}>this week</span>
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
        {dests.map((d, i) => (
          <div key={i} style={{
            aspectRatio: '3/4', borderRadius: 16, padding: 16,
            background: d.rank === 1
              ? `linear-gradient(170deg, ${accent} 0%, ${GT.orangeDark} 100%)`
              : GT.white,
            color: d.rank === 1 ? '#fff' : GT.forest,
            border: d.rank === 1 ? 'none' : `1px solid ${GT.line}`,
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* placeholder image — monospace explainer */}
            <div style={{ position: 'absolute', inset: 0, opacity: d.rank === 1 ? 0.15 : 0.5,
              background: `repeating-linear-gradient(135deg, ${d.rank === 1 ? '#fff2' : GT.sandDark} 0 8px, transparent 8px 16px)` }}/>
            <div style={{ position: 'relative', fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1, opacity: 0.8 }}>
              {d.rank === 1 ? '★ BEST FIT' : `#${i + 1}`}
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: -0.4 }}>{d.c}</div>
              <div style={{ fontFamily: FONT_TEXT, fontSize: 13, opacity: 0.85, marginTop: 2 }}>{d.p} total</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Landing({ accent, variant = 'keynote' }) {
  return (
    <div style={{ background: GT.sand, minHeight: '100%' }}>
      <NavBar accent={accent}/>
      {variant === 'keynote' && <HeroKeynote accent={accent}/>}
      {variant === 'boarding' && <HeroBoardingPass accent={accent}/>}
      {variant === 'globe' && <HeroGlobe accent={accent}/>}
      <HowItWorks accent={accent}/>
      <DestStrip accent={accent}/>
      <Footer/>
    </div>
  );
}

function NavBar({ accent, compact, title, crumb }) {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '22px 64px', background: 'transparent',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <Logo accent={accent}/>
        {crumb && <>
          <span style={{ color: GT.muted, fontFamily: FONT_TEXT, fontSize: 14 }}>/</span>
          <span style={{ color: GT.inkSoft, fontFamily: FONT_TEXT, fontSize: 14, fontWeight: 500 }}>{crumb}</span>
        </>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {!compact && <>
          <a style={{ ...navLinkS }}>How it works</a>
          <a style={{ ...navLinkS }}>Popular cities</a>
          <a style={{ ...navLinkS }}>Sign in</a>
        </>}
        <BtnPrimary accent={accent} style={{ padding: '10px 18px', fontSize: 13 }}>Plan a trip</BtnPrimary>
      </div>
    </nav>
  );
}

const navLinkS = { padding: '8px 12px', fontFamily: FONT_TEXT, fontSize: 14, color: GT.inkSoft, cursor: 'pointer' };

function Footer() {
  return (
    <footer style={{ padding: '40px 64px', background: GT.night, color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Logo color="#fff" accent={GT.orange} size={18}/>
        <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: '#fff8', letterSpacing: 1 }}>© 2026 · MADE FOR FRIENDS</span>
      </div>
    </footer>
  );
}

Object.assign(window, { Landing, NavBar, Footer, MiniTicket, SearchWidget });
