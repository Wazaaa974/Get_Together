// Dashboard (trip show) + Waiting + Results

function Dashboard({ accent }) {
  return (
    <div style={{ background: GT.sand, minHeight: '100%' }}>
      <NavBar accent={accent} compact crumb="Eurotrip / Spring"/>
      <TripHeader accent={accent}/>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 32px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <PeoplePanel/>
            <SharePanel accent={accent}/>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <CandidatesPanel accent={accent}/>
            <GoPanel accent={accent}/>
          </div>
        </div>
      </div>
    </div>
  );
}

function TripHeader({ accent }) {
  return (
    <div style={{
      margin: '0 32px', borderRadius: 22, overflow: 'hidden',
      background: `linear-gradient(160deg, ${GT.night} 0%, ${GT.forest} 100%)`,
      color: '#fff', padding: '36px 40px', position: 'relative',
    }}>
      <div style={{ position: 'absolute', right: -30, top: -30, width: 220, height: 220, borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}55 0%, transparent 70%)` }}/>
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        <Chip tone="dark">● Gathering inputs</Chip>
        <Chip tone="dark">Share link · copied</Chip>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 56, margin: 0, letterSpacing: -1.5, lineHeight: 1 }}>
          Eurotrip with the <span style={{ fontStyle: 'italic', color: accent }}>bootcamp crew</span>
        </h1>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 11, opacity: 0.7, letterSpacing: 1, textTransform: 'uppercase' }}>May 14 → 18 · 4 nights</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontStyle: 'italic', marginTop: 4 }}>4 people · 5 cities</div>
        </div>
      </div>
    </div>
  );
}

function PeoplePanel() {
  const ppl = [
    { name: 'Thomas', city: 'Paris', ap: 'CDG', tone: 'ember', self: true, ready: true },
    { name: 'Margot', city: 'Madrid', ap: 'MAD', tone: 'forest', ready: true },
    { name: 'Bryan',  city: 'London', ap: 'LHR', tone: 'sky', ready: true },
    { name: 'Lina',   city: 'Berlin', ap: 'BER', tone: 'plum', ready: false },
  ];
  return (
    <div style={panelS}>
      <PanelHead title="Your crew" count={4} right="3 of 4 ready"/>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {ppl.map(p => (
          <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: GT.sand, borderRadius: 14, border: `1px solid ${GT.line}` }}>
            <Avatar initials={p.name[0]+p.name[1]} tone={p.tone}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: FONT_TEXT, fontSize: 14, fontWeight: 500, color: GT.ink }}>
                {p.name} {p.self && <span style={{ fontFamily: FONT_MONO, fontSize: 9, marginLeft: 4, color: GT.muted, letterSpacing: 1 }}>YOU</span>}
              </div>
              <div style={{ fontFamily: FONT_TEXT, fontSize: 12, color: GT.muted }}>{p.city} <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: GT.forestLight }}>· {p.ap}</span></div>
            </div>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: p.ready ? '#5FA67D' : GT.muted,
            }}/>
          </div>
        ))}
      </div>
    </div>
  );
}

function SharePanel({ accent }) {
  return (
    <div style={panelS}>
      <PanelHead title="Invite link"/>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '12px 14px', background: GT.sand, borderRadius: 12, border: `1px dashed ${GT.line}` }}>
        <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: GT.forest, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          gettogether.app/s/hX7-w42a-9pLmQ
        </span>
        <button style={{ background: accent, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 999, fontFamily: FONT_TEXT, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>Copy</button>
      </div>
      <p style={{ fontFamily: FONT_TEXT, fontSize: 13, color: GT.muted, marginTop: 10, marginBottom: 0 }}>
        Friends who open it can add themselves. No signup.
      </p>
    </div>
  );
}

function CandidatesPanel({ accent }) {
  const cities = [
    { c: 'Lisbon', cc: 'PT', score: 92 },
    { c: 'Dublin', cc: 'IE', score: 84 },
    { c: 'Brussels', cc: 'BE', score: 78 },
    { c: 'Barcelona', cc: 'ES', score: 71 },
    { c: 'Amsterdam', cc: 'NL', score: 64 },
  ];
  return (
    <div style={panelS}>
      <PanelHead title="Candidate cities" count={5} right="Pending prices"/>
      {cities.map((c, i) => (
        <div key={c.c} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 2px', borderBottom: i < 4 ? `1px dashed ${GT.line}` : 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: GT.sand, display: 'grid', placeItems: 'center', fontFamily: FONT_MONO, fontSize: 10, color: GT.forest, letterSpacing: 1 }}>{c.cc}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: FONT_TEXT, fontSize: 14, color: GT.ink, fontWeight: 500 }}>{c.c}</div>
            <div style={{ height: 4, background: GT.sandDark, borderRadius: 99, marginTop: 6, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${c.score}%`, background: i === 0 ? accent : GT.forestLight, borderRadius: 99 }}/>
            </div>
          </div>
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: GT.muted }}>—</span>
        </div>
      ))}
    </div>
  );
}

