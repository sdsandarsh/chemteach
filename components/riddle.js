/**
 * Riddle — question card with hint and click-to-reveal answer.
 * window.Riddle.init(container, config)
 * config: { question, hint, answer, explanation }
 */
window.Riddle = (() => {
  function build(container, config) {
    container.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.alignItems = 'center';
    wrap.style.gap = '20px';
    wrap.style.maxWidth = '100%';
    wrap.style.margin = '0 auto';

    const card = document.createElement('div');
    card.style.background = 'var(--color-card)';
    card.style.border = '1px solid var(--color-border)';
    card.style.borderRadius = 'var(--radius-lg)';
    card.style.padding = '32px';
    card.style.textAlign = 'center';
    card.style.width = '100%';

    const question = document.createElement('div');
    question.innerHTML = config.question || '';
    question.style.fontSize = 'clamp(28px, 2.8vw, 61px)';
    question.style.color = 'var(--color-text)';
    question.style.marginBottom = '16px';
    card.appendChild(question);

    const hintArea = document.createElement('div');
    hintArea.style.color = 'var(--color-warning)';
    hintArea.style.fontSize = 'clamp(15px, 1.5vw, 33px)';
    hintArea.style.display = 'none';
    card.appendChild(hintArea);

    const answerArea = document.createElement('div');
    answerArea.style.marginTop = '20px';
    answerArea.style.display = 'none';
    answerArea.style.opacity = '0';
    answerArea.style.transition = 'opacity 0.6s ease';

    const answer = document.createElement('div');
    answer.textContent = config.answer || '';
    answer.style.color = 'var(--color-highlight)';
    answer.style.fontWeight = '700';
    answer.style.fontSize = 'clamp(32px, 3.2vw, 70px)';

    const explanation = document.createElement('div');
    explanation.textContent = config.explanation || '';
    explanation.style.color = 'var(--color-text-muted)';
    explanation.style.fontSize = 'clamp(20px, 2.0vw, 44px)';
    explanation.style.marginTop = '10px';

    answerArea.appendChild(answer);
    answerArea.appendChild(explanation);
    card.appendChild(answerArea);

    const controls = document.createElement('div');
    controls.style.display = 'flex';
    controls.style.gap = '12px';

    if (config.hint) {
      const hintBtn = document.createElement('button');
      hintBtn.textContent = 'SHOW HINT';
      hintBtn.className = 'btn-outline';
      hintBtn.onclick = () => {
        hintArea.textContent = 'Hint: ' + config.hint;
        hintArea.style.display = 'block';
      };
      controls.appendChild(hintBtn);
    }

    const revealBtn = document.createElement('button');
    revealBtn.textContent = 'REVEAL ANSWER';
    revealBtn.className = 'btn';
    revealBtn.onclick = () => {
      answerArea.style.display = 'block';
      requestAnimationFrame(() => { answerArea.style.opacity = '1'; });
      revealBtn.disabled = true;
    };
    controls.appendChild(revealBtn);

    wrap.appendChild(card);
    wrap.appendChild(controls);
    container.appendChild(wrap);
  }

  return { init: build };
})();
