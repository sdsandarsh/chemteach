/**
 * Story — cinematic narrative slide with SVG background scene.
 * window.Story.init(container, config)
 * config: { setting, narrative, reveal, visual }
 */
window.Story = (() => {
  const SCENES = {
    'alchemist-lab': '<rect width="800" height="450" fill="#1A1208"/><circle cx="650" cy="100" r="40" fill="#2A2010" opacity="0.6"/><rect x="100" y="300" width="60" height="100" fill="#3A2A10"/><ellipse cx="130" cy="290" rx="30" ry="14" fill="#00B4CC" opacity="0.5"/><rect x="250" y="320" width="50" height="80" fill="#2A2010"/><circle cx="500" cy="350" r="50" fill="#1A1208" stroke="#FFD740" stroke-width="2" opacity="0.5"/>',
    'greek-philosophy': '<rect width="800" height="450" fill="#1A1A20"/><rect x="80" y="150" width="30" height="250" fill="#3A3A40"/><rect x="200" y="150" width="30" height="250" fill="#3A3A40"/><rect x="320" y="150" width="30" height="250" fill="#3A3A40"/><rect x="60" y="130" width="320" height="20" fill="#4A4A50"/>',
    'modern-lab': '<rect width="800" height="450" fill="#0E2030"/><rect x="0" y="380" width="800" height="70" fill="#142232"/><rect x="100" y="300" width="40" height="80" fill="#1A6B8A" opacity="0.7"/><rect x="600" y="280" width="50" height="100" fill="#00B4CC" opacity="0.5"/>',
    'classroom-1800s': '<rect width="800" height="450" fill="#1A1410"/><rect x="50" y="60" width="300" height="180" fill="#0A0A0A"/><rect x="500" y="200" width="200" height="200" fill="#2A2010"/>',
    'space-atoms': '<rect width="800" height="450" fill="#05060A"/>' +
      Array.from({length:30}).map((_,i)=>`<circle cx="${(i*97)%800}" cy="${(i*53)%450}" r="${1+(i%3)}" fill="#FFFFFF" opacity="${0.3+0.5*(i%3)/3}"/>`).join('')
  };

  function build(container, config) {
    container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.position = 'relative';
    wrap.style.width = '100%';
    wrap.style.minHeight = '480px';
    wrap.style.borderRadius = 'var(--radius)';
    wrap.style.overflow = 'hidden';
    wrap.style.display = 'flex';
    wrap.style.alignItems = 'center';
    wrap.style.justifyContent = 'center';

    const bg = document.createElement('div');
    bg.style.position = 'absolute';
    bg.style.inset = '0';
    bg.innerHTML = `<svg viewBox="0 0 800 450" style="width:100%;height:100%;" preserveAspectRatio="xMidYMid slice">${SCENES[config.visual] || SCENES['space-atoms']}</svg>`;

    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.inset = '0';
    overlay.style.background = 'var(--color-overlay)';

    const content = document.createElement('div');
    content.style.position = 'relative';
    content.style.zIndex = '2';
    content.style.maxWidth = '720px';
    content.style.padding = '40px';
    content.style.textAlign = 'center';

    const setting = document.createElement('div');
    setting.textContent = config.setting || '';
    setting.style.color = 'var(--color-accent)';
    setting.style.fontSize = '14px';
    setting.style.letterSpacing = '2px';
    setting.style.marginBottom = '20px';
    setting.style.textTransform = 'uppercase';

    const narrative = document.createElement('div');
    narrative.textContent = config.narrative || '';
    narrative.style.color = '#FFFFFF';
    narrative.style.fontSize = '22px';
    narrative.style.lineHeight = '1.6';

    const revealLine = document.createElement('div');
    revealLine.textContent = config.reveal || '';
    revealLine.style.color = 'var(--color-highlight)';
    revealLine.style.fontWeight = '700';
    revealLine.style.fontSize = '26px';
    revealLine.style.marginTop = '24px';
    revealLine.style.opacity = '0';
    revealLine.style.transition = 'opacity 0.6s ease';

    const revealBtn = document.createElement('button');
    revealBtn.textContent = 'REVEAL';
    revealBtn.className = 'btn';
    revealBtn.style.marginTop = '20px';
    revealBtn.onclick = () => {
      revealLine.style.opacity = '1';
      revealBtn.style.display = 'none';
    };

    content.appendChild(setting);
    content.appendChild(narrative);
    content.appendChild(revealLine);
    content.appendChild(revealBtn);

    wrap.appendChild(bg);
    wrap.appendChild(overlay);
    wrap.appendChild(content);
    container.appendChild(wrap);
  }

  return { init: build };
})();