function GoPanel({ accent }) {
  return (
    <div style={{ ...panelS, background: `linear-gradient(160deg, ${GT.night} 0%, ${GT.forest} 100%)`, border: 'none', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: -30, bottom: -40, opacity: 0.35 }}><Globe size={160} ring={false}/></div>
      <div style={{ position: 'relative' }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: 1.3, textTransform: 'uppercase', opacity: 0.7 }}>Ready when you are</div>
        <h3 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 30, letterSpacing: -0.8, margin: '10px 0 14px', lineHeight: 1.1 }}>
          Price all <span style={{ fontStyle: 'italic', color: accent }}>20 flights</span> now?
        </h3>
        <div style={{ fontFamily: FONT_TEXT, fontSize: 13, opacity: 0.8, marginBottom: 18, maxWidth: 280 }}>
          4 origins × 5 candidates. Takes about 30 seconds.
        </div>
        <BtnPrimary accent={accent}>Find the fair city →</BtnPrimary>
      </div>
    </div>
  );
}

function PanelHead({ title, count, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: GT.muted, letterSpacing: 1.2, textTransform: 'uppercase' }}>
        {title} {count != null && <span style={{ color: GT.forest, marginLeft: 4 }}>· {count}</span>}
      </div>
      {right && <span style={{ fontFamily: FONT_TEXT, fontSize: 12, color: GT.muted }}>{right}</span>}
    </div>
  );
}

const panelS = { background: GT.white, border: `1px solid ${GT.line}`, borderRadius: 18, padding: 22 };

