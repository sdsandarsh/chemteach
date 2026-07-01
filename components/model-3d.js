/**
 * Model3D — CSS 3D transform molecular/orbital model viewer. No WebGL.
 * window.Model3D.init(container, config)
 * config: { model, labels, rotatable, caption }
 */
window.Model3D = (() => {
  function atom(x, y, z, size, color, label, orbit, glow) {
    return { type: 'atom', x, y, z, size, color, label, orbit, glow };
  }
  function bond(x1, y1, z1, x2, y2, z2, color) {
    return { type: 'bond', x1, y1, z1, x2, y2, z2, color };
  }
  function ring(x, y, z, radius, color) {
    return { type: 'ring', x, y, z, radius, color };
  }

  const MODELS = {
    'atom-bohr': () => {
      const els = [atom(0, 0, 0, 40, '#FFD740', '', null, true)];
      
      // Orbit n=1
      els.push(ring(0, 0, 0, 70, 'rgba(0, 229, 255, 0.3)'));
      for (let i = 0; i < 2; i++) {
        const a = i * Math.PI;
        els.push(atom(0, 0, 0, 14, '#00E5FF', '', { radius: 70, angle: a, speed: 0.02 }, true));
      }
      
      // Orbit n=2
      els.push(ring(0, 0, 0, 130, 'rgba(0, 229, 255, 0.3)'));
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        els.push(atom(0, 0, 0, 12, '#00E5FF', '', { radius: 130, angle: a, speed: 0.01 }, true));
      }
      return els;
    },
    'orbital-sp': () => [
      atom(0, 0, 0, 50, 'rgba(0,180,204,0.5)', 's orbital'),
      atom(-90, 0, 0, 26, 'rgba(0,229,255,0.6)', 'p lobe'),
      atom(90, 0, 0, 26, 'rgba(0,229,255,0.6)', 'p lobe')
    ],
    'water-molecule': () => [
      atom(0, 0, 0, 34, '#FF5252', 'O'),
      atom(-70, 50, 0, 20, '#FFFFFF', 'H'),
      atom(70, 50, 0, 20, '#FFFFFF', 'H'),
      bond(0, 0, 0, -70, 50, 0, '#FFFFFF'),
      bond(0, 0, 0, 70, 50, 0, '#FFFFFF')
    ],
    'co2-linear': () => [
      atom(-100, 0, 0, 24, '#FF5252', 'O'),
      atom(0, 0, 0, 30, '#333333', 'C'),
      atom(100, 0, 0, 24, '#FF5252', 'O'),
      bond(-100, 0, 0, 0, 0, 0, '#FFFFFF'),
      bond(0, 0, 0, 100, 0, 0, '#FFFFFF')
    ],
    'methane-tetra': () => [
      atom(0, 0, 0, 30, '#333333', 'C'),
      atom(0, -90, 0, 18, '#FFFFFF', 'H'),
      atom(85, 45, 30, 18, '#FFFFFF', 'H'),
      atom(-85, 45, 30, 18, '#FFFFFF', 'H'),
      atom(0, 45, -90, 18, '#FFFFFF', 'H'),
      bond(0, 0, 0, 0, -90, 0, '#FFFFFF'),
      bond(0, 0, 0, 85, 45, 30, '#FFFFFF'),
      bond(0, 0, 0, -85, 45, 30, '#FFFFFF'),
      bond(0, 0, 0, 0, 45, -90, '#FFFFFF')
    ],
    'nacl-crystal': () => {
      const els = [];
      for (let x = -1; x <= 1; x++)
        for (let y = -1; y <= 1; y++)
          for (let z = -1; z <= 1; z++) {
            const isNa = (x + y + z) % 2 === 0;
            els.push(atom(x * 50, y * 50, z * 50, isNa ? 16 : 22,
              isNa ? '#00E5FF' : '#FFD740', isNa ? 'Na+' : 'Cl-'));
          }
      return els;
    },
    'benzene-ring': () => {
      const els = [];
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        const x = Math.cos(a) * 90, y = Math.sin(a) * 90;
        els.push(atom(x, y, 0, 22, '#333333', 'C'));
        const a2 = ((i + 1) / 6) * Math.PI * 2;
        els.push(bond(x, y, 0, Math.cos(a2) * 90, Math.sin(a2) * 90, 0, '#00B4CC'));
      }
      return els;
    },
    'ethene-planar': () => [
      atom(-50, 0, 0, 26, '#333333', 'C'),
      atom(50, 0, 0, 26, '#333333', 'C'),
      atom(-110, -60, 0, 16, '#FFFFFF', 'H'),
      atom(-110, 60, 0, 16, '#FFFFFF', 'H'),
      atom(110, -60, 0, 16, '#FFFFFF', 'H'),
      atom(110, 60, 0, 16, '#FFFFFF', 'H'),
      bond(-50, 0, 0, 50, 0, 0, '#00E5FF'),
      bond(-50, 0, 0, -110, -60, 0, '#FFFFFF'),
      bond(-50, 0, 0, -110, 60, 0, '#FFFFFF'),
      bond(50, 0, 0, 110, -60, 0, '#FFFFFF'),
      bond(50, 0, 0, 110, 60, 0, '#FFFFFF')
    ]
  };

  function build(container, config) {
    const modelName = config.model || 'atom-bohr';
    const elements = (MODELS[modelName] || MODELS['atom-bohr'])();
    let showLabels = true;
    let rotX = -20, rotY = 20;

    container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '16px';

    const stage = document.createElement('div');
    stage.style.width = '500px';
    stage.style.height = '420px';
    stage.style.maxWidth = '100%';
    stage.style.perspective = '900px';
    stage.style.position = 'relative';
    stage.style.cursor = 'grab';
    stage.style.border = '1px solid var(--color-border)';
    stage.style.borderRadius = 'var(--radius)';
    stage.style.background = 'var(--color-card)';
    stage.style.overflow = 'hidden';

    const scene = document.createElement('div');
    scene.style.width = '0';
    scene.style.height = '0';
    scene.style.position = 'absolute';
    scene.style.top = '50%';
    scene.style.left = '50%';
    scene.style.transformStyle = 'preserve-3d';



    elements.forEach(el => {
      if (el.type === 'atom') {
        const dot = document.createElement('div');
        dot.style.position = 'absolute';
        dot.style.width = el.size + 'px';
        dot.style.height = el.size + 'px';
        dot.style.borderRadius = '50%';
        
        if (el.glow) {
          dot.style.background = `radial-gradient(circle, #FFFFFF 10%, ${el.color} 70%)`;
          dot.style.boxShadow = `0 0 20px ${el.color}, 0 0 40px ${el.color}`;
        } else {
          dot.style.background = `radial-gradient(circle at 30% 30%, #FFFFFF 10%, ${el.color} 80%)`;
          dot.style.boxShadow = `0 4px 10px rgba(0,0,0,0.5)`;
        }

        if (el.orbit) {
          el.x = Math.cos(el.orbit.angle) * el.orbit.radius;
          el.y = Math.sin(el.orbit.angle) * el.orbit.radius;
        }
        dot.style.left = (el.x - el.size / 2) + 'px';
        dot.style.top = (el.y - el.size / 2) + 'px';
        dot.style.transform = `translateZ(${el.z}px)`;
        dot.style.display = 'flex';
        dot.style.alignItems = 'center';
        dot.style.justifyContent = 'center';
        dot.style.fontSize = 'clamp(12px, 1.2vw, 26px)';
        dot.style.color = '#FFFFFF';
        dot.style.textShadow = '0 1px 3px rgba(0,0,0,0.8)';
        dot.style.fontWeight = 'bold';
        
        if (el.label) {
          const lbl = document.createElement('span');
          lbl.textContent = el.label;
          lbl.className = 'model3d-label';
          lbl.style.display = showLabels ? 'block' : 'none';
          dot.appendChild(lbl);
          dot.dataset.labelEl = '1';
        }
        
        el.domElement = dot;
        scene.appendChild(dot);
      } else if (el.type === 'ring') {
        const rEl = document.createElement('div');
        rEl.style.position = 'absolute';
        rEl.style.width = (el.radius * 2) + 'px';
        rEl.style.height = (el.radius * 2) + 'px';
        rEl.style.border = `2px solid ${el.color}`;
        rEl.style.borderRadius = '50%';
        rEl.style.left = (el.x - el.radius) + 'px';
        rEl.style.top = (el.y - el.radius) + 'px';
        rEl.style.transform = `translateZ(${el.z}px)`;
        rEl.style.pointerEvents = 'none';
        scene.appendChild(rEl);
      } else {
        const dx = el.x2 - el.x1, dy = el.y2 - el.y1, dz = el.z2 - el.z1;
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const bondEl = document.createElement('div');
        bondEl.style.position = 'absolute';
        bondEl.style.width = len + 'px';
        bondEl.style.height = '4px';
        bondEl.style.background = el.color;
        bondEl.style.left = el.x1 + 'px';
        bondEl.style.top = el.y1 + 'px';
        const yaw = Math.atan2(dy, dx) * 180 / Math.PI;
        const pitch = Math.atan2(dz, Math.sqrt(dx * dx + dy * dy)) * 180 / Math.PI;
        bondEl.style.transformOrigin = '0 50%';
        bondEl.style.transform = `translateZ(${el.z1}px) rotateZ(${yaw}deg) rotateY(${-pitch}deg)`;
        scene.appendChild(bondEl);
      }
    });

    stage.appendChild(scene);
    wrap.appendChild(stage);

    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.gap = '12px';

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'RESET VIEW';
    resetBtn.className = 'btn-outline';

    const labelBtn = document.createElement('button');
    labelBtn.textContent = 'TOGGLE LABELS';
    labelBtn.className = 'btn-outline';

    controls.appendChild(resetBtn);
    controls.appendChild(labelBtn);
    wrap.appendChild(controls);

    const captionEl = document.createElement('div');
    captionEl.style.color = 'var(--color-text-muted)';
    captionEl.style.fontSize = 'clamp(14px, 1.4vw, 30px)';
    captionEl.style.textAlign = 'center';
    captionEl.textContent = config.caption || '';
    wrap.appendChild(captionEl);

    container.appendChild(wrap);

    let dragging = false, lastX = 0, lastY = 0;
    stage.addEventListener('mousedown', e => {
      if (config.rotatable === false) return;
      dragging = true; lastX = e.clientX; lastY = e.clientY;
      stage.style.cursor = 'grabbing';
    });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      rotY += (e.clientX - lastX) * 0.5;
      rotX -= (e.clientY - lastY) * 0.5;
      lastX = e.clientX; lastY = e.clientY;
      render();
    });
    window.addEventListener('mouseup', () => { dragging = false; stage.style.cursor = 'grab'; });

    resetBtn.onclick = () => { rotX = -20; rotY = 20; };
    labelBtn.onclick = () => {
      showLabels = !showLabels;
      scene.querySelectorAll('.model3d-label').forEach(l => {
        l.style.display = showLabels ? 'block' : 'none';
      });
    };

    function renderLoop() {
      if (!document.body.contains(scene)) return; // Stop animation if removed
      
      scene.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      
      elements.forEach(el => {
        if (el.type === 'atom' && el.orbit && el.domElement) {
          el.orbit.angle += el.orbit.speed;
          el.x = Math.cos(el.orbit.angle) * el.orbit.radius;
          el.y = Math.sin(el.orbit.angle) * el.orbit.radius;
          el.domElement.style.left = (el.x - el.size / 2) + 'px';
          el.domElement.style.top = (el.y - el.size / 2) + 'px';
        }
      });
      
      requestAnimationFrame(renderLoop);
    }
    
    renderLoop();
  }

  return { init: build };
})();
