// Small shared UI atoms: logo, buttons, chips, globe, plane, avatars, stamps.
// Pure inline SVG / CSS, no libraries.

function Logo({ color = GT.forest, accent = GT.orange, size = 22 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color, fontFamily: FONT_DISPLAY, fontWeight: 500, fontSize: size, letterSpacing: -0.4 }}>
      <div style={{
        width: size * 1.35, height: size * 1.35, borderRadius: '50%',
        background: accent, display: 'grid', placeItems: 'center',
        color: '#fff', fontFamily: FONT_DISPLAY, fontSize: size * 0.9, fontWeight: 500,
        fontStyle: 'italic',
      }}>g</div>
      <span>Get Together</span>
    </div>
  );
}

function BtnPrimary({ children, style, accent = GT.orange, ...rest }) {
  return (
    <button {...rest} style={{
      padding: '14px 22px', borderRadius: 999, border: 'none', cursor: 'pointer',
      background: accent, color: '#fff',
      fontFamily: FONT_TEXT, fontSize: 15, fontWeight: 500, letterSpacing: -0.1,
      display: 'inline-flex', alignItems: 'center', gap: 10,
      boxShadow: `0 8px 24px ${accent}33`,
      transition: 'transform .15s ease',
      ...style,
    }}>{children}</button>
  );
}

function BtnGhost({ children, style, ...rest }) {
  return (
    <button {...rest} style={{
      padding: '12px 18px', borderRadius: 999, cursor: 'pointer',
      background: 'transparent', color: GT.forest,
      border: `1px solid ${GT.forest}22`,
      fontFamily: FONT_TEXT, fontSize: 14, fontWeight: 500,
      display: 'inline-flex', alignItems: 'center', gap: 8,
      ...style,
    }}>{children}</button>
  );
}

function Chip({ children, tone = 'sand', style }) {
  const tones = {
    sand: { bg: GT.sandDark, fg: GT.inkSoft },
    ember: { bg: GT.orangeLight, fg: GT.orangeDark },
    forest: { bg: '#DDE7E1', fg: GT.forest },
    white: { bg: GT.white, fg: GT.forest, border: `1px solid ${GT.line}` },
    dark: { bg: '#2b2d35', fg: '#fff' },
  };
  const t = tones[tone] || tones.sand;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 12px', borderRadius: 999,
      background: t.bg, color: t.fg, border: t.border || 'none',
      fontFamily: FONT_TEXT, fontSize: 12, fontWeight: 500,
      letterSpacing: 0.2,
      ...style,
    }}>{children}</span>
  );
}

function Avatar({ initials, tone = 'ember', size = 36 }) {
  const tones = {
    ember:  { bg: GT.orangeLight, fg: GT.orangeDark },
    forest: { bg: '#DDE7E1', fg: GT.forest },
    sky:    { bg: '#DCE8F1', fg: '#3A6B92' },
    plum:   { bg: '#EADCF0', fg: '#7A3F8F' },
    sand:   { bg: GT.sandDark, fg: GT.inkSoft },
  };
  const t = tones[tone] || tones.ember;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: t.bg, color: t.fg,
      display: 'grid', placeItems: 'center',
      fontFamily: FONT_TEXT, fontSize: size * 0.36, fontWeight: 600,
      border: `2px solid ${GT.white}`,
    }}>{initials}</div>
  );
}

function Stack({ avatars }) {
  return (
    <div style={{ display: 'flex' }}>
      {avatars.map((a, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : -10 }}>
          <Avatar {...a} />
        </div>
      ))}
    </div>
  );
}

function Plane({ size = 20, color = GT.forest, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style}>
      <path d="M3 12 L21 5 L15 12 L21 19 Z M3 12 L9 10 L11 12 L9 14 Z" fill={color} />
    </svg>
  );
}

function Pin({ size = 16, color = GT.orange }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2 C7.6 2 4 5.6 4 10 C4 16 12 22 12 22 C12 22 20 16 20 10 C20 5.6 16.4 2 12 2 Z M12 12 A2.5 2.5 0 1 1 12 7 A2.5 2.5 0 0 1 12 12 Z" />
    </svg>
  );
}