function Waiting({ accent }) {
  return (
    <div style={{ background: GT.sand, minHeight: '100%' }}>
      <NavBar accent={accent} compact crumb="Pricing…"/>
      <div style={{ maxWidth: 720, margin: '60px auto', padding: '0 32px', textAlign: 'center' }}>
        <div style={{ margin: '20px auto 30px' }}><Globe size={220}/></div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: GT.muted, letterSpacing: 1.3, textTransform: 'uppercase', marginBottom: 12 }}>Pricing 20 routes · Duffel</div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 56, color: GT.forest, letterSpacing: -1.5, margin: 0, lineHeight: 1.05 }}>
          Scouring the skies for <span style={{ fontStyle: 'italic', color: accent }}>the fair answer…</span>
        </h1>
        <p style={{ fontFamily: FONT_TEXT, fontSize: 16, color: GT.inkSoft, marginTop: 16 }}>
          We're asking Duffel for live fares from every origin to every candidate. Hang tight.
        </p>
        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {[
            ['CDG → LIS', '€42', true],
            ['MAD → LIS', '€28', true],
            ['LHR → LIS', '€61', true],
            ['BER → LIS', '…', false],
            ['CDG → DUB', '€48', true],
            ['MAD → DUB', '€54', true],
            ['LHR → DUB', '€32', true],
            ['BER → DUB', '…', false],
          ].map(([r, p, done], i) => (
            <div key={i} style={{
              padding: 12, borderRadius: 12, background: done ? GT.white : GT.sand,
              border: `1px ${done ? 'solid' : 'dashed'} ${GT.line}`,
              fontFamily: FONT_MONO, fontSize: 11, color: done ? GT.forest : GT.muted,
              display: 'flex', justifyContent: 'space-between',
              opacity: done ? 1 : 0.7,
            }}>
              <span>{r}</span>
              <span style={{ color: done ? accent : GT.muted, fontWeight: 600 }}>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Results({ accent }) {
  return (
    <div style={{ background: GT.sand, minHeight: '100%' }}>
      <NavBar accent={accent} compact crumb="Eurotrip / Results"/>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 32px 80px' }}>
        <WinnerCard accent={accent}/>
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 20, marginTop: 20 }}>
          <BreakdownTable accent={accent}/>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Alternatives accent={accent}/>
            <VotePanel accent={accent}/>
          </div>
        </div>
      </div>
    </div>
  );
}

function WinnerCard({ accent }) {
  return (
    <div style={{
      borderRadius: 24, overflow: 'hidden', position: 'relative',
      background: `linear-gradient(150deg, ${GT.night} 0%, ${GT.forest} 65%, ${GT.forestLight} 100%)`,
      color: '#fff', padding: '44px 48px',
    }}>
      <div style={{ position: 'absolute', right: -80, top: -80, width: 320, height: 320, borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}66 0%, transparent 65%)` }}/>
      <div style={{ position: 'absolute', right: 40, top: 40, transform: 'rotate(8deg)' }}>
        <Stamp label="Cheapest for the group" tone="ember"/>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
          <Chip tone="dark">★ Best fit</Chip>
          <Chip tone="dark">92 / 100 fairness</Chip>
        </div>
        <div style={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: 1.4, textTransform: 'uppercase', opacity: 0.75 }}>
          Meet in
        </div>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, fontSize: 140, letterSpacing: -4, margin: '2px 0 6px', lineHeight: 0.92 }}>
          Lisbon<span style={{ color: accent, fontStyle: 'italic' }}>.</span>
        </h1>
        <div style={{ fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: 22, opacity: 0.8 }}>
          Portugal · LIS
        </div>
        <div style={{ display: 'flex', gap: 48, marginTop: 32, flexWrap: 'wrap' }}>
          <WinStat label="Total for the group" v="€164" big/>
          <WinStat label="Avg per person" v="€41"/>
          <WinStat label="Longest flight" v="3h 10m"/>
          <WinStat label="Cheaper than #2" v="− €20"/>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <BtnPrimary accent={accent}>Book it on Google Flights →</BtnPrimary>
          <BtnGhost style={{ color: '#fff', borderColor: '#ffffff33' }}>Share results</BtnGhost>
        </div>
      </div>
    </div>
  );
}

function WinStat({ label, v, big }) {
  return (
    <div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase', opacity: 0.65 }}>{label}</div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: big ? 44 : 28, letterSpacing: -1, marginTop: 4, fontStyle: big ? 'italic' : 'normal' }}>{v}</div>
    </div>
  );
}

function BreakdownTable({ accent }) {
  const rows = [
    { who: 'Thomas', from: 'Paris', ap: 'CDG', price: '€42', dur: '2h 45m', tone: 'ember' },
    { who: 'Margot', from: 'Madrid', ap: 'MAD', price: '€28', dur: '1h 10m', tone: 'forest' },
    { who: 'Bryan',  from: 'London', ap: 'LHR', price: '€61', dur: '2h 50m', tone: 'sky' },
    { who: 'Lina',   from: 'Berlin', ap: 'BER', price: '€33', dur: '3h 10m', tone: 'plum' },
  ];
  return (
    <div style={panelS}>
      <PanelHead title="Fare breakdown" right="→ Lisbon · May 14"/>
      <div style={{ marginTop: 4 }}>
        {rows.map((r, i) => (
          <div key={r.who} style={{ display: 'grid', gridTemplateColumns: '44px 1.1fr 1fr 70px 70px', gap: 12, alignItems: 'center', padding: '14px 4px', borderBottom: i < 3 ? `1px dashed ${GT.line}` : 'none' }}>
            <Avatar initials={r.who[0]+r.who[1]} tone={r.tone}/>
            <div>
              <div style={{ fontFamily: FONT_TEXT, fontSize: 14, color: GT.ink, fontWeight: 500 }}>{r.who}</div>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: GT.muted, letterSpacing: 0.5 }}>{r.ap} → LIS</div>
            </div>
            <div style={{ fontFamily: FONT_TEXT, fontSize: 13, color: GT.inkSoft }}>{r.from}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: GT.muted, textAlign: 'right' }}>{r.dur}</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: accent, fontStyle: 'italic', textAlign: 'right' }}>{r.price}</div>
          </div>
        ))}
        <Divider style={{ marginTop: 6 }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 4px' }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: GT.muted, letterSpacing: 1.2, textTransform: 'uppercase' }}>Group total</span>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 36, color: GT.forest, fontStyle: 'italic', letterSpacing: -0.8 }}>€164</span>
        </div>
      </div>
    </div>
  );
}

function Alternatives({ accent }) {
  const alts = [
    { c: 'Dublin', p: '€184', diff: '+€20' },
    { c: 'Brussels', p: '€196', diff: '+€32' },
    { c: 'Barcelona', p: '€211', diff: '+€47' },
    { c: 'Amsterdam', p: '€224', diff: '+€60' },
  ];
  return (
    <div style={panelS}>
      <PanelHead title="Runners-up"/>
      {alts.map((a, i) => (
        <div key={a.c} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 4px', borderBottom: i < 3 ? `1px dashed ${GT.line}` : 'none' }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: GT.muted, width: 22 }}>#{i + 2}</span>
          <span style={{ flex: 1, fontFamily: FONT_TEXT, fontSize: 14, color: GT.ink }}>{a.c}</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: GT.orangeDark }}>{a.diff}</span>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: GT.forest, fontStyle: 'italic', minWidth: 50, textAlign: 'right' }}>{a.p}</span>
        </div>
      ))}
    </div>
  );
}

function VotePanel({ accent }) {
  return (
    <div style={panelS}>
      <PanelHead title="But also — what do you want?" right="3/4 voted"/>
      {[
        { c: 'Lisbon', v: 3, max: 4, color: accent },
        { c: 'Dublin', v: 1, max: 4, color: GT.forestLight },
        { c: 'Barcelona', v: 0, max: 4, color: GT.sandDark },
      ].map(row => (
        <div key={row.c} style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT_TEXT, fontSize: 13, color: GT.ink }}>
            <span>{row.c}</span>
            <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: GT.muted }}>{row.v} votes</span>
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
            {Array.from({ length: row.max }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 8, borderRadius: 2,
                background: i < row.v ? row.color : GT.sandDark }}/>
            ))}
          </div>
        </div>
      ))}
      <button style={{ marginTop: 10, width: '100%', padding: '10px 14px', border: `1px dashed ${accent}`, color: accent, background: 'transparent', borderRadius: 12, fontFamily: FONT_TEXT, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
        + Add your vote
      </button>
    </div>
  );
}

Object.assign(window, { Dashboard, Waiting, Results });
