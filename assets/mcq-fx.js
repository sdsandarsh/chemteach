/* ══════════════════════════════════════════════════════════
   WEB AUDIO FEEDBACK
══════════════════════════════════════════════════════════ */
var actx = null;
function ac() { if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)(); return actx; }
function playWin() {
  try {
    var a = ac(), t0 = a.currentTime;
    var notes = [
      { f: 523.25, t: 0.00, dur: 0.14, gain: 0.24 },  /* Ta  - C5 */
      { f: 523.25, t: 0.14, dur: 0.14, gain: 0.24 },  /* da  - C5 */
      { f: 659.25, t: 0.28, dur: 0.16, gain: 0.26 },  /* da  - E5 */
      { f: 783.99, t: 0.46, dur: 0.85, gain: 0.30 }   /* DAAA - G5 */
    ];
    notes.forEach(function (n, i) {
      var t = t0 + n.t;
      var isFinal = i === notes.length - 1;
      var o1 = a.createOscillator(), o2 = a.createOscillator();
      var g = a.createGain();
      o1.type = 'sawtooth'; o1.frequency.value = n.f;
      o2.type = 'triangle'; o2.frequency.value = n.f * 2;
      o1.connect(g); o2.connect(g); g.connect(a.destination);

      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(n.gain, t + 0.015);
      if (isFinal) {
        g.gain.setValueAtTime(n.gain, t + n.dur * 0.5);
        g.gain.exponentialRampToValueAtTime(0.001, t + n.dur);
        o1.frequency.setValueAtTime(n.f, t);
        o1.frequency.linearRampToValueAtTime(n.f * 1.01, t + n.dur * 0.5);
        o1.frequency.linearRampToValueAtTime(n.f, t + n.dur);
      } else {
        g.gain.exponentialRampToValueAtTime(0.001, t + n.dur);
      }
      o1.start(t); o1.stop(t + n.dur + 0.05);
      o2.start(t); o2.stop(t + n.dur + 0.05);
    });
  } catch (e) { }
}
function playBoo() {
  try {
    var a = ac(), t0 = a.currentTime;
    var o = a.createOscillator(), g = a.createGain();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(200, t0);
    o.frequency.exponentialRampToValueAtTime(70, t0 + 0.5);
    o.connect(g); g.connect(a.destination);
    g.gain.setValueAtTime(0.18, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.55);
    o.start(t0); o.stop(t0 + 0.6);
  } catch (e) { }
}

/* ══════════════════════════════════════════════════════════
   FX: CONFETTI + BOO RAIN
══════════════════════════════════════════════════════════ */
var fxCanvas = document.getElementById('fxc');
if (!fxCanvas) {
  fxCanvas = document.createElement('div');
  fxCanvas.id = 'fxc';
  document.body.appendChild(fxCanvas);
}
var fxCtx = null, particles = [], rafId = null, thumbTs = [];
function ensureCanvas() {
  if (!fxCanvas.querySelector) return;
  var c = document.getElementById('fxCv');
  if (!c) {
    c = document.createElement('canvas');
    c.id = 'fxCv';
    c.style.width = '100%'; c.style.height = '100%';
    fxCanvas.appendChild(c);
  }
  c.width = window.innerWidth; c.height = window.innerHeight;
  fxCtx = c.getContext('2d');
}
window.addEventListener('resize', function () { if (fxCtx) ensureCanvas(); });
var CC = ['#1d4ed8', '#ffe600', '#a78bfa', '#10b981', '#f43f5e', '#fb923c', '#34d399', '#60a5fa'];
function launchConfetti() {
  ensureCanvas();
  particles = [];
  for (var i = 0; i < 90; i++) {
    particles.push({
      x: Math.random() * fxCanvas.clientWidth, y: -20 - Math.random() * 200,
      vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 3,
      rot: Math.random() * 360, vr: (Math.random() - .5) * 10,
      size: 9 + Math.random() * 9, color: CC[i % CC.length]
    });
  }
  if (rafId) cancelAnimationFrame(rafId);
  animateConfetti();
}
function animateConfetti() {
  if (!fxCtx) return;
  fxCtx.clearRect(0, 0, fxCanvas.clientWidth, fxCanvas.clientHeight);
  var alive = false;
  particles.forEach(function (p) {
    p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.rot += p.vr;
    if (p.y < fxCanvas.clientHeight + 30) alive = true;
    fxCtx.save();
    fxCtx.translate(p.x, p.y);
    fxCtx.rotate(p.rot * Math.PI / 180);
    fxCtx.fillStyle = p.color;
    fxCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    fxCtx.restore();
  });
  if (alive) rafId = requestAnimationFrame(animateConfetti);
  else fxCtx.clearRect(0, 0, fxCanvas.clientWidth, fxCanvas.clientHeight);
}
function launchBoo() {
  var emojis = ['💀', '😢', '👎', '💔', '⚠️'];
  for (var i = 0; i < 14; i++) {
    (function (i) {
      var t = setTimeout(function () {
        var el = document.createElement('div');
        el.className = 'boo-emoji';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = (Math.random() * 92) + 'vw';
        el.style.top = '-40px';
        el.style.animationDuration = (1.3 + Math.random() * .9) + 's';
        document.body.appendChild(el);
        setTimeout(function () { el.remove(); }, 2400);
      }, i * 60);
      thumbTs.push(t);
    })(i);
  }
}
function clearFX() {
  if (rafId) cancelAnimationFrame(rafId);
  if (fxCtx) fxCtx.clearRect(0, 0, fxCanvas.clientWidth, fxCanvas.clientHeight);
  thumbTs.forEach(function (t) { clearTimeout(t); });
  thumbTs = [];
  document.querySelectorAll('.boo-emoji').forEach(function (e) { e.remove(); });
}
