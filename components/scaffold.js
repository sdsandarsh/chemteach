/**
 * Scaffold — Known -> Bridge -> New Idea three-panel sequential reveal.
 * window.Scaffold.init(container, config)
 * config: { known: {label, text}, bridge: {label, text}, unknown: {label, text} }
 */
window.Scaffold = (() => {
  function panel(data, bg, borderColor) {
    const div = document.createElement('div');
    div.style.background = bg;
    div.style.border = `2px solid ${borderColor}`;
    div.style.borderRadius = 'var(--radius)';
    div.style.padding = '24px';
    div.style.opacity = '0';
    div.style.transform = 'translateY(12px)';
    div.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    div.style.display = 'none';

    const badge = document.createElement('div');
    badge.textContent = data.label || '';
    badge.style.color = borderColor;
    badge.style.fontWeight = '700';
    badge.style.fontSize = '13px';
    badge.style.letterSpacing = '1px';
    badge.style.marginBottom = '10px';

    const text = document.createElement('div');
    text.textContent = data.text || '';
    text.style.color = 'var(--color-text-body)';
    text.style.fontSize = '18px';

    div.appendChild(badge);
    div.appendChild(text);
    return div;
  }

  function build(container, config) {
    container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.gap = '16px';
    wrap.style.maxWidth = '700px';
    wrap.style.margin = '0 auto';

    const panels = [
      panel(config.known || {}, 'var(--color-panel-green)', 'var(--color-success)'),
      panel(config.bridge || {}, 'var(--color-panel-amber)', 'var(--color-warning)'),
      panel(config.unknown || {}, 'var(--color-panel-cyan)', 'var(--color-accent)')
    ];

    const progress = document.createElement('div');
    progress.style.textAlign = 'center';
    progress.style.color = 'var(--color-text-muted)';
    progress.style.fontSize = '14px';

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'NEXT';
    nextBtn.className = 'btn';
    nextBtn.style.alignSelf = 'center';

    let shown = 0;
    function showNext() {
      if (shown >= panels.length) return;
      panels[shown].style.display = 'block';
      requestAnimationFrame(() => {
        panels[shown].style.opacity = '1';
        panels[shown].style.transform = 'translateY(0)';
      });
      shown++;
      progress.textContent = `${shown} of ${panels.length}`;
      if (shown >= panels.length) {
        nextBtn.style.display = 'none';
      }
    }

    panels.forEach(p => wrap.appendChild(p));
    wrap.appendChild(progress);
    wrap.appendChild(nextBtn);
    container.appendChild(wrap);

    nextBtn.onclick = showNext;
    progress.textContent = `0 of ${panels.length}`;
    showNext();
  }

  return { init: build };
})();
