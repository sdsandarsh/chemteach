/**
 * ChemAnimation — teacher-triggered process animations. Never auto-plays.
 * window.ChemAnimation.init(container, config)
 * config: { sequence, steps: string[], stepByStep, caption }
 */
window.ChemAnimation = (() => {
  function build(container, config) {
    const steps = config.steps || ['Step 1', 'Step 2', 'Step 3'];
    const stepByStep = config.stepByStep !== false;

    container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '16px';

    const stage = document.createElement('div');
    stage.style.width = '100%';
    stage.style.maxWidth = '700px';
    stage.style.minHeight = '260px';
    stage.style.background = 'var(--color-card)';
    stage.style.border = '1px solid var(--color-border)';
    stage.style.borderRadius = 'var(--radius)';
    stage.style.display = 'flex';
    stage.style.alignItems = 'center';
    stage.style.justifyContent = 'center';
    stage.style.position = 'relative';
    stage.style.overflow = 'hidden';

    const visual = document.createElement('div');
    visual.style.position = 'relative';
    visual.style.width = '100%';
    visual.style.height = '200px';

    const dot = document.createElement('div');
    dot.style.position = 'absolute';
    dot.style.width = '26px';
    dot.style.height = '26px';
    dot.style.borderRadius = '50%';
    dot.style.background = 'var(--color-highlight)';
    dot.style.top = '50%';
    dot.style.left = '5%';
    dot.style.transform = 'translateY(-50%)';
    dot.style.transition = 'left 1s ease, top 1s ease';
    dot.style.boxShadow = '0 0 16px rgba(0,229,255,0.6)';

    visual.appendChild(dot);
    stage.appendChild(visual);

    const stepLabel = document.createElement('div');
    stepLabel.style.color = 'var(--color-text-body)';
    stepLabel.style.fontSize = '18px';
    stepLabel.style.textAlign = 'center';
    stepLabel.style.minHeight = '28px';

    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.gap = '12px';

    const playBtn = document.createElement('button');
    playBtn.textContent = 'PLAY';
    playBtn.className = 'btn';

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'NEXT STEP';
    nextBtn.className = 'btn-outline';
    nextBtn.style.display = 'none';

    controls.appendChild(playBtn);
    if (stepByStep) controls.appendChild(nextBtn);

    const captionEl = document.createElement('div');
    captionEl.textContent = config.caption || '';
    captionEl.style.color = 'var(--color-text-muted)';
    captionEl.style.fontSize = '14px';
    captionEl.style.textAlign = 'center';

    wrap.appendChild(stage);
    wrap.appendChild(stepLabel);
    wrap.appendChild(controls);
    wrap.appendChild(captionEl);
    container.appendChild(wrap);

    let idx = -1;
    let started = false;

    function showStep(i) {
      idx = i;
      stepLabel.textContent = steps[i] || '';
      const pct = (i / Math.max(1, steps.length - 1)) * 90 + 5;
      dot.style.left = pct + '%';
      if (i === steps.length - 1) {
        playBtn.textContent = 'REPLAY';
      }
    }

    playBtn.onclick = () => {
      if (!started) {
        started = true;
        if (stepByStep) {
          nextBtn.style.display = 'inline-block';
          showStep(0);
        } else {
          let i = 0;
          showStep(0);
          const interval = setInterval(() => {
            i++;
            if (i >= steps.length) { clearInterval(interval); return; }
            showStep(i);
          }, 1200);
        }
      } else {
        // Replay
        started = stepByStep;
        showStep(0);
        playBtn.textContent = stepByStep ? 'PLAY' : 'REPLAY';
        if (!stepByStep) {
          let i = 0;
          const interval = setInterval(() => {
            i++;
            if (i >= steps.length) { clearInterval(interval); return; }
            showStep(i);
          }, 1200);
        }
      }
    };

    nextBtn.onclick = () => {
      if (idx < steps.length - 1) showStep(idx + 1);
    };
  }

  return { init: build };
})();
