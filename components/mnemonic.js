/**
 * Mnemonic — flip card with breakdown table.
 * window.Mnemonic.init(container, config)
 * config: { mnemonic, breakdown: string[], rule, tip }
 */
window.Mnemonic = (() => {
  function build(container, config) {
    container.innerHTML = '';

    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '20px';

    const stage = document.createElement('div');
    stage.style.width = '100%';
    stage.style.maxWidth = '100%';
    stage.style.minHeight = '320px';
    stage.style.perspective = '1200px';

    const card = document.createElement('div');
    card.style.position = 'relative';
    card.style.width = '100%';
    card.style.minHeight = '320px';
    card.style.transformStyle = 'preserve-3d';
    card.style.transition = 'transform 0.6s ease';

    const front = document.createElement('div');
    front.style.position = 'absolute';
    front.style.inset = '0';
    front.style.backfaceVisibility = 'hidden';
    front.style.display = 'flex';
    front.style.alignItems = 'center';
    front.style.justifyContent = 'center';
    front.style.background = 'var(--color-card)';
    front.style.borderRadius = 'var(--radius)';
    front.style.border = '1px solid var(--color-border)';
    front.style.padding = '32px';

    const phrase = document.createElement('div');
    phrase.textContent = config.mnemonic || '';
    phrase.style.fontSize = 'clamp(32px, 3.2vw, 70px)';
    phrase.style.fontWeight = '800';
    phrase.style.textAlign = 'center';
    phrase.style.background = 'linear-gradient(90deg, #00B4CC, #00E5FF)';
    phrase.style.webkitBackgroundClip = 'text';
    phrase.style.backgroundClip = 'text';
    phrase.style.color = 'transparent';
    front.appendChild(phrase);

    const back = document.createElement('div');
    back.style.position = 'absolute';
    back.style.inset = '0';
    back.style.backfaceVisibility = 'hidden';
    back.style.transform = 'rotateY(180deg)';
    back.style.background = 'var(--color-card)';
    back.style.borderRadius = 'var(--radius)';
    back.style.border = '1px solid var(--color-border)';
    back.style.padding = '28px';
    back.style.display = 'flex';
    back.style.flexDirection = 'column';
    back.style.gap = '10px';
    back.style.overflowY = 'auto';

    const table = document.createElement('div');
    (config.breakdown || []).forEach(line => {
      const row = document.createElement('div');
      row.textContent = line;
      row.style.color = 'var(--color-text-body)';
      row.style.fontSize = 'clamp(16px, 1.6vw, 35px)';
      row.style.padding = '6px 0';
      row.style.borderBottom = '1px solid var(--color-border)';
      table.appendChild(row);
    });

    const rule = document.createElement('div');
    rule.textContent = config.rule || '';
    rule.style.color = 'var(--color-highlight)';
    rule.style.fontWeight = '600';
    rule.style.marginTop = '8px';

    const tip = document.createElement('div');
    tip.textContent = config.tip ? ('Tip: ' + config.tip) : '';
    tip.style.color = 'var(--color-warning)';
    tip.style.fontSize = 'clamp(14px, 1.4vw, 30px)';

    back.appendChild(table);
    back.appendChild(rule);
    back.appendChild(tip);

    card.appendChild(front);
    card.appendChild(back);
    stage.appendChild(card);

    const flipBtn = document.createElement('button');
    flipBtn.textContent = 'FLIP';
    flipBtn.className = 'btn';

    let flipped = false;
    flipBtn.onclick = () => {
      flipped = !flipped;
      card.style.transform = flipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
    };

    wrap.appendChild(stage);
    wrap.appendChild(flipBtn);
    container.appendChild(wrap);
  }

  return { init: build };
})();