// Simple rotating globe — uses the continent silhouettes tuned earlier.
function Globe({ size = 120, ring = true }) {
  return (
    <div style={{ width: size, height: size, position: 'relative', display: 'inline-block' }}>
      <svg viewBox="0 0 200 200" width={size} height={size} style={{ overflow: 'visible' }}>
        <defs>
          <clipPath id={`sc-${size}`}>
            <circle cx="100" cy="100" r="78" />
          </clipPath>
          <g id={`ct-${size}`}>
            <path d="M14 52C22 44 34 42 46 44C56 42 66 46 74 50L82 54C80 60 72 62 66 64C70 70 68 76 62 80C58 86 52 90 48 94C46 100 50 104 48 108C44 110 40 106 38 100C34 94 36 86 32 80C26 74 22 66 18 60Z"/>
            <path d="M72 36C80 34 86 38 84 46C80 50 74 48 72 44Z"/>
            <path d="M54 112C62 110 70 114 72 122C74 130 68 138 66 146C62 152 58 156 54 152C52 146 54 138 52 132C50 124 50 118 54 112Z"/>
            <path d="M98 50C108 46 120 48 130 50C140 48 150 52 156 56C154 62 146 62 140 60C136 64 128 64 122 60C116 62 108 62 102 58Z"/>
            <path d="M116 42C122 40 126 44 124 50C120 52 116 48 116 42Z"/>
            <path d="M108 72C120 68 134 70 142 76C148 82 146 92 142 100C140 110 134 120 128 128C122 134 116 130 114 122C110 114 108 104 106 94C104 86 104 78 108 72Z"/>
            <path d="M146 112C150 112 152 118 150 124C146 124 144 118 146 112Z"/>
            <path d="M156 48C170 44 186 48 196 54L200 58C200 66 192 68 184 66C178 72 170 74 162 70C158 66 154 60 156 54Z"/>
            <path d="M168 72C174 74 176 82 172 88C168 86 166 78 168 72Z"/>
            <path d="M184 72C190 74 194 82 190 90C186 92 182 84 184 72Z"/>
            <circle cx="178" cy="96" r="1.6"/>
            <circle cx="190" cy="100" r="1.4"/>
            <path d="M176 112C186 108 198 112 198 122C194 128 184 128 176 124C172 120 172 114 176 112Z"/>
            <path d="M0 158C20 154 44 160 68 156C92 160 118 154 142 158C166 156 186 160 200 158L200 172L0 172Z"/>
          </g>
        </defs>
        {ring && (
          <ellipse cx="100" cy="100" rx="94" ry="36" fill="none" stroke={GT.forest} strokeWidth="1.25"
            style={{ transformOrigin: '100px 100px', transform: 'rotate(-15deg)', animation: 'gt-pulse 3.2s ease-in-out infinite' }} />
        )}
        <g style={{ transformOrigin: '100px 100px', transform: 'rotate(-15deg)' }}>
          <circle cx="100" cy="100" r="78" fill="#FFFFFF" stroke={GT.forest} strokeWidth="1.75"/>
          <g clipPath={`url(#sc-${size})`}>
            <g fill="none" stroke={GT.forest} strokeWidth="0.9" opacity="0.5">
              <line x1="22" y1="100" x2="178" y2="100"/>
              <ellipse cx="100" cy="100" rx="78" ry="26"/>
              <ellipse cx="100" cy="100" rx="78" ry="52"/>
            </g>
            <g fill="none" stroke={GT.forest} strokeWidth="0.9" opacity="0.5"
               style={{ transformOrigin: '100px 100px', animation: 'gt-spin 8s linear infinite' }}>
              <ellipse cx="100" cy="100" rx="26" ry="78"/>
              <ellipse cx="100" cy="100" rx="52" ry="78"/>
              <line x1="100" y1="22" x2="100" y2="178"/>
            </g>
            <g fill={GT.forest} style={{ animation: 'gt-drift 8s linear infinite' }}>
              <use href={`#ct-${size}`} x="0" y="0"/>
              <use href={`#ct-${size}`} x="200" y="0"/>
            </g>
          </g>
          <circle cx="100" cy="100" r="78" fill="none" stroke={GT.forest} strokeWidth="1.75"/>
        </g>
      </svg>
    </div>
  );
}

function Stamp({ label, angle = -8, tone = 'ember' }) {
  const tones = {
    ember: { border: GT.orange, color: GT.orange },
    forest: { border: GT.forest, color: GT.forest },
  };
  const t = tones[tone];
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px',
      border: `1.5px dashed ${t.border}`, color: t.color,
      borderRadius: 4, fontFamily: FONT_MONO, fontSize: 10, fontWeight: 600,
      letterSpacing: 1.2, textTransform: 'uppercase',
      transform: `rotate(${angle}deg)`,
      background: 'transparent',
    }}>{label}</div>
  );
}

function Divider({ dashed, color = GT.line, style }) {
  return <div style={{ height: 0, borderTop: `1px ${dashed ? 'dashed' : 'solid'} ${color}`, ...style }} />;
}

Object.assign(window, {
  Logo, BtnPrimary, BtnGhost, Chip, Avatar, Stack, Plane, Pin, Globe, Stamp, Divider,
});
