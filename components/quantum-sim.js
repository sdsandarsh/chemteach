/**
 * quantum-sim.js
 * Advanced Canvas Interactive Simulations for Quantum Mechanics
 * 
 * Config structure:
 * {
 *   mode: "bohr-failure" | "wave-morph" | "heisenberg" | "orbital-collapse",
 *   title: "Simulation Title",
 *   instruction: "User instruction text"
 * }
 */

window.QuantumSim = (() => {

  function build(container, config) {
    container.innerHTML = '';
    
    // Main UI Wrap
    const wrap = document.createElement('div');
    wrap.className = 'qd-container qd-hud-grid qd-glow-cyan';
    
    // Header
    const header = document.createElement('div');
    header.className = 'qd-header';
    
    const titleEl = document.createElement('div');
    titleEl.className = 'qd-title qd-tech-font';
    titleEl.textContent = config.title || 'QUANTUM SIMULATION';
    
    const badge = document.createElement('div');
    badge.className = 'qd-badge';
    badge.textContent = 'LIVE INTERACTIVE';
    
    header.appendChild(titleEl);
    header.appendChild(badge);
    wrap.appendChild(header);

    // Canvas Container
    const canvasWrap = document.createElement('div');
    canvasWrap.style.width = '100%';
    canvasWrap.style.display = 'flex';
    canvasWrap.style.justifyContent = 'center';
    canvasWrap.style.position = 'relative';

    const canvas = document.createElement('canvas');
    canvas.className = 'qd-canvas';
    canvas.width = 500;
    canvas.height = 300;
    
    canvasWrap.appendChild(canvas);
    wrap.appendChild(canvasWrap);

    // Controls Container
    const controls = document.createElement('div');
    controls.className = 'qd-controls';

    if (config.instruction) {
      const instr = document.createElement('p');
      instr.style.color = 'var(--qd-slate-400)';
      instr.style.fontSize = 'clamp(12px, 1.2vw, 26px)';
      instr.style.textAlign = 'center';
      instr.style.width = '100%';
      instr.style.marginBottom = '8px';
      instr.textContent = config.instruction;
      controls.appendChild(instr);
    }

    wrap.appendChild(controls);
    container.appendChild(wrap);

    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    // --- Simulation Logic Routers ---
    if (config.mode === 'bohr-failure') {
      initBohrFailure(ctx, canvas, controls);
    } else if (config.mode === 'wave-morph') {
      initWaveMorph(ctx, canvas, controls);
    } else if (config.mode === 'heisenberg') {
      initHeisenberg(ctx, canvas, controls);
    } else if (config.mode === 'orbital-collapse') {
      initOrbitalCollapse(ctx, canvas, controls);
    } else if (config.mode === 'orbital-shapes') {
      initOrbitalShapes(ctx, canvas, controls);
    } else if (config.mode === 'double-slit') {
      initDoubleSlit(ctx, canvas, controls);
    }

    // --- Bohr Failure Simulation ---
    function initBohrFailure(ctx, canvas, controls) {
      let atomType = 'H'; // 'H' or 'He'
      
      const btnH = document.createElement('button');
      btnH.className = 'qd-btn qd-btn-cyan';
      btnH.textContent = 'Hydrogen (1e)';
      
      const btnHe = document.createElement('button');
      btnHe.className = 'qd-btn';
      btnHe.textContent = 'Helium (Chaos)';
      
      controls.appendChild(btnH);
      controls.appendChild(btnHe);

      btnH.onclick = () => { atomType = 'H'; btnH.classList.add('qd-btn-cyan'); btnHe.classList.remove('qd-btn-pink'); };
      btnHe.onclick = () => { atomType = 'He'; btnHe.classList.add('qd-btn-pink'); btnH.classList.remove('qd-btn-cyan'); };

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        
        // Nucleus
        ctx.beginPath();
        ctx.arc(cx, cy, 15, 0, Math.PI * 2);
        ctx.fillStyle = atomType === 'H' ? 'rgba(239,68,68,0.8)' : 'rgba(239,68,68,1)';
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'red';
        ctx.fill();
        ctx.shadowBlur = 0;
        
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(atomType === 'H' ? '+1' : '+2', cx, cy);

        // Orbit
        ctx.beginPath();
        ctx.arc(cx, cy, 100, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Electron 1
        const e1x = cx + Math.cos(time * 0.05) * 100;
        const e1y = cy + Math.sin(time * 0.05) * 100;
        drawElectron(e1x, e1y);

        if (atomType === 'He') {
          // Electron 2 - chaotic wobble due to repulsion
          const wobble = Math.sin(time * 0.5) * 20;
          const e2x = cx + Math.cos(time * 0.05 + Math.PI) * (100 + wobble);
          const e2y = cy + Math.sin(time * 0.05 + Math.PI) * (100 - wobble);
          drawElectron(e2x, e2y);
          
          // Repulsion beam
          ctx.beginPath();
          ctx.moveTo(e1x, e1y);
          ctx.lineTo(e2x, e2y);
          ctx.strokeStyle = `rgba(236,72,153,${0.3 + Math.random()*0.5})`;
          ctx.setLineDash([5, 5]);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Warning text
          ctx.fillStyle = 'var(--qd-pink)';
          ctx.fillText("Model Breakdown: Repulsion Ignored!", cx, 30);
        }

        time++;
        animationId = requestAnimationFrame(draw);
      }
      
      function drawElectron(x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#06b6d4';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#06b6d4';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      draw();
    }

    // --- Wave Morph Simulation ---
    function initWaveMorph(ctx, canvas, controls) {
      const sliderWrap = document.createElement('div');
      sliderWrap.className = 'qd-slider-container';
      
      const labels = document.createElement('div');
      labels.className = 'qd-slider-labels';
      labels.innerHTML = `<span>Particle</span><span style="color:var(--qd-purple)">Duality Morph</span><span>Wave</span>`;
      
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0';
      slider.max = '100';
      slider.value = '0';
      slider.className = 'qd-slider qd-slider-purple';
      
      sliderWrap.appendChild(labels);
      sliderWrap.appendChild(slider);
      controls.appendChild(sliderWrap);

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const val = parseInt(slider.value) / 100;
        
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        
        ctx.strokeStyle = `rgba(168, 85, 247, ${val})`;
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#a855f7';
        
        ctx.beginPath();
        for(let i = 0; i < canvas.width; i++) {
          // Morph from straight line to sine wave
          const amplitude = 40 * val;
          const frequency = 0.05;
          const y = cy + Math.sin((i + time) * frequency) * amplitude;
          if (i === 0) ctx.moveTo(i, y);
          else ctx.lineTo(i, y);
        }
        ctx.stroke();
        
        // Particle
        const pX = (time * 2) % canvas.width;
        const pAmp = 40 * val;
        const pY = cy + Math.sin((pX + time) * 0.05) * pAmp;
        
        ctx.beginPath();
        ctx.arc(pX, pY, 8 + (val*4), 0, Math.PI * 2);
        // Morph color from Cyan (particle) to Purple (wave)
        const r = Math.floor(6 + (162 * val));
        const g = Math.floor(182 - (97 * val));
        const b = Math.floor(212 + (35 * val));
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.shadowColor = `rgb(${r},${g},${b})`;
        ctx.fill();

        ctx.shadowBlur = 0;
        time += 1.5;
        animationId = requestAnimationFrame(draw);
      }
      draw();
    }

    // --- Heisenberg Pinball Simulation ---
    function initHeisenberg(ctx, canvas, controls) {
      const sliderWrap = document.createElement('div');
      sliderWrap.className = 'qd-slider-container';
      
      const labels = document.createElement('div');
      labels.className = 'qd-slider-labels';
      labels.innerHTML = `<span>Radio/IR (Long \u03BB)</span><span style="color:var(--qd-cyan)">Photon Wavelength</span><span>X-Ray/Gamma (Short \u03BB)</span>`;
      
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0';
      slider.max = '100';
      slider.value = '50';
      slider.className = 'qd-slider qd-slider-cyan';
      
      sliderWrap.appendChild(labels);
      sliderWrap.appendChild(slider);
      
      const statPanel = document.createElement('div');
      statPanel.className = 'qd-stat-panel';
      statPanel.innerHTML = `
        <div class="qd-stat"><span class="qd-stat-label">Pos Uncert (\u0394x)</span><span id="dx" class="qd-stat-value qd-val-cyan">Medium</span></div>
        <div class="qd-stat"><span class="qd-stat-label">Vel Uncert (\u0394p)</span><span id="dp" class="qd-stat-value qd-val-pink">Medium</span></div>
      `;
      
      controls.appendChild(sliderWrap);
      controls.appendChild(statPanel);

      const dxSpan = statPanel.querySelector('#dx');
      const dpSpan = statPanel.querySelector('#dp');

      let eX = canvas.width / 2;
      let eY = canvas.height / 2;
      let vX = (Math.random() - 0.5);
      let vY = (Math.random() - 0.5);
      
      let flashTime = 0;
      let photonX = 0, photonY = 0;

      canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / (rect.width || 1);
        const scaleY = canvas.height / (rect.height || 1);
        photonX = (e.clientX - rect.left) * scaleX;
        photonY = (e.clientY - rect.top) * scaleY;
        
        const dist = Math.hypot(photonX - eX, photonY - eY);
        // Let's say if we are within the "blur" radius, we hit it
        const val = parseInt(slider.value) / 100; // 0 (long) to 1 (short)
        const radius = 100 - (val * 90); // 10 to 100
        
        if (dist < radius) {
          flashTime = 1.0;
          // Kick the electron! Short wavelength = big kick
          const kick = 1 + (val * 20); 
          vX = (Math.random() - 0.5) * kick;
          vY = (Math.random() - 0.5) * kick;
          // Move the electron to exactly where the photon hit
          eX = photonX;
          eY = photonY;
        }
      });

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const val = parseInt(slider.value) / 100; // 0 = Long (Radio), 1 = Short (Gamma)
        
        // Update stats
        if (val < 0.2) { dxSpan.textContent = "Very Large"; dpSpan.textContent = "Very Small"; }
        else if (val < 0.4) { dxSpan.textContent = "Large"; dpSpan.textContent = "Small"; }
        else if (val < 0.6) { dxSpan.textContent = "Medium"; dpSpan.textContent = "Medium"; }
        else if (val < 0.8) { dxSpan.textContent = "Small"; dpSpan.textContent = "Large"; }
        else { dxSpan.textContent = "Very Small"; dpSpan.textContent = "Very Large"; }
        
        // Update Electron
        eX += vX; eY += vY;
        
        // Wrap around
        if(eX < 0) eX = canvas.width;
        if(eX > canvas.width) eX = 0;
        if(eY < 0) eY = canvas.height;
        if(eY > canvas.height) eY = 0;

        // Draw Electron Blur (Position Uncertainty)
        const radius = 100 - (val * 90); // 100 to 10
        const gradient = ctx.createRadialGradient(eX, eY, 0, eX, eY, radius);
        gradient.addColorStop(0, `rgba(6,182,212,${0.8 - (val * 0.4)})`);
        gradient.addColorStop(1, 'rgba(6,182,212,0)');
        
        ctx.beginPath();
        ctx.arc(eX, eY, radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw Electron Core (only somewhat visible depending on wavelength)
        ctx.beginPath();
        ctx.arc(eX, eY, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${val})`;
        ctx.fill();

        // Draw flash
        if (flashTime > 0) {
          ctx.beginPath();
          ctx.arc(photonX, photonY, 20 * (2 - flashTime), 0, Math.PI*2);
          ctx.strokeStyle = `rgba(236,72,153,${flashTime})`;
          ctx.lineWidth = 2;
          ctx.stroke();
          
          ctx.fillStyle = `rgba(236,72,153,${flashTime * 0.5})`;
          ctx.beginPath();
          ctx.arc(photonX, photonY, 5, 0, Math.PI*2);
          ctx.fill();
          
          flashTime -= 0.05;
        }

        animationId = requestAnimationFrame(draw);
      }
      draw();
    }

    // --- Orbital Collapse Simulation ---
    function initOrbitalCollapse(ctx, canvas, controls) {
      const sliderWrap = document.createElement('div');
      sliderWrap.className = 'qd-slider-container';
      
      const labels = document.createElement('div');
      labels.className = 'qd-slider-labels';
      labels.innerHTML = `<span>Rigid Orbit</span><span style="color:var(--qd-cyan)">Probability Cloud</span>`;
      
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0';
      slider.max = '100';
      slider.value = '0';
      slider.className = 'qd-slider qd-slider-cyan';
      
      sliderWrap.appendChild(labels);
      sliderWrap.appendChild(slider);
      controls.appendChild(sliderWrap);

      const points = [];
      for(let i=0; i<300; i++) {
        const ang = Math.random() * Math.PI * 2;
        // Normal distribution around radius 80
        const u = 1 - Math.random();
        const v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        const r = 80 + z * 15; 
        points.push({ang, r});
      }

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const val = parseInt(slider.value) / 100;
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        // Nucleus
        ctx.beginPath();
        ctx.arc(cx, cy, 5, 0, Math.PI*2);
        ctx.fillStyle = '#fff';
        ctx.fill();

        // Draw Cloud/Orbit
        ctx.fillStyle = '#06b6d4';
        points.forEach(p => {
          // When val=0, all points are on exact radius 80 (Orbit)
          // When val=1, points are scattered based on probability r (Cloud)
          const currentR = 80 * (1 - val) + p.r * val;
          const x = cx + Math.cos(p.ang + time*0.01) * currentR;
          const y = cy + Math.sin(p.ang + time*0.01) * currentR;
          
          ctx.globalAlpha = 0.3 + (0.5 * val);
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI*2);
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        if (val === 0) {
          ctx.strokeStyle = 'rgba(255,255,255,0.5)';
          ctx.beginPath();
          ctx.arc(cx, cy, 80, 0, Math.PI*2);
          ctx.stroke();
        }

        time++;
        animationId = requestAnimationFrame(draw);
      }
      draw();
    }
    
    // Cleanup if component is re-initialized or removed
    container._quantumCleanup = () => {
      if (animationId) cancelAnimationFrame(animationId);
    };

    // --- Orbital Shapes (3D Probability Clouds) ---
    function initOrbitalShapes(ctx, canvas, controls) {
      let currentOrb = 's';
      
      const btnS = document.createElement('button');
      btnS.className = 'qd-btn qd-btn-cyan';
      btnS.textContent = 's-orbital';
      
      const btnP = document.createElement('button');
      btnP.className = 'qd-btn';
      btnP.textContent = 'p-orbital';

      const btnD = document.createElement('button');
      btnD.className = 'qd-btn';
      btnD.textContent = 'd-orbital';

      controls.appendChild(btnS);
      controls.appendChild(btnP);
      controls.appendChild(btnD);

      btnS.onclick = () => { currentOrb = 's'; btnS.classList.add('qd-btn-cyan'); btnP.classList.remove('qd-btn-cyan'); btnD.classList.remove('qd-btn-cyan'); initParticles(); };
      btnP.onclick = () => { currentOrb = 'p'; btnP.classList.add('qd-btn-cyan'); btnS.classList.remove('qd-btn-cyan'); btnD.classList.remove('qd-btn-cyan'); initParticles(); };
      btnD.onclick = () => { currentOrb = 'd'; btnD.classList.add('qd-btn-cyan'); btnS.classList.remove('qd-btn-cyan'); btnP.classList.remove('qd-btn-cyan'); initParticles(); };

      let particles = [];
      const numParticles = 1200;

      function initParticles() {
        particles = [];
        for(let i=0; i<numParticles; i++) {
          let x, y, z;
          if (currentOrb === 's') {
            const r = 80 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            x = r * Math.sin(phi) * Math.cos(theta);
            y = r * Math.sin(phi) * Math.sin(theta);
            z = r * Math.cos(phi);
          } else if (currentOrb === 'p') {
            const sign = Math.random() > 0.5 ? 1 : -1;
            const r = 50 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            x = r * Math.sin(phi) * Math.cos(theta);
            y = (r * Math.sin(phi) * Math.sin(theta)) * 0.5 + (sign * 60);
            z = r * Math.cos(phi);
          } else if (currentOrb === 'd') {
            const lobe = Math.floor(Math.random() * 4);
            const r = 40 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            x = (r * Math.sin(phi) * Math.cos(theta)) * 0.7;
            y = (r * Math.sin(phi) * Math.sin(theta)) * 0.7;
            z = r * Math.cos(phi);
            if(lobe===0) { x += 55; y += 55; }
            if(lobe===1) { x -= 55; y += 55; }
            if(lobe===2) { x += 55; y -= 55; }
            if(lobe===3) { x -= 55; y -= 55; }
          }
          particles.push({x, y, z});
        }
      }
      
      initParticles();
      let angleY = 0;
      let angleX = 0;

      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        angleY += 0.01;
        angleX += 0.005;
        const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
        const cosX = Math.cos(angleX), sinX = Math.sin(angleX);

        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.beginPath();
        ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height);
        ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy);
        ctx.stroke();

        let baseColor = '0, 180, 204';
        if (currentOrb === 'p') baseColor = '0, 229, 255';
        if (currentOrb === 'd') baseColor = '255, 215, 64';

        const projected = particles.map(p => {
          let x1 = p.x * cosY - p.z * sinY;
          let z1 = p.z * cosY + p.x * sinY;
          let y2 = p.y * cosX - z1 * sinX;
          let z2 = z1 * cosX + p.y * sinX;
          return {x: x1, y: y2, z: z2};
        });
        
        projected.sort((a,b) => a.z - b.z);

        projected.forEach(p => {
          const scale = 350 / (350 - p.z);
          const px = cx + p.x * scale;
          const py = cy + p.y * scale;
          const size = Math.max(0.5, 1.5 * scale);
          const alpha = Math.min(1, Math.max(0.1, (p.z + 150) / 300));
          
          ctx.fillStyle = `rgba(${baseColor}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI*2);
          ctx.fill();
        });

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI*2);
        ctx.fill();

        animationId = requestAnimationFrame(draw);
      }
      draw();
    }

    // --- Double Slit Experiment ---
    function initDoubleSlit(ctx, canvas, controls) {
      let mode = 'particle';
      
      const btnParticle = document.createElement('button');
      btnParticle.className = 'qd-btn qd-btn-cyan';
      btnParticle.textContent = 'Particle Mode (Expected)';
      
      const btnWave = document.createElement('button');
      btnWave.className = 'qd-btn';
      btnWave.textContent = 'Wave Mode (Observed)';

      controls.appendChild(btnParticle);
      controls.appendChild(btnWave);

      btnParticle.onclick = () => { mode = 'particle'; btnParticle.classList.add('qd-btn-cyan'); btnWave.classList.remove('qd-btn-cyan'); };
      btnWave.onclick = () => { mode = 'wave'; btnWave.classList.add('qd-btn-cyan'); btnParticle.classList.remove('qd-btn-cyan'); };

      let time = 0;
      let particles = [];
      
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        time += 0.05;

        // Draw Electron Gun
        ctx.fillStyle = '#444';
        ctx.fillRect(20, canvas.height/2 - 20, 40, 40);
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(60, canvas.height/2 - 5, 10, 10);
        
        // Draw Slit Barrier
        const barrierX = 300;
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fillRect(barrierX, 0, 10, canvas.height/2 - 40);
        ctx.fillRect(barrierX, canvas.height/2 - 10, 10, 20);
        ctx.fillRect(barrierX, canvas.height/2 + 40, 10, canvas.height/2 - 40);

        // Draw Screen
        const screenX = canvas.width - 40;
        ctx.fillStyle = '#222';
        ctx.fillRect(screenX, 0, 20, canvas.height);

        if (mode === 'particle') {
          // Fire particles
          if (Math.random() < 0.3) {
            const vy = (Math.random() - 0.5) * 2;
            particles.push({x: 70, y: canvas.height/2, vx: 5, vy: vy, alive: true});
          }
          
          ctx.fillStyle = '#fff';
          particles.forEach(p => {
            if (!p.alive) return;
            p.x += p.vx;
            p.y += p.vy;
            
            // collision with barrier
            if (p.x > barrierX && p.x < barrierX + 10) {
              if (p.y < canvas.height/2 - 40 || (p.y > canvas.height/2 - 10 && p.y < canvas.height/2 + 40) || p.y > canvas.height/2 + 40) {
                p.alive = false;
              }
            }
            
            // collision with screen
            if (p.x > screenX) {
              p.vx = 0; p.vy = 0;
            } else {
              ctx.beginPath();
              ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
              ctx.fill();
            }
          });
          
          // Draw Hits on Screen
          ctx.fillStyle = 'rgba(255,255,255,0.5)';
          particles.forEach(p => {
            if (p.x > screenX) {
              ctx.beginPath();
              ctx.arc(screenX + 5, p.y, 1.5, 0, Math.PI*2);
              ctx.fill();
            }
          });
          
        } else {
          // Wave mode
          particles = [];
          
          // Draw incoming plane waves
          ctx.strokeStyle = 'rgba(0, 180, 204, 0.4)';
          ctx.lineWidth = 2;
          for(let i=0; i<10; i++) {
            let wx = 70 + ((time * 20 + i * 25) % (barrierX - 70));
            ctx.beginPath();
            ctx.moveTo(wx, 0);
            ctx.lineTo(wx, canvas.height);
            ctx.stroke();
          }
          
          // Draw concentric waves from slits
          const slit1Y = canvas.height/2 - 25;
          const slit2Y = canvas.height/2 + 25;
          
          ctx.lineWidth = 1.5;
          for (let i=0; i<20; i++) {
            let radius = (time * 20 + i * 20) % (screenX - barrierX);
            let alpha = Math.max(0, 1 - radius / (screenX - barrierX));
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha * 0.5})`;
            
            ctx.beginPath();
            ctx.arc(barrierX + 10, slit1Y, radius, -Math.PI/2, Math.PI/2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(barrierX + 10, slit2Y, radius, -Math.PI/2, Math.PI/2);
            ctx.stroke();
          }
          
          // Draw interference pattern on screen
          for (let y=0; y<canvas.height; y+=4) {
            let d1 = Math.sqrt(Math.pow(screenX - barrierX, 2) + Math.pow(y - slit1Y, 2));
            let d2 = Math.sqrt(Math.pow(screenX - barrierX, 2) + Math.pow(y - slit2Y, 2));
            let phaseDiff = Math.abs(d1 - d2);
            let intensity = Math.pow(Math.cos(phaseDiff * 0.15), 2);
            
            ctx.fillStyle = `rgba(0, 255, 200, ${intensity * 0.8})`;
            ctx.fillRect(screenX, y, 20, 4);
          }
        }

        animationId = requestAnimationFrame(draw);
      }
      draw();
    }

  }

  return { init: build };
})();
