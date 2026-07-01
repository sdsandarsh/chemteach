/**
 * QuantumExplorer - Interactive Quantum Numbers Builder
 * window.QuantumExplorer.init(container, config)
 */
window.QuantumExplorer = (() => {
  const L_NAMES = { 0: 's', 1: 'p', 2: 'd', 3: 'f' };
  
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
    wrapper.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';

    const header = document.createElement('h3');
    header.textContent = 'BUILD A QUANTUM ADDRESS';
    header.style.margin = '0';
    header.style.color = 'var(--color-accent)';
    header.style.letterSpacing = '2px';
    wrapper.appendChild(header);

    const controlsRow = document.createElement('div');
    controlsRow.style.display = 'flex';
    controlsRow.style.width = '100%';
    controlsRow.style.justifyContent = 'space-between';
    controlsRow.style.gap = '15px';

    const cols = {};
    const state = { n: null, l: null, m: null, s: null };

    const columns = [
      { id: 'n', name: 'Principal (n)', desc: 'Shell (Size)', color: '#00B4CC' },
      { id: 'l', name: 'Azimuthal (l)', desc: 'Subshell (Shape)', color: '#00E5FF' },
      { id: 'm', name: 'Magnetic (m)', desc: 'Orientation', color: '#1A6B8A' },
      { id: 's', name: 'Spin (s)', desc: 'Electron Spin', color: '#FFD740' }
    ];

    columns.forEach(col => {
      const colDiv = document.createElement('div');
      colDiv.style.flex = '1';
      colDiv.style.display = 'flex';
      colDiv.style.flexDirection = 'column';
      colDiv.style.gap = '10px';
      
      const title = document.createElement('div');
      title.textContent = col.name;
      title.style.fontWeight = 'bold';
      title.style.color = col.color;
      title.style.textAlign = 'center';
      
      const desc = document.createElement('div');
      desc.textContent = col.desc;
      desc.style.fontSize = '0.8rem';
      desc.style.color = 'var(--color-text-muted)';
      desc.style.textAlign = 'center';

      const optionsBox = document.createElement('div');
      optionsBox.style.display = 'flex';
      optionsBox.style.flexDirection = 'column';
      optionsBox.style.gap = '8px';
      optionsBox.style.minHeight = '150px';

      colDiv.appendChild(title);
      colDiv.appendChild(desc);
      colDiv.appendChild(optionsBox);
      controlsRow.appendChild(colDiv);

      cols[col.id] = { box: optionsBox, color: col.color };
    });

    wrapper.appendChild(controlsRow);

    const resultBox = document.createElement('div');
    resultBox.style.marginTop = '20px';
    resultBox.style.padding = '20px';
    resultBox.style.borderRadius = '8px';
    resultBox.style.background = 'var(--color-bg)';
    resultBox.style.border = '1px solid var(--color-border)';
    resultBox.style.width = '100%';
    resultBox.style.textAlign = 'center';
    resultBox.style.minHeight = '100px';
    resultBox.style.display = 'flex';
    resultBox.style.flexDirection = 'column';
    resultBox.style.alignItems = 'center';
    resultBox.style.justifyContent = 'center';
    wrapper.appendChild(resultBox);

    container.appendChild(wrapper);

    function createBtn(text, value, type, onClick) {
      const btn = document.createElement('button');
      btn.textContent = text;
      btn.style.padding = '8px';
      btn.style.background = 'transparent';
      btn.style.border = `1px solid ${cols[type].color}`;
      btn.style.color = 'var(--color-text)';
      btn.style.borderRadius = '4px';
      btn.style.cursor = 'pointer';
      btn.style.transition = 'all 0.2s';
      btn.onclick = () => {
        const siblings = btn.parentElement.querySelectorAll('button');
        siblings.forEach(s => {
          s.style.background = 'transparent';
          s.style.color = 'var(--color-text)';
        });
        btn.style.background = cols[type].color;
        btn.style.color = '#000';
        onClick(value);
      };
      return btn;
    }

    function renderN() {
      cols.n.box.innerHTML = '';
      [1, 2, 3, 4].forEach(val => {
        cols.n.box.appendChild(createBtn(`n = ${val}`, val, 'n', (v) => {
          state.n = v;
          state.l = null; state.m = null; state.s = null;
          renderL();
          renderM();
          renderS();
          updateResult();
        }));
      });
    }

    function renderL() {
      cols.l.box.innerHTML = '';
      if (!state.n) return;
      for (let i = 0; i < state.n; i++) {
        const name = L_NAMES[i];
        cols.l.box.appendChild(createBtn(`l = ${i} (${name})`, i, 'l', (v) => {
          state.l = v;
          state.m = null; state.s = null;
          renderM();
          renderS();
          updateResult();
        }));
      }
    }

    function renderM() {
      cols.m.box.innerHTML = '';
      if (state.l === null) return;
      for (let i = -state.l; i <= state.l; i++) {
        let text = i > 0 ? `+${i}` : i;
        cols.m.box.appendChild(createBtn(`m = ${text}`, i, 'm', (v) => {
          state.m = v;
          state.s = null;
          renderS();
          updateResult();
        }));
      }
    }

    function renderS() {
      cols.s.box.innerHTML = '';
      if (state.m === null) return;
      ['+1/2', '-1/2'].forEach(val => {
        cols.s.box.appendChild(createBtn(`s = ${val}`, val, 's', (v) => {
          state.s = v;
          updateResult();
        }));
      });
    }

    function updateResult() {
      resultBox.innerHTML = '';
      if (state.n !== null && state.l !== null && state.m !== null && state.s !== null) {
        const orbital = `${state.n}${L_NAMES[state.l]}`;
        const title = document.createElement('div');
        title.innerHTML = `Valid Quantum Address: <strong style="color:var(--color-accent); font-size:1.5rem">${orbital} electron</strong>`;
        title.style.marginBottom = '10px';
        resultBox.appendChild(title);
        
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        resultBox.appendChild(canvas);
        drawOrbital(canvas.getContext('2d'), state.l);
        
        const rule = document.createElement('div');
        rule.textContent = `Address: [${state.n}, ${state.l}, ${state.m > 0 ? '+'+state.m : state.m}, ${state.s}]`;
        rule.style.color = 'var(--color-text-muted)';
        rule.style.marginTop = '10px';
        rule.style.fontFamily = 'monospace';
        resultBox.appendChild(rule);
      } else {
        resultBox.innerHTML = '<span style="color:var(--color-text-muted)">Select all four quantum numbers to reveal the address.</span>';
      }
    }

    function drawOrbital(ctx, l) {
      ctx.clearRect(0, 0, 100, 100);
      const cx = 50, cy = 50;
      ctx.fillStyle = 'rgba(0, 229, 255, 0.6)';
      ctx.strokeStyle = 'var(--color-accent)';
      ctx.lineWidth = 1;

      if (l === 0) {
        // s-orbital (circle)
        ctx.beginPath();
        ctx.arc(cx, cy, 30, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
      } else if (l === 1) {
        // p-orbital (dumbbell)
        ctx.beginPath();
        ctx.ellipse(cx, cy - 25, 15, 25, 0, 0, Math.PI*2);
        ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx, cy + 25, 15, 25, 0, 0, Math.PI*2);
        ctx.fill(); ctx.stroke();
      } else if (l === 2) {
        // d-orbital (clover)
        ctx.beginPath();
        ctx.ellipse(cx - 20, cy - 20, 12, 20, Math.PI/4, 0, Math.PI*2);
        ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx + 20, cy + 20, 12, 20, Math.PI/4, 0, Math.PI*2);
        ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx - 20, cy + 20, 12, 20, -Math.PI/4, 0, Math.PI*2);
        ctx.fill(); ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(cx + 20, cy - 20, 12, 20, -Math.PI/4, 0, Math.PI*2);
        ctx.fill(); ctx.stroke();
      } else if (l === 3) {
        // f-orbital (complex)
        for(let i=0; i<6; i++) {
           const angle = i * Math.PI / 3;
           const px = cx + Math.cos(angle) * 20;
           const py = cy + Math.sin(angle) * 20;
           ctx.beginPath();
           ctx.ellipse(px, py, 10, 20, angle, 0, Math.PI*2);
           ctx.fill(); ctx.stroke();
        }
      }
      
      // nucleus
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI*2);
      ctx.fill();
    }

    renderN();
    updateResult();
  }

  return { init: build };
})();
