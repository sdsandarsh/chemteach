window.mcqOverlayActive = false;

const MCQOverlay = {
  questions: [],
  currentIndex: 0,
  
  initDOM: function() {
    if (document.getElementById('mcq-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'mcq-overlay';
    overlay.innerHTML = `
      <button class="mcq-close-btn" onclick="MCQOverlay.close()">✕</button>
      <div class="mcq-wrapper">
        <div class="q-card" id="mcq-overlay-card">
          <div class="q-meta">
            <span id="mcq-overlay-category">Category</span>
            <span id="mcq-overlay-details">Page: X | Q: Y</span>
            <button class="hw-btn" onclick="MCQOverlay.toggleHW()">Mark as HW</button>
          </div>
          <div class="q-text" id="mcq-overlay-text">Question text goes here.</div>
          <div class="q-options-container">
            <div class="q-options" id="mcq-overlay-options"></div>
            <div class="hw-overlay" id="mcq-overlay-hw" style="display:none;">
              <h3>!!! ASSIGNMENT !!!</h3>
              <p>Let's see if you can do it 📝🎯</p>
            </div>
            <div class="sol" id="mcq-overlay-sol">
              <div class="sol-drag-handle"></div>
              <div id="mcq-overlay-sol-content"></div>
            </div>
          </div>
        </div>
        <div class="mcq-nav-controls">
          <button class="mcq-nav-btn" id="mcq-overlay-prev" onclick="MCQOverlay.prev()">◀ PREV MCQ</button>
          <div class="mcq-counter" id="mcq-overlay-counter">1 of 1</div>
          <button class="mcq-nav-btn" id="mcq-overlay-next" onclick="MCQOverlay.next()">NEXT MCQ ▶</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    this.setupDraggable();
  },
  
  open: function(filters) {
    this.initDOM();
    if (typeof MCQs === 'undefined') {
      console.error("MCQs array not loaded");
      return;
    }
    
    // Filter questions based on the criteria passed
    this.questions = MCQs.filter(q => {
      return filters.some(f => f.category === q.category && f.qNum === q.qNum);
    });
    
    if (this.questions.length === 0) {
      console.warn("No MCQs found for this slide");
      return;
    }
    
    this.currentIndex = 0;
    this.render();
    
    const overlay = document.getElementById('mcq-overlay');
    overlay.classList.add('active');
    window.mcqOverlayActive = true;
  },
  
  close: function() {
    const overlay = document.getElementById('mcq-overlay');
    if (overlay) overlay.classList.remove('active');
    window.mcqOverlayActive = false;
  },
  
  render: function() {
    const q = this.questions[this.currentIndex];
    
    document.getElementById('mcq-overlay-category').innerHTML = q.category;
    document.getElementById('mcq-overlay-details').innerHTML = `Page: ${q.page || '?'} | Q: ${q.qNum || '?'}`;
    document.getElementById('mcq-overlay-text').innerHTML = q.text;
    
    const optsContainer = document.getElementById('mcq-overlay-options');
    optsContainer.innerHTML = '';
    
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'opt';
      const ltr = String.fromCharCode(65 + idx);
      btn.innerHTML = `<div class="opt-letter">${ltr}</div><div class="opt-text">${opt}</div>`;
      btn.onclick = () => this.selectOption(btn, idx, q.correctOption, q.explanation);
      optsContainer.appendChild(btn);
    });
    
    // Reset state
    document.getElementById('mcq-overlay-hw').style.display = 'none';
    const sol = document.getElementById('mcq-overlay-sol');
    sol.style.display = 'none';
    sol.style.transform = 'translate(0px, 0px)'; // Reset drag
    this.solX = 0; this.solY = 0;
    
    // Update nav
    document.getElementById('mcq-overlay-counter').textContent = `${this.currentIndex + 1} of ${this.questions.length}`;
    document.getElementById('mcq-overlay-prev').disabled = this.currentIndex === 0;
    document.getElementById('mcq-overlay-next').disabled = this.currentIndex === this.questions.length - 1;
    
    // Rerender math
    if (window.MathJax) {
      MathJax.typesetPromise([document.getElementById('mcq-overlay-card')]).catch(console.error);
    }
  },
  
  selectOption: function(btn, selectedIdx, correctIdx, explanationText) {
    if (btn.classList.contains('correct') || btn.classList.contains('wrong')) return;
    
    const optsContainer = document.getElementById('mcq-overlay-options');
    const allBtns = optsContainer.querySelectorAll('.opt');
    allBtns.forEach(b => {
      b.disabled = true;
      b.classList.add('dim');
    });
    
    if (typeof clearFX === 'function') clearFX();
    btn.classList.remove('dim');
    
    if (selectedIdx === correctIdx) {
      btn.classList.add('correct');
      if (typeof playWin === 'function') playWin();
      if (typeof launchConfetti === 'function') launchConfetti();
    } else {
      btn.classList.add('wrong');
      if (typeof playBoo === 'function') playBoo();
      if (typeof launchBoo === 'function') launchBoo();
      allBtns[correctIdx].classList.remove('dim');
      allBtns[correctIdx].classList.add('correct');
    }
    
    // Show explanation after 3 seconds
    if (this.solTimeout) clearTimeout(this.solTimeout);
    this.solTimeout = setTimeout(() => {
      const sol = document.getElementById('mcq-overlay-sol');
      document.getElementById('mcq-overlay-sol-content').innerHTML = `<strong>Explanation:</strong><br>${explanationText}`;
      sol.style.display = 'block';
      if (window.MathJax) {
        MathJax.typesetPromise([sol]).catch(console.error);
      }
    }, 3000);
  },
  
  toggleHW: function() {
    const hwOverlay = document.getElementById('mcq-overlay-hw');
    const sol = document.getElementById('mcq-overlay-sol');
    if (hwOverlay.style.display === 'none') {
      hwOverlay.style.display = 'flex';
      sol.style.display = 'none'; // hide explanation within options
    } else {
      hwOverlay.style.display = 'none';
    }
  },
  
  prev: function() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.render();
    }
  },
  
  next: function() {
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.render();
    }
  },
  
  // Draggable logic for solution box
  solX: 0,
  solY: 0,
  setupDraggable: function() {
    const sol = document.getElementById('mcq-overlay-sol');
    const handle = sol.querySelector('.sol-drag-handle');
    let isDragging = false;
    let startX, startY;
    
    const dragTarget = handle || sol;
    
    dragTarget.addEventListener('mousedown', (e) => {
      isDragging = true;
      e.preventDefault();
      startX = e.clientX - this.solX;
      startY = e.clientY - this.solY;
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      this.solX = e.clientX - startX;
      this.solY = e.clientY - startY;
      sol.style.transform = `translate(${this.solX}px, ${this.solY}px)`;
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }
};

// Global keydown hook for overlay navigation
document.addEventListener('keydown', e => {
  if (window.mcqOverlayActive) {
    // Intercept arrows to control MCQ
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      MCQOverlay.next();
      e.stopPropagation(); // Prevents presentation from shifting
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      MCQOverlay.prev();
      e.stopPropagation();
    }
    if (e.key === 'Escape') {
      MCQOverlay.close();
    }
  }
}, true); // Use capture phase to intercept before presentation logic
