/**
 * Analogy — side-by-side real-world vs chemistry comparison.
 * window.Analogy.init(container, config)
 * config: { realWorld: {label, visual, fact}, chemistry: {label, visual, fact}, bridge }
 */
window.Analogy = (() => {
  const VISUALS = {
    'eggs-dozen': '<svg viewBox="0 0 200 120"><rect x="10" y="10" width="180" height="100" rx="10" fill="#1A2535" stroke="#00B4CC"/>' +
      Array.from({length:12}).map((_,i)=>`<ellipse cx="${30+(i%4)*40}" cy="${35+Math.floor(i/4)*35}" rx="14" ry="18" fill="#E0E0E0"/>`).join('') + '</svg>',
    'mole-atoms': '<svg viewBox="0 0 200 120">' +
      Array.from({length:18}).map((_,i)=>`<circle cx="${15+(i%6)*32}" cy="${20+Math.floor(i/6)*35}" r="10" fill="#00B4CC"/>`).join('') + '</svg>',
    'stadium-crowd': '<svg viewBox="0 0 200 120"><rect width="200" height="120" fill="#0E2030"/>' +
      Array.from({length:8}).map((_,i)=>`<circle cx="${15+i*12}" cy="20" r="4" fill="#FFD740"/>`).join('') +
      Array.from({length:6}).map((_,i)=>`<circle cx="${20+i*22}" cy="55" r="4" fill="#00E5FF"/>`).join('') +
      Array.from({length:4}).map((_,i)=>`<circle cx="${30+i*40}" cy="95" r="4" fill="#CCCCCC"/>`).join('') + '</svg>',
    'water-cycle': '<svg viewBox="0 0 200 120"><rect width="200" height="120" fill="#0E2030"/><path d="M10 100 Q100 40 190 100" stroke="#00B4CC" fill="none" stroke-width="3"/><circle cx="60" cy="30" r="15" fill="#E0E0E0"/><circle cx="140" cy="25" r="12" fill="#E0E0E0"/></svg>',
    'lock-key': '<svg viewBox="0 0 200 120"><rect x="70" y="50" width="60" height="50" rx="8" fill="#1A6B8A"/><circle cx="100" cy="45" r="20" fill="none" stroke="#1A6B8A" stroke-width="10"/><rect x="95" y="65" width="10" height="20" fill="#FFD740"/></svg>',
    'traffic-light': '<svg viewBox="0 0 200 120"><rect x="80" y="10" width="40" height="100" rx="10" fill="#142232" stroke="#00B4CC"/><circle cx="100" cy="30" r="12" fill="#FF5252"/><circle cx="100" cy="60" r="12" fill="#FFD740"/><circle cx="100" cy="90" r="12" fill="#00C853"/></svg>',
    'see-saw': '<svg viewBox="0 0 200 120"><rect x="90" y="80" width="20" height="20" fill="#1A6B8A"/><line x1="30" y1="70" x2="170" y2="50" stroke="#00B4CC" stroke-width="6"/><circle cx="30" cy="70" r="14" fill="#FFD740"/><circle cx="170" cy="50" r="14" fill="#00E5FF"/></svg>'
  };

  function panel(side, color, data) {
    const div = document.createElement('div');
    div.style.flex = '1';
    div.style.background = color;
    div.style.borderRadius = 'var(--radius)';
    div.style.padding = '24px';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.gap = '12px';
    div.style.minWidth = '260px';

    const label = document.createElement('div');
    label.textContent = data.label || '';
    label.style.color = 'var(--color-accent)';
    label.style.fontWeight = '700';
    label.style.fontSize = '14px';
    label.style.letterSpacing = '1px';

    const visual = document.createElement('div');
    visual.style.width = '100%';
    visual.style.maxWidth = '220px';
    visual.style.margin = '0 auto';
    visual.innerHTML = VISUALS[data.visual] || '';

    const fact = document.createElement('div');
    fact.textContent = data.fact || '';
    fact.style.color = 'var(--color-text-body)';
    fact.style.fontSize = '16px';

    div.appendChild(label);
    div.appendChild(visual);
    div.appendChild(fact);
    return div;
  }

  function build(container, config) {
    container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.gap = '20px';

    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '20px';
    row.style.flexWrap = 'wrap';
    row.appendChild(panel('left', '#1A2535', config.realWorld || {}));
    row.appendChild(panel('right', '#0E2030', config.chemistry || {}));

    const bridge = document.createElement('div');
    bridge.textContent = config.bridge || '';
    bridge.style.textAlign = 'center';
    bridge.style.color = 'var(--color-highlight)';
    bridge.style.fontWeight = '600';
    bridge.style.fontSize = '18px';
    bridge.style.padding = '16px';
    bridge.style.borderTop = '1px solid var(--color-border)';

    wrap.appendChild(row);
    wrap.appendChild(bridge);
    container.appendChild(wrap);
  }

  return { init: build };
})();
