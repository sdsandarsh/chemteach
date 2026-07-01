/**
 * DragDrop — drag-and-drop sorting with visual feedback. No score, no timer.
 * window.DragDrop.init(container, config)
 * config: { instruction, items: string[], categories: string[], answers: {item: category} }
 */
window.DragDrop = (() => {
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function build(container, config) {
    const items = shuffle(config.items || []);
    const categories = config.categories || [];
    const answers = config.answers || {};
    let placedCorrect = 0;

    container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.gap = '20px';

    const instruction = document.createElement('div');
    instruction.textContent = config.instruction || '';
    instruction.style.color = 'var(--color-text-body)';
    instruction.style.fontSize = 'clamp(16px, 1.6vw, 35px)';
    instruction.style.textAlign = 'center';

    const holding = document.createElement('div');
    holding.style.display = 'flex';
    holding.style.flexWrap = 'wrap';
    holding.style.gap = '10px';
    holding.style.justifyContent = 'center';
    holding.style.minHeight = '54px';
    holding.style.padding = '12px';
    holding.style.border = '1px dashed var(--color-border)';
    holding.style.borderRadius = 'var(--radius)';

    const zonesRow = document.createElement('div');
    zonesRow.style.display = 'grid';
    zonesRow.style.gridTemplateColumns = `repeat(${Math.min(categories.length, 4)}, 1fr)`;
    zonesRow.style.gap = '16px';

    const message = document.createElement('div');
    message.style.color = 'var(--color-highlight)';
    message.style.textAlign = 'center';
    message.style.fontWeight = '600';
    message.style.fontSize = 'clamp(16px, 1.6vw, 35px)';
    message.style.minHeight = '24px';

    let dragged = null;

    function makeChip(text) {
      const chip = document.createElement('div');
      chip.textContent = text;
      chip.draggable = true;
      chip.tabIndex = 0;
      chip.dataset.item = text;
      chip.style.background = 'var(--color-secondary)';
      chip.style.color = '#0D1B2A';
      chip.style.fontWeight = '700';
      chip.style.padding = '10px 14px';
      chip.style.borderRadius = 'var(--radius-sm)';
      chip.style.cursor = 'grab';
      chip.style.userSelect = 'none';
      chip.style.transition = 'transform 0.2s ease, background 0.3s ease';

      chip.addEventListener('dragstart', () => { dragged = chip; });

      // Click-to-select fallback for touchscreens/projectors without drag support
      chip.addEventListener('click', () => {
        document.querySelectorAll('.dd-chip-selected').forEach(c => c.classList.remove('dd-chip-selected'));
        if (chip.classList.contains('placed')) return;
        chip.classList.add('dd-chip-selected');
        chip.style.outline = '2px solid var(--color-highlight)';
        dragged = chip;
      });
      chip.classList.add('dd-chip');

      return chip;
    }

    items.forEach(it => holding.appendChild(makeChip(it)));

    categories.forEach(cat => {
      const zone = document.createElement('div');
      zone.style.background = 'var(--color-card)';
      zone.style.border = '1px solid var(--color-border)';
      zone.style.borderRadius = 'var(--radius)';
      zone.style.padding = '14px';
      zone.style.minHeight = '120px';

      const label = document.createElement('div');
      label.textContent = cat;
      label.style.color = 'var(--color-accent)';
      label.style.fontWeight = '700';
      label.style.fontSize = 'clamp(14px, 1.4vw, 30px)';
      label.style.marginBottom = '8px';

      const dropArea = document.createElement('div');
      dropArea.style.minHeight = '70px';
      dropArea.style.display = 'flex';
      dropArea.style.flexWrap = 'wrap';
      dropArea.style.gap = '6px';
      dropArea.dataset.category = cat;

      zone.appendChild(label);
      zone.appendChild(dropArea);

      function handleDrop() {
        if (!dragged) return;
        const item = dragged.dataset.item;
        const correctCat = answers[item];
        if (correctCat === cat) {
          dragged.style.background = 'var(--color-success)';
          dragged.style.boxShadow = '0 0 12px rgba(0,200,83,0.6)';
          dragged.textContent = '✓ ' + item;
          dragged.draggable = false;
          dragged.classList.add('placed');
          dropArea.appendChild(dragged);
          placedCorrect++;
          if (placedCorrect === items.length) {
            message.textContent = 'All placed correctly!';
          }
        } else {
          dragged.style.background = 'var(--color-error)';
          dragged.animate(
            [{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' },
             { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }],
            { duration: 300 }
          );
          setTimeout(() => { dragged.style.background = 'var(--color-secondary)'; }, 300);
        }
        dragged.style.outline = 'none';
        dragged.classList.remove('dd-chip-selected');
        dragged = null;
      }

      zone.addEventListener('dragover', e => e.preventDefault());
      zone.addEventListener('drop', e => { e.preventDefault(); handleDrop(); });
      zone.addEventListener('click', () => { if (dragged) handleDrop(); });

      zonesRow.appendChild(zone);
    });

    wrap.appendChild(instruction);
    wrap.appendChild(holding);
    wrap.appendChild(zonesRow);
    wrap.appendChild(message);
    container.appendChild(wrap);
  }

  return { init: build };
})();
