/**
 * IupacNamer - Superheavy Element Synthesizer for IUPAC naming
 * window.IupacNamer.init(container, config)
 */
window.IupacNamer = (() => {
  const ROOTS = {
    '0': { root: 'nil', abbr: 'n' },
    '1': { root: 'un', abbr: 'u' },
    '2': { root: 'bi', abbr: 'b' },
    '3': { root: 'tri', abbr: 't' },
    '4': { root: 'quad', abbr: 'q' },
    '5': { root: 'pent', abbr: 'p' },
    '6': { root: 'hex', abbr: 'h' },
    '7': { root: 'sept', abbr: 's' },
    '8': { root: 'oct', abbr: 'o' },
    '9': { root: 'enn', abbr: 'e' }
  };

  function build(container, config) {
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '20px';
    wrapper.style.width = '100%';
    wrapper.style.maxWidth = '100%';
    wrapper.style.margin = '0 auto';
    wrapper.style.background = 'var(--color-card)';
    wrapper.style.border = '1px solid var(--color-border)';
    wrapper.style.borderRadius = 'var(--radius)';
    wrapper.style.padding = '30px';
    wrapper.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';

    const header = document.createElement('h3');
    header.textContent = 'SUPERHEAVY ELEMENT SYNTHESIZER';
    header.style.margin = '0';
    header.style.color = 'var(--color-accent)';
    header.style.letterSpacing = '2px';

    const inputRow = document.createElement('div');
    inputRow.style.display = 'flex';
    inputRow.style.gap = '10px';
    inputRow.style.alignItems = 'center';

    const label = document.createElement('label');
    label.textContent = 'Enter Atomic Number (Z > 100):';
    label.style.color = 'var(--color-text-muted)';
    label.style.fontWeight = '600';

    const input = document.createElement('input');
    input.type = 'number';
    input.min = '101';
    input.max = '999';
    input.value = '104';
    input.style.padding = '10px';
    input.style.fontSize = '1.2rem';
    input.style.borderRadius = '4px';
    input.style.border = '1px solid var(--color-border)';
    input.style.background = 'var(--color-bg)';
    input.style.color = 'var(--color-text)';
    input.style.width = '100px';
    input.style.textAlign = 'center';

    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = 'SYNTHESIZE NAME';

    inputRow.appendChild(label);
    inputRow.appendChild(input);
    inputRow.appendChild(btn);

    const displayArea = document.createElement('div');
    displayArea.style.display = 'flex';
    displayArea.style.flexDirection = 'column';
    displayArea.style.alignItems = 'center';
    displayArea.style.gap = '15px';
    displayArea.style.marginTop = '20px';
    displayArea.style.minHeight = '150px';

    wrapper.appendChild(header);
    wrapper.appendChild(inputRow);
    wrapper.appendChild(displayArea);
    container.appendChild(wrapper);

    btn.onclick = () => {
      displayArea.innerHTML = '';
      const z = input.value.trim();
      if (!z || isNaN(z) || parseInt(z) < 101) {
        displayArea.innerHTML = '<span style="color:#E53935">Please enter a valid atomic number > 100.</span>';
        return;
      }

      const digits = z.split('');
      const parts = [];
      let finalName = '';
      let symbol = '';

      digits.forEach((d, idx) => {
        const rootInfo = ROOTS[d];
        let rootStr = rootInfo.root;
        
        if (idx === 0) {
          rootStr = rootStr.charAt(0).toUpperCase() + rootStr.slice(1);
          symbol += rootInfo.abbr.toUpperCase();
        } else {
          symbol += rootInfo.abbr;
        }

        // IUPAC suffix rules
        if (idx === digits.length - 1) {
          if (rootStr.endsWith('i')) {
            rootStr += 'um'; // bi -> bium, tri -> trium
          } else if (rootStr === 'enn') {
            rootStr = 'ennium';
          } else {
            rootStr += 'ium';
          }
        } else {
            // handle enn + nil -> ennil
            if (rootStr === 'enn' && digits[idx+1] === '0') {
               rootStr = 'en'; // to make ennil
            }
        }

        parts.push({ digit: d, text: rootStr });
        finalName += rootStr;
      });

      // Special cleanup for final name
      finalName = finalName.replace('nnil', 'nil'); // enn + nil -> ennil
      finalName = finalName.replace('iium', 'ium'); // bi + ium -> bium

      const breakdownRow = document.createElement('div');
      breakdownRow.style.display = 'flex';
      breakdownRow.style.gap = '10px';

      parts.forEach((p, i) => {
        const box = document.createElement('div');
        box.style.display = 'flex';
        box.style.flexDirection = 'column';
        box.style.alignItems = 'center';
        box.style.background = 'var(--color-bg)';
        box.style.border = '1px solid var(--color-border)';
        box.style.borderRadius = '8px';
        box.style.padding = '10px 20px';
        
        const numLabel = document.createElement('div');
        numLabel.textContent = p.digit;
        numLabel.style.fontSize = '2rem';
        numLabel.style.fontWeight = 'bold';
        numLabel.style.color = 'var(--color-accent)';
        
        const textLabel = document.createElement('div');
        textLabel.textContent = p.text;
        textLabel.style.fontSize = '1.2rem';
        textLabel.style.color = 'var(--color-text)';

        box.appendChild(numLabel);
        box.appendChild(textLabel);
        
        box.style.opacity = '0';
        box.style.transform = 'translateY(20px)';
        box.style.transition = 'all 0.4s ease';

        breakdownRow.appendChild(box);

        if (i < parts.length - 1) {
          const plus = document.createElement('div');
          plus.textContent = '+';
          plus.style.fontSize = '2rem';
          plus.style.color = 'var(--color-text-muted)';
          plus.style.alignSelf = 'center';
          plus.style.opacity = '0';
          plus.style.transition = 'opacity 0.4s ease';
          breakdownRow.appendChild(plus);
          
          setTimeout(() => {
            plus.style.opacity = '1';
          }, (i * 300) + 150);
        }

        setTimeout(() => {
          box.style.opacity = '1';
          box.style.transform = 'translateY(0)';
        }, i * 300);
      });

      displayArea.appendChild(breakdownRow);

      const resultBox = document.createElement('div');
      resultBox.style.marginTop = '20px';
      resultBox.style.textAlign = 'center';
      resultBox.style.opacity = '0';
      resultBox.style.transform = 'scale(0.8)';
      resultBox.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

      const nameEl = document.createElement('div');
      nameEl.textContent = finalName;
      nameEl.style.fontSize = '2.5rem';
      nameEl.style.fontWeight = 'bold';
      nameEl.style.color = 'var(--color-accent)';
      nameEl.style.textShadow = '0 0 10px rgba(0, 229, 255, 0.3)';

      const symbolEl = document.createElement('div');
      symbolEl.textContent = `Symbol: ${symbol}`;
      symbolEl.style.fontSize = '1.2rem';
      symbolEl.style.color = 'var(--color-text-muted)';
      symbolEl.style.marginTop = '5px';

      resultBox.appendChild(nameEl);
      resultBox.appendChild(symbolEl);
      displayArea.appendChild(resultBox);

      setTimeout(() => {
        resultBox.style.opacity = '1';
        resultBox.style.transform = 'scale(1)';
      }, digits.length * 300 + 200);
    };
    
    // Auto-trigger on init
    setTimeout(() => btn.onclick(), 500);
  }

  return { init: build };
})();
