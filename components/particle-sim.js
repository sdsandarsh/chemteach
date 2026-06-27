/**
 * ParticleSim — Canvas particle simulation for states of matter.
 * window.ParticleSim.init(container, config)
 * config: { initialState, particleColor, particleCount, labels, caption }
 */
window.ParticleSim = (() => {
  const STATES = ['solid', 'liquid', 'gas'];

  function build(container, config) {
    const particleColor = config.particleColor || '#00B4CC';
    const particleCount = Math.min(config.particleCount || 60, 70);
    const labels = config.labels || {};
    let state = config.initialState || 'solid';

    container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '16px';

    const canvas = document.createElement('canvas');
    canvas.width = 700;
    canvas.height = 420;
    canvas.style.background = 'var(--color-bg)';
    canvas.style.border = '1px solid var(--color-border)';
    canvas.style.borderRadius = 'var(--radius)';
    canvas.style.maxWidth = '100%';

    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.gap = '12px';

    const heatBtn = document.createElement('button');
    heatBtn.textContent = 'HEAT';
    heatBtn.className = 'btn';
    heatBtn.style.background = 'var(--color-warning)';

    const coolBtn = document.createElement('button');
    coolBtn.textContent = 'COOL';
    coolBtn.className = 'btn';
    coolBtn.style.background = 'var(--color-secondary)';

    controls.appendChild(heatBtn);
    controls.appendChild(coolBtn);

    const labelEl = document.createElement('div');
    labelEl.style.color = 'var(--color-text-body)';
    labelEl.style.fontSize = '18px';
    labelEl.style.textAlign = 'center';
    labelEl.style.maxWidth = '700px';

    const captionEl = document.createElement('div');
    captionEl.style.color = 'var(--color-text-muted)';
    captionEl.style.fontSize = '14px';
    captionEl.style.textAlign = 'center';
    captionEl.textContent = config.caption || '';

    wrap.appendChild(canvas);
    wrap.appendChild(controls);
    wrap.appendChild(labelEl);
    wrap.appendChild(captionEl);
    container.appendChild(wrap);

    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    const particles = [];
    const cols = Math.ceil(Math.sqrt(particleCount));
    for (let i = 0; i < particleCount; i++) {
      const gx = (i % cols) * (W / cols) + W / cols / 2;
      const gy = Math.floor(i / cols) * (H / cols) + H / cols / 2;
      particles.push({
        x: gx, y: gy,
        homeX: gx, homeY: gy,
        vx: 0, vy: 0,
        r: 6
      });
    }

    function targetSpeed(s) {
      if (s === 'solid') return 0.15;
      if (s === 'liquid') return 1.0;
      return 3.2;
    }

    function targetSpread(s) {
      if (s === 'solid') return 4;
      if (s === 'liquid') return 18;
      return 1000;
    }

    function updateLabel() {
      labelEl.textContent = labels[state] || state.toUpperCase();
    }

    function setState(s) {
      state = s;
      updateLabel();
    }

    function step() {
      const speed = targetSpeed(state);
      const spread = targetSpread(state);
      for (const p of particles) {
        if (state === 'solid') {
          p.vx += (Math.random() - 0.5) * 0.4;
          p.vy += (Math.random() - 0.5) * 0.4;
          p.vx *= 0.7; p.vy *= 0.7;
          p.x = p.homeX + p.vx;
          p.y = p.homeY + p.vy;
        } else if (state === 'liquid') {
          p.vx += (Math.random() - 0.5) * speed * 0.3;
          p.vy += (Math.random() - 0.5) * speed * 0.3;
          p.vx *= 0.92; p.vy *= 0.92;
          let nx = p.x + p.vx, ny = p.y + p.vy;
          if (Math.abs(nx - p.homeX) > spread) p.vx *= -0.5; else p.x = nx;
          if (Math.abs(ny - p.homeY) > spread) p.vy *= -0.5; else p.y = ny;
        } else {
          p.vx += (Math.random() - 0.5) * speed * 0.5;
          p.vy += (Math.random() - 0.5) * speed * 0.5;
          p.vx = Math.max(-speed, Math.min(speed, p.vx));
          p.vy = Math.max(-speed, Math.min(speed, p.vy));
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < p.r) { p.x = p.r; p.vx *= -1; }
          if (p.x > W - p.r) { p.x = W - p.r; p.vx *= -1; }
          if (p.y < p.r) { p.y = p.r; p.vy *= -1; }
          if (p.y > H - p.r) { p.y = H - p.r; p.vy *= -1; }
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = particleColor;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let raf;
    function loop() {
      step();
      draw();
      raf = requestAnimationFrame(loop);
    }

    heatBtn.onclick = () => {
      const idx = STATES.indexOf(state);
      if (idx < STATES.length - 1) setState(STATES[idx + 1]);
    };
    coolBtn.onclick = () => {
      const idx = STATES.indexOf(state);
      if (idx > 0) setState(STATES[idx - 1]);
    };

    updateLabel();
    loop();

    return { destroy: () => cancelAnimationFrame(raf) };
  }

  return { init: build };
})();
