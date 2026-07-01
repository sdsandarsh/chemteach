/**
 * ComicStrip — SVG illustrated 3-5 panel narrative strips.
 * window.ComicStrip.init(container, config)
 * config: { panels: [{character, expression, speech, caption}] }
 */
window.ComicStrip = (() => {
  function mouth(expression) {
    if (expression === 'happy') return '<path d="M -10 8 Q 0 18 10 8" stroke="#0D1B2A" stroke-width="2" fill="none"/>';
    if (expression === 'shocked') return '<ellipse cx="0" cy="10" rx="5" ry="7" fill="#0D1B2A"/>';
    return '<line x1="-8" y1="8" x2="8" y2="8" stroke="#0D1B2A" stroke-width="2"/>';
  }
  function eyes(expression) {
    if (expression === 'shocked') return '<circle cx="-10" cy="-5" r="4" fill="#0D1B2A"/><circle cx="10" cy="-5" r="4" fill="#0D1B2A"/>';
    return '<circle cx="-10" cy="-5" r="2.5" fill="#0D1B2A"/><circle cx="10" cy="-5" r="2.5" fill="#0D1B2A"/>';
  }

  function character(name, expression) {
    const face = `<circle cx="0" cy="0" r="30" fill="#FFD9A0"/>${eyes(expression)}${mouth(expression)}`;
    let extra = '';
    if (name === 'scientist') extra = '<rect x="-32" y="20" width="64" height="40" fill="#FFFFFF"/><circle cx="-10" cy="-5" r="8" fill="none" stroke="#333" stroke-width="2"/><circle cx="10" cy="-5" r="8" fill="none" stroke="#333" stroke-width="2"/><path d="M-30 -25 Q0 -55 30 -25" stroke="#888" stroke-width="6" fill="none"/>';
    else if (name === 'student') extra = '<rect x="-32" y="20" width="64" height="40" fill="#1A6B8A"/><rect x="-25" y="40" width="50" height="30" fill="#00B4CC"/>';
    else if (name === 'rutherford') extra = '<rect x="-32" y="20" width="64" height="40" fill="#142232"/><path d="M-15 12 Q0 22 15 12" stroke="#333" stroke-width="4" fill="none"/>';
    else if (name === 'dalton') extra = '<rect x="-32" y="20" width="64" height="40" fill="#333"/><rect x="-25" y="-50" width="50" height="20" fill="#222"/><rect x="-30" y="-32" width="60" height="8" fill="#222"/>';
    else if (name === 'atom-character') {
      return `<g><circle cx="0" cy="0" r="20" fill="#00B4CC"/>${eyes(expression)}${mouth(expression)}
        <ellipse cx="0" cy="0" rx="45" ry="15" fill="none" stroke="#00E5FF" stroke-width="2"/>
        <ellipse cx="0" cy="0" rx="15" ry="45" fill="none" stroke="#00E5FF" stroke-width="2"/></g>`;
    }
    return `<g>${extra}${face}</g>`;
  }

  function panelSVG(p) {
    return `<svg viewBox="0 0 220 240" style="width:100%;height:auto;">
      <rect x="2" y="2" width="216" height="236" rx="10" fill="#142232" stroke="#00B4CC" stroke-width="1.5"/>
      <g transform="translate(110, 170)">${character(p.character, p.expression)}</g>
      <g transform="translate(20, 10)">
        <rect x="0" y="0" width="180" height="70" rx="14" fill="#0D1B2A" stroke="#00E5FF"/>
        <path d="M70 70 L60 90 L90 70 Z" fill="#0D1B2A" stroke="#00E5FF"/>
        <foreignObject x="8" y="6" width="164" height="58">
          <div xmlns="http://www.w3.org/1999/xhtml" style="color:#E0E0E0;font-size:11px;font-family:'Segoe UI',sans-serif;line-height:1.3;">${p.speech}</div>
        </foreignObject>
      </g>
    </svg>`;
  }

  function build(container, config) {
    const panels = config.panels || [];
    container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '16px';
    wrap.style.flexWrap = 'wrap';
    wrap.style.justifyContent = 'center';

    panels.forEach(p => {
      const col = document.createElement('div');
      col.style.flex = '1';
      col.style.minWidth = '180px';
      col.style.maxWidth = '240px';
      col.style.display = 'flex';
      col.style.flexDirection = 'column';
      col.style.gap = '8px';

      col.innerHTML = panelSVG(p);

      const caption = document.createElement('div');
      caption.textContent = p.caption || '';
      caption.style.color = 'var(--color-text-muted)';
      caption.style.fontSize = 'clamp(13px, 1.3vw, 28px)';
      caption.style.textAlign = 'center';
      col.appendChild(caption);

      wrap.appendChild(col);
    });

    container.appendChild(wrap);
  }

  return { init: build };
})();
