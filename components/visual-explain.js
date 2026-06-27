/**
 * VisualExplain — annotated SVG diagrams with step-by-step reveal.
 * window.VisualExplain.init(container, config)
 * config: { diagram, revealSteps, caption }
 */
window.VisualExplain = (() => {
  const DIAGRAMS = {
    'matter-classification-tree': [
      { x: 250, y: 20, w: 110, h: 36, text: 'MATTER' },
      { x: 130, y: 90, w: 110, h: 36, text: 'Mixtures' },
      { x: 380, y: 90, w: 110, h: 36, text: 'Pure Substances' },
      { x: 60, y: 160, w: 100, h: 36, text: 'Homogeneous' },
      { x: 200, y: 160, w: 100, h: 36, text: 'Heterogeneous' },
      { x: 330, y: 160, w: 100, h: 36, text: 'Elements' },
      { x: 460, y: 160, w: 100, h: 36, text: 'Compounds' }
    ],
    'periodic-table-blocks': [
      { x: 30, y: 20, w: 120, h: 200, text: 's-block', fill: '#00B4CC' },
      { x: 170, y: 20, w: 220, h: 80, text: 'd-block', fill: '#1A6B8A' },
      { x: 410, y: 20, w: 150, h: 200, text: 'p-block', fill: '#00E5FF' },
      { x: 170, y: 120, w: 220, h: 60, text: 'f-block', fill: '#FFD740' }
    ],
    'bond-polarity-spectrum': [
      { x: 20, y: 80, w: 160, h: 40, text: 'Nonpolar Covalent' },
      { x: 220, y: 80, w: 160, h: 40, text: 'Polar Covalent' },
      { x: 420, y: 80, w: 160, h: 40, text: 'Ionic' }
    ],
    'electromagnetic-spectrum': [
      { x: 20, y: 80, w: 100, h: 40, text: 'Radio' },
      { x: 140, y: 80, w: 100, h: 40, text: 'IR' },
      { x: 260, y: 80, w: 100, h: 40, text: 'Visible' },
      { x: 380, y: 80, w: 100, h: 40, text: 'UV' },
      { x: 500, y: 80, w: 80, h: 40, text: 'X/Gamma' }
    ],
    'energy-level-diagram': [
      { x: 100, y: 200, w: 300, h: 4, text: 'n=1' },
      { x: 100, y: 140, w: 300, h: 4, text: 'n=2' },
      { x: 100, y: 90, w: 300, h: 4, text: 'n=3' },
      { x: 100, y: 50, w: 300, h: 4, text: 'n=4' }
    ],
    'reaction-profile': [
      { x: 40, y: 200, w: 80, h: 20, text: 'Reactants' },
      { x: 250, y: 40, w: 100, h: 20, text: 'Activated Complex' },
      { x: 460, y: 160, w: 80, h: 20, text: 'Products' }
    ],
    'acid-base-conjugate': [
      { x: 40, y: 60, w: 140, h: 40, text: 'Acid (HA)' },
      { x: 240, y: 60, w: 140, h: 40, text: 'Base (B)' },
      { x: 40, y: 160, w: 140, h: 40, text: 'Conjugate Base (A-)' },
      { x: 240, y: 160, w: 140, h: 40, text: 'Conjugate Acid (BH+)' }
    ],
    'titration-curve': [
      { x: 30, y: 200, w: 540, h: 4, text: 'Volume of titrant added' },
      { x: 280, y: 40, w: 4, h: 160, text: 'Equivalence point' }
    ]
  };

  function build(container, config) {
    const nodes = DIAGRAMS[config.diagram] || DIAGRAMS['matter-classification-tree'];
    const revealSteps = config.revealSteps !== false;

    container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '16px';

    const svgWrap = document.createElement('div');
    svgWrap.style.width = '100%';
    svgWrap.style.maxWidth = '700px';
    svgWrap.style.background = 'var(--color-card)';
    svgWrap.style.borderRadius = 'var(--radius)';
    svgWrap.style.border = '1px solid var(--color-border)';
    svgWrap.style.padding = '16px';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 600 260');
    svg.style.width = '100%';

    nodes.forEach((n, i) => {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.style.opacity = revealSteps ? '0' : '1';
      g.style.transition = 'opacity 0.4s ease';

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', n.x);
      rect.setAttribute('y', n.y);
      rect.setAttribute('width', n.w);
      rect.setAttribute('height', n.h);
      rect.setAttribute('rx', 8);
      rect.setAttribute('fill', n.fill || 'rgba(0,180,204,0.25)');
      rect.setAttribute('stroke', '#00B4CC');
      g.appendChild(rect);

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', n.x + n.w / 2);
      text.setAttribute('y', n.y + n.h / 2 + 5);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#FFFFFF');
      text.setAttribute('font-size', '13');
      text.textContent = n.text;
      g.appendChild(text);

      svg.appendChild(g);
    });

    svgWrap.appendChild(svg);

    const revealBtn = document.createElement('button');
    revealBtn.textContent = 'REVEAL NEXT';
    revealBtn.className = 'btn';
    revealBtn.style.display = revealSteps ? 'inline-block' : 'none';

    let revealed = 0;
    const groups = svg.querySelectorAll('g');

    function revealNext() {
      if (revealed < groups.length) {
        groups[revealed].style.opacity = '1';
        revealed++;
      }
      if (revealed >= groups.length) {
        revealBtn.textContent = 'ALL REVEALED';
        revealBtn.disabled = true;
      }
    }

    revealBtn.onclick = revealNext;
    if (!revealSteps) groups.forEach(g => g.style.opacity = '1');

    const captionEl = document.createElement('div');
    captionEl.textContent = config.caption || '';
    captionEl.style.color = 'var(--color-text-muted)';
    captionEl.style.fontSize = '14px';
    captionEl.style.textAlign = 'center';

    wrap.appendChild(svgWrap);
    wrap.appendChild(revealBtn);
    wrap.appendChild(captionEl);
    container.appendChild(wrap);
  }

  return { init: build };
})();
