/**
 * Analogy — side-by-side real-world vs chemistry comparison.
 * window.Analogy.init(container, config)
 * config: { realWorld: {label, visual, fact}, chemistry: {label, visual, fact}, bridge }
 */
window.Analogy = (() => {
  const VISUALS = {
    'card-deck': '<svg viewBox="0 0 200 120">' +
      // Draw 3 cards overlapping
      '<rect x="30" y="20" width="40" height="60" rx="4" fill="#FFFFFF" stroke="var(--color-accent)"/>' +
      '<text x="50" y="55" font-size="24" fill="#E53935" text-anchor="middle">♥</text>' +
      '<rect x="70" y="30" width="40" height="60" rx="4" fill="#FFFFFF" stroke="var(--color-accent)"/>' +
      '<text x="90" y="65" font-size="24" fill="#1E1E1E" text-anchor="middle">♠</text>' +
      '<rect x="110" y="40" width="40" height="60" rx="4" fill="#FFFFFF" stroke="var(--color-accent)"/>' +
      '<text x="130" y="75" font-size="24" fill="#E53935" text-anchor="middle">♦</text>' +
      '</svg>',
    'eggs-dozen': '<svg viewBox="0 0 200 120"><rect x="10" y="10" width="180" height="100" rx="10" fill="var(--color-card-hover)" stroke="var(--color-accent)" stroke-width="2"/>' +
      Array.from({length:12}).map((_,i)=>`<ellipse cx="${30+(i%4)*40}" cy="${35+Math.floor(i/4)*35}" rx="14" ry="18" fill="var(--color-text-body)"/>`).join('') + '</svg>',
    'mole-atoms': '<svg viewBox="0 0 200 120">' +
      Array.from({length:18}).map((_,i)=>`<circle cx="${15+(i%6)*32}" cy="${20+Math.floor(i/6)*35}" r="10" fill="var(--color-secondary)"/>`).join('') + '</svg>',
    'stadium-crowd': '<svg viewBox="0 0 200 120"><rect width="200" height="120" fill="var(--color-card-hover)"/>' +
      Array.from({length:8}).map((_,i)=>`<circle cx="${15+i*12}" cy="20" r="4" fill="var(--color-warning)"/>`).join('') +
      Array.from({length:6}).map((_,i)=>`<circle cx="${20+i*22}" cy="55" r="4" fill="var(--color-secondary)"/>`).join('') +
      Array.from({length:4}).map((_,i)=>`<circle cx="${30+i*40}" cy="95" r="4" fill="var(--color-text-muted)"/>`).join('') + '</svg>',
    'water-cycle': '<svg viewBox="0 0 200 120"><rect width="200" height="120" fill="var(--color-card-hover)"/><path d="M10 100 Q100 40 190 100" stroke="var(--color-secondary)" fill="none" stroke-width="3"/><circle cx="60" cy="30" r="15" fill="var(--color-text-body)"/><circle cx="140" cy="25" r="12" fill="var(--color-text-body)"/></svg>',
    'lock-key': '<svg viewBox="0 0 200 120"><rect x="70" y="50" width="60" height="50" rx="8" fill="var(--color-accent)"/><circle cx="100" cy="45" r="20" fill="none" stroke="var(--color-accent)" stroke-width="10"/><rect x="95" y="65" width="10" height="20" fill="var(--color-warning)"/></svg>',
    'traffic-light': '<svg viewBox="0 0 200 120"><rect x="80" y="10" width="40" height="100" rx="10" fill="var(--color-card-hover)" stroke="var(--color-secondary)"/><circle cx="100" cy="30" r="12" fill="var(--color-error)"/><circle cx="100" cy="60" r="12" fill="var(--color-warning)"/><circle cx="100" cy="90" r="12" fill="var(--color-success)"/></svg>',
    'see-saw': '<svg viewBox="0 0 200 120"><rect x="90" y="80" width="20" height="20" fill="var(--color-accent)"/><line x1="30" y1="70" x2="170" y2="50" stroke="var(--color-secondary)" stroke-width="6"/><circle cx="30" cy="70" r="14" fill="var(--color-warning)"/><circle cx="170" cy="50" r="14" fill="var(--color-secondary)"/></svg>'
  };

  function panel(side, data) {
    const div = document.createElement('div');
    div.style.flex = '1';
    // Use card color for the panel
    div.style.background = 'var(--color-card)';
    div.style.border = '1px solid var(--color-border)';
    div.style.borderRadius = 'var(--radius)';
    div.style.padding = '24px';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.gap = '12px';
    div.style.minWidth = '260px';
    div.style.boxShadow = 'var(--shadow)';

    const label = document.createElement('div');
    label.textContent = data.label || '';
    label.style.color = 'var(--color-accent)';
    label.style.fontWeight = '700';
    label.style.fontSize = '14px';
    label.style.letterSpacing = '1px';

    const visual = document.createElement('div');
    visual.style.width = '100%';
    visual.style.maxWidth = '250px';
    visual.style.margin = '10px auto';
    visual.style.minHeight = '130px';
    
    if (data.visual === 'car-camera-sim') {
      buildCarSim(visual);
    } else if (data.visual === 'electron-sim') {
      buildElectronSim(visual);
    } else {
      visual.innerHTML = VISUALS[data.visual] || '';
    }

    const fact = document.createElement('div');
    fact.innerHTML = data.fact || '';
    fact.style.color = 'var(--color-text-body)';
    fact.style.fontSize = '16px';
    fact.style.lineHeight = '1.5';

    div.appendChild(label);
    div.appendChild(visual);
    div.appendChild(fact);
    return div;
  }

  function buildCarSim(container) {
    container.innerHTML = `
      <div style="width:100%; display:flex; flex-direction:column; gap:15px; align-items:center; margin-top: 10px;">
         <div id="car-stage" style="width: 100%; max-width: 250px; height: 60px; background: #111; border: 2px solid #333; border-radius: 8px; position: relative; overflow: hidden; box-shadow: inset 0 0 10px black;">
            <!-- Road lines -->
            <div style="position:absolute; top:50%; left:0; right:0; height:2px; background: repeating-linear-gradient(90deg, transparent, transparent 10px, #555 10px, #555 20px);"></div>
            <!-- Car -->
            <div id="car-entity" style="width: 30px; height: 12px; background: var(--color-error); border-radius: 4px; position: absolute; top: 24px; left: 0; box-shadow: 0 0 10px var(--color-error); transition: width 0.1s, filter 0.1s;"></div>
            <!-- Flash -->
            <div id="camera-flash" style="position:absolute; inset:0; background:white; opacity:0; pointer-events:none;"></div>
         </div>
         <div style="display:flex; gap: 8px; width:100%; justify-content:center;">
            <button id="btn-fast" class="btn" style="padding: 6px 12px; font-size: 0.75rem; min-width: 0;">Fast Flash</button>
            <button id="btn-long" class="btn" style="padding: 6px 12px; font-size: 0.75rem; min-width: 0;">Long Exposure</button>
         </div>
      </div>
    `;
    
    const car = container.querySelector('#car-entity');
    const flash = container.querySelector('#camera-flash');
    const btnFast = container.querySelector('#btn-fast');
    const btnLong = container.querySelector('#btn-long');
    
    let pos = -40;
    let isMoving = true;
    
    function loop() {
      if (isMoving) {
        pos += 3;
        if (pos > 260) pos = -40;
        car.style.left = pos + 'px';
      }
      requestAnimationFrame(loop);
    }
    loop();
    
    function triggerPhoto(isFast) {
      if (!isMoving) return;
      isMoving = false;
      btnFast.disabled = true;
      btnLong.disabled = true;
      
      if (isFast) {
        car.style.width = '30px';
        car.style.filter = 'none';
        car.style.transform = 'none';
        
        flash.style.transition = 'none';
        flash.style.opacity = '1';
        setTimeout(() => {
          flash.style.transition = 'opacity 0.2s';
          flash.style.opacity = '0';
        }, 30);
      } else {
        car.style.width = '80px';
        car.style.filter = 'blur(4px)';
        car.style.transform = 'translateX(-25px)';
        
        flash.style.transition = 'none';
        flash.style.opacity = '0.5';
        setTimeout(() => {
          flash.style.transition = 'opacity 1s';
          flash.style.opacity = '0';
        }, 50);
      }
      
      setTimeout(() => {
        car.style.width = '30px';
        car.style.filter = 'none';
        car.style.transform = 'none';
        isMoving = true;
        btnFast.disabled = false;
        btnLong.disabled = false;
      }, 1500);
    }
    
    btnFast.onclick = () => triggerPhoto(true);
    btnLong.onclick = () => triggerPhoto(false);
  }

  function buildElectronSim(container) {
    container.innerHTML = `
      <div style="width:100%; display:flex; flex-direction:column; gap:15px; align-items:center; margin-top: 10px;">
         <div style="width: 100%; max-width: 250px; height: 60px; background: #000511; border: 2px solid #224; border-radius: 8px; position: relative; overflow: hidden;">
            <div id="elec-wave" style="position:absolute; inset:0; background: radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.4) 0%, transparent 60%); opacity: 1; transition: opacity 0.3s, background 0.3s;"></div>
            <div id="elec-particle" style="width: 6px; height: 6px; background: #FFF; border-radius: 50%; position: absolute; top: 27px; left: 122px; box-shadow: 0 0 8px #FFF; opacity: 0;"></div>
         </div>
         <div style="display:flex; gap: 8px; width:100%; justify-content:center;">
            <button id="btn-pos" class="btn" style="padding: 6px 12px; font-size: 0.75rem; min-width: 0;">Measure Pos</button>
            <button id="btn-mom" class="btn" style="padding: 6px 12px; font-size: 0.75rem; min-width: 0;">Measure Mom</button>
         </div>
      </div>
    `;
    
    const wave = container.querySelector('#elec-wave');
    const particle = container.querySelector('#elec-particle');
    const btnPos = container.querySelector('#btn-pos');
    const btnMom = container.querySelector('#btn-mom');
    
    let waveScale = 0;
    let waveActive = true;
    function loop() {
      if (waveActive) {
        waveScale += 0.05;
        wave.style.transform = \`scale(\${1 + Math.sin(waveScale)*0.1})\`;
      }
      requestAnimationFrame(loop);
    }
    loop();
    
    btnPos.onclick = () => {
      btnPos.disabled = true;
      btnMom.disabled = true;
      waveActive = false;
      wave.style.opacity = '0';
      
      particle.style.transition = 'none';
      particle.style.opacity = '1';
      particle.style.left = (40 + Math.random()*160) + 'px';
      particle.style.top = (10 + Math.random()*40) + 'px';
      
      setTimeout(() => {
        particle.style.transition = 'all 0.2s ease-out';
        particle.style.left = (Math.random() > 0.5 ? 300 : -20) + 'px';
        particle.style.top = (Math.random() > 0.5 ? 100 : -20) + 'px';
      }, 300);
      
      setTimeout(() => {
        waveActive = true;
        wave.style.opacity = '1';
        particle.style.opacity = '0';
        btnPos.disabled = false;
        btnMom.disabled = false;
      }, 1500);
    };
    
    btnMom.onclick = () => {
      btnPos.disabled = true;
      btnMom.disabled = true;
      wave.style.background = 'linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.6), transparent)';
      wave.style.transform = 'none';
      waveActive = false;
      
      setTimeout(() => {
        wave.style.background = 'radial-gradient(circle at 50% 50%, rgba(0, 229, 255, 0.4) 0%, transparent 60%)';
        waveActive = true;
        btnPos.disabled = false;
        btnMom.disabled = false;
      }, 1500);
    };
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
    row.appendChild(panel('left', config.realWorld || {}));
    row.appendChild(panel('right', config.chemistry || {}));

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
