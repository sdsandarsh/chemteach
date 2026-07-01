/**
 * Infographic — dedicated slide component for displaying high-quality infographics.
 * window.Infographic.init(container, config)
 * config: { title, image, caption, explanation }
 */
window.Infographic = (() => {
  function build(container, config) {
    container.innerHTML = '';
    
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '20px';
    wrap.style.width = '100%';
    wrap.style.maxWidth = '100%';
    wrap.style.margin = '0 auto';
    wrap.style.background = 'var(--color-card)';
    wrap.style.borderRadius = 'var(--radius-lg)';
    wrap.style.padding = '30px';
    wrap.style.border = '1px solid var(--color-border)';
    wrap.style.boxShadow = 'var(--shadow-glow)';

    const contentRow = document.createElement('div');
    contentRow.style.display = 'flex';
    contentRow.style.flexDirection = 'column';
    contentRow.style.width = '100%';
    contentRow.style.gap = '20px';

    const imgContainer = document.createElement('div');
    imgContainer.style.width = '100%';
    imgContainer.style.display = 'flex';
    imgContainer.style.justifyContent = 'center';
    imgContainer.style.background = 'var(--color-bg)';
    imgContainer.style.borderRadius = 'var(--radius)';
    imgContainer.style.padding = '10px';
    imgContainer.style.border = '1px solid var(--color-border)';

    const img = document.createElement('img');
    img.src = `../../../assets/images/infographics/${encodeURI(config.image)}`;
    img.alt = config.title || 'Infographic';
    img.style.maxWidth = '100%';
    img.style.maxHeight = '55vh';
    img.style.objectFit = 'contain';
    img.style.borderRadius = 'var(--radius-sm)';
    img.style.cursor = 'zoom-in';
    img.style.transition = 'transform 0.3s ease';

    // Zoom functionality
    let isZoomed = false;
    img.onclick = () => {
      isZoomed = !isZoomed;
      if (isZoomed) {
        img.style.position = 'fixed';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '100vw';
        img.style.height = '100vh';
        img.style.zIndex = '9999';
        img.style.backgroundColor = 'rgba(10, 10, 12, 0.95)'; // Deep overlay
        img.style.padding = '40px';
        img.style.cursor = 'zoom-out';
        img.style.maxHeight = '100vh';
      } else {
        img.style.position = 'static';
        img.style.width = 'auto';
        img.style.height = 'auto';
        img.style.maxHeight = '55vh';
        img.style.zIndex = '1';
        img.style.backgroundColor = 'transparent';
        img.style.padding = '0';
        img.style.cursor = 'zoom-in';
      }
    };

    imgContainer.appendChild(img);
    contentRow.appendChild(imgContainer);

    // Text Content Area (Caption + Explanation)
    const textArea = document.createElement('div');
    textArea.style.display = 'flex';
    textArea.style.flexDirection = 'column';
    textArea.style.gap = '10px';
    textArea.style.alignItems = 'center';

    if (config.caption) {
      const captionEl = document.createElement('p');
      captionEl.textContent = config.caption;
      captionEl.style.margin = '0';
      captionEl.style.color = 'var(--color-accent)';
      captionEl.style.fontSize = 'clamp(18px, 1.8vw, 39px)';
      captionEl.style.fontWeight = 'bold';
      captionEl.style.textAlign = 'center';
      textArea.appendChild(captionEl);
    }
    
    if (config.explanation) {
      const expEl = document.createElement('div');
      expEl.innerHTML = config.explanation;
      expEl.style.color = 'var(--color-text-body)';
      expEl.style.fontSize = 'clamp(15px, 1.5vw, 33px)';
      expEl.style.lineHeight = '1.6';
      expEl.style.textAlign = 'center';
      expEl.style.maxWidth = '100%';
      expEl.style.background = 'rgba(255,255,255,0.03)';
      expEl.style.padding = '16px';
      expEl.style.borderRadius = 'var(--radius)';
      expEl.style.border = '1px solid var(--color-border)';
      textArea.appendChild(expEl);
    }

    contentRow.appendChild(textArea);
    wrap.appendChild(contentRow);
    
    // Accessibility: instruction for zoom
    const instruction = document.createElement('small');
    instruction.textContent = '🔍 Click image to zoom fullscreen';
    instruction.style.color = 'var(--color-text-muted)';
    instruction.style.fontSize = 'clamp(12px, 1.2vw, 26px)';
    instruction.style.marginTop = '10px';
    wrap.appendChild(instruction);

    container.appendChild(wrap);
  }

  return { init: build };
})();
