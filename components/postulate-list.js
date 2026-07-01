/**
 * PostulateList - Displays a clean grid or list of numbered postulates
 * window.PostulateList.init(container, config)
 */
window.PostulateList = (() => {
  function build(container, config) {
    container.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '20px';
    wrapper.style.width = '100%';
    wrapper.style.maxWidth = '100%';
    wrapper.style.margin = '0 auto';

    const header = document.createElement('h3');
    header.textContent = config.title || 'BOHR\'S 4 POSTULATES';
    header.style.textAlign = 'center';
    header.style.color = 'var(--color-accent)';
    header.style.letterSpacing = '2px';
    header.style.margin = '0 0 10px 0';
    wrapper.appendChild(header);

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
    grid.style.gap = '20px';

    const postulates = config.postulates || [];
    
    postulates.forEach((p, idx) => {
      const card = document.createElement('div');
      card.style.background = 'var(--color-card)';
      card.style.border = '1px solid var(--color-border)';
      card.style.borderRadius = 'var(--radius)';
      card.style.padding = '20px';
      card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      card.style.position = 'relative';
      card.style.overflow = 'hidden';

      const numberBg = document.createElement('div');
      numberBg.textContent = (idx + 1).toString();
      numberBg.style.position = 'absolute';
      numberBg.style.top = '-20px';
      numberBg.style.right = '-10px';
      numberBg.style.fontSize = 'clamp(120px, 12.0vw, 264px)';
      numberBg.style.fontWeight = '900';
      numberBg.style.color = 'var(--color-accent)';
      numberBg.style.opacity = '0.05';
      numberBg.style.lineHeight = '1';
      numberBg.style.pointerEvents = 'none';
      card.appendChild(numberBg);

      const title = document.createElement('h4');
      title.textContent = p.title;
      title.style.margin = '0 0 10px 0';
      title.style.color = 'var(--color-text)';
      title.style.fontSize = '1.2rem';
      title.style.position = 'relative';
      card.appendChild(title);

      const text = document.createElement('p');
      text.innerHTML = p.text; // allowing basic HTML like <i> or <b>
      text.style.margin = '0';
      text.style.color = 'var(--color-text-muted)';
      text.style.fontSize = '1rem';
      text.style.lineHeight = '1.6';
      text.style.position = 'relative';
      card.appendChild(text);

      // Simple staggered animation
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.4s ease';
      
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, idx * 150 + 100);

      grid.appendChild(card);
    });

    wrapper.appendChild(grid);
    container.appendChild(wrapper);
  }

  return { init: build };
})();
