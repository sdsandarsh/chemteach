/**
 * BohrTransitionSim - Interactive electron transition simulation
 * window.BohrTransitionSim.init(container, config)
 */
window.BohrTransitionSim = (() => {
  function build(container, config) {
    container.innerHTML = '';
    
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '20px';
    wrap.style.width = '100%';

    // Info panel for energy gain/loss
    const infoBox = document.createElement('div');
    infoBox.style.background = 'rgba(0, 229, 255, 0.1)';
    infoBox.style.border = '1px solid rgba(0, 229, 255, 0.3)';
    infoBox.style.padding = '15px 20px';
    infoBox.style.borderRadius = 'var(--radius-md)';
    infoBox.style.color = 'var(--color-text)';
    infoBox.style.width = '600px';
    infoBox.style.maxWidth = '100%';
    infoBox.style.textAlign = 'center';
    infoBox.innerHTML = `
      <div style="font-weight: 700; margin-bottom: 5px;">Energy Gain or Loses energy equal to diff. in 2 energy level.</div>
      <div style="font-family: 'Times New Roman', Times, serif; font-size: 1.2rem; margin-bottom: 10px;">&Delta;E = E<sub>f</sub> - E<sub>i</sub></div>
      <div style="color: var(--color-text-muted); font-size: 0.95rem;">Example (Hydrogen): &Delta;E = -3.4 - (-13.6) = 10.2 ev</div>
    `;
    wrap.appendChild(infoBox);

    // Canvas/Stage
    const stage = document.createElement('div');
    stage.style.width = '600px';
    stage.style.height = '500px';
    stage.style.maxWidth = '100%';
    stage.style.position = 'relative';
    stage.style.background = '#0B0F19';
    stage.style.border = '1px solid var(--color-border)';
    stage.style.borderRadius = 'var(--radius-lg)';
    stage.style.overflow = 'hidden';
    stage.style.boxShadow = 'inset 0 0 50px rgba(0,229,255,0.05)';
    
    // Nucleus
    const nucleus = document.createElement('div');
    nucleus.style.position = 'absolute';
    nucleus.style.top = '50%';
    nucleus.style.left = '50%';
    nucleus.style.width = '40px';
    nucleus.style.height = '40px';
    nucleus.style.transform = 'translate(-50%, -50%)';
    nucleus.style.background = 'radial-gradient(circle, #FFF 10%, #FFD740 70%)';
    nucleus.style.borderRadius = '50%';
    nucleus.style.boxShadow = '0 0 20px #FFD740, 0 0 40px #FFD740';
    stage.appendChild(nucleus);

    // Orbits
    const radii = [60, 120, 180, 240];
    radii.forEach((r, i) => {
      const orbit = document.createElement('div');
      orbit.style.position = 'absolute';
      orbit.style.top = '50%';
      orbit.style.left = '50%';
      orbit.style.width = (r * 2) + 'px';
      orbit.style.height = (r * 2) + 'px';
      orbit.style.transform = 'translate(-50%, -50%)';
      orbit.style.border = '1px dashed rgba(0, 229, 255, 0.3)';
      orbit.style.borderRadius = '50%';
      stage.appendChild(orbit);
      
      const label = document.createElement('div');
      label.textContent = 'n=' + (i+1);
      label.style.position = 'absolute';
      label.style.top = '10px';
      label.style.left = '50%';
      label.style.transform = 'translateX(-50%)';
      label.style.color = 'rgba(0, 229, 255, 0.6)';
      label.style.fontSize = 'clamp(12px, 1.2vw, 26px)';
      orbit.appendChild(label);
    });

    // Electron
    const electron = document.createElement('div');
    electron.style.position = 'absolute';
    electron.style.width = '16px';
    electron.style.height = '16px';
    electron.style.background = 'radial-gradient(circle, #FFF 10%, #00E5FF 70%)';
    electron.style.borderRadius = '50%';
    electron.style.boxShadow = '0 0 15px #00E5FF, 0 0 30px #00E5FF';
    electron.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // Start at n=1, right side
    function positionElectron(n) {
      const r = radii[n-1];
      electron.style.top = '50%';
      electron.style.left = `calc(50% + ${r}px)`;
      electron.style.transform = 'translate(-50%, -50%)';
    }
    positionElectron(1);
    stage.appendChild(electron);

    // Photon element (hidden initially)
    const photon = document.createElement('div');
    photon.style.position = 'absolute';
    photon.style.width = '20px';
    photon.style.height = '20px';
    photon.style.borderRadius = '50%';
    photon.style.opacity = '0';
    photon.style.transition = 'all 0.6s linear';
    stage.appendChild(photon);

    // Caption
    const caption = document.createElement('div');
    caption.style.position = 'absolute';
    caption.style.bottom = '20px';
    caption.style.width = '100%';
    caption.style.textAlign = 'center';
    caption.style.color = 'var(--color-text)';
    caption.style.fontSize = 'clamp(16px, 1.6vw, 35px)';
    caption.textContent = 'Awaiting photon...';
    stage.appendChild(caption);

    wrap.appendChild(stage);

    // Controls
    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.gap = '15px';
    controls.style.flexWrap = 'wrap';
    controls.style.justifyContent = 'center';

    const transitions = [
      { nTarget: 2, energy: '10.2 eV', color: '#B388FF', name: 'Lyman Alpha (UV)' },
      { nTarget: 3, energy: '12.1 eV', color: '#FF5252', name: 'Lyman Beta (UV)' },
      { nTarget: 4, energy: '12.75 eV', color: '#00E5FF', name: 'Lyman Gamma (UV)' }
    ];

    let isAnimating = false;

    transitions.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'btn-outline';
      btn.textContent = `Fire ${t.energy} Photon`;
      btn.onclick = () => firePhoton(t);
      controls.appendChild(btn);
    });

    wrap.appendChild(controls);
    container.appendChild(wrap);

    function firePhoton(t) {
      if (isAnimating) return;
      isAnimating = true;
      caption.textContent = `Incoming ${t.energy} photon...`;

      // Photon incoming from left
      photon.style.transition = 'none';
      photon.style.top = '50%';
      photon.style.left = '0%';
      photon.style.transform = 'translate(-50%, -50%)';
      photon.style.background = `radial-gradient(circle, #FFF, ${t.color})`;
      photon.style.boxShadow = `0 0 20px ${t.color}`;
      photon.style.opacity = '1';

      // Animate photon moving to electron
      setTimeout(() => {
        photon.style.transition = 'all 0.8s ease-in';
        // electron is at right side of n=1
        const targetX = stage.offsetWidth / 2 + radii[0];
        photon.style.left = targetX + 'px';
      }, 50);

      // Hit!
      setTimeout(() => {
        photon.style.opacity = '0'; // Photon absorbed
        electron.style.transform = 'translate(-50%, -50%) scale(1.5)';
        electron.style.background = `radial-gradient(circle, #FFF 10%, ${t.color} 70%)`;
        electron.style.boxShadow = `0 0 30px ${t.color}, 0 0 60px ${t.color}`;
        caption.textContent = `Electron absorbs ${t.energy} and excites to n=${t.nTarget}`;
        
        // Jump to target orbit
        setTimeout(() => {
          positionElectron(t.nTarget);
          
          // Linger, then fall back
          setTimeout(() => {
            caption.textContent = 'Electron is unstable, falls back to n=1 emitting a photon!';
            positionElectron(1);
            
            // Emitted photon flying away to right
            setTimeout(() => {
              photon.style.transition = 'none';
              const startX = stage.offsetWidth / 2 + radii[0];
              photon.style.left = startX + 'px';
              photon.style.opacity = '1';
              
              setTimeout(() => {
                photon.style.transition = 'all 0.8s ease-out';
                photon.style.left = '100%';
              }, 50);
              
              // Reset electron styling
              electron.style.transform = 'translate(-50%, -50%) scale(1)';
              electron.style.background = 'radial-gradient(circle, #FFF 10%, #00E5FF 70%)';
              electron.style.boxShadow = '0 0 15px #00E5FF, 0 0 30px #00E5FF';
              
              setTimeout(() => {
                photon.style.opacity = '0';
                caption.textContent = `Emitted ${t.name} photon.`;
                isAnimating = false;
              }, 800);
            }, 800);

          }, 1500);
        }, 400);

      }, 850);
    }
  }

  return { init: build };
})();
