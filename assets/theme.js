/**
 * ChemTheme — shared light/dark mode toggle for the whole platform.
 * Persists the choice in localStorage so it carries across the dashboard
 * and every session file. Include this script in <head>, right after
 * design-tokens.css, so the theme attribute is set before first paint.
 */
(function () {
  const KEY = 'chemteach_theme';

  function readStored() {
    try { return localStorage.getItem(KEY) || 'dark'; } catch (e) { return 'dark'; }
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.textContent = theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
    });
  }

  window.ChemTheme = {
    init() { apply(readStored()); },
    toggle() { apply(readStored() === 'dark' ? 'light' : 'dark'); },
    current: readStored
  };

  window.ChemTheme.init();

  /* Buttons don't exist yet when this runs in <head>, so re-sync their
     label once the DOM is ready (the attribute itself is already set,
     avoiding any flash of the wrong theme). */
  document.addEventListener('DOMContentLoaded', () => apply(readStored()));

  /* Custom Zoom Handler: 
     Because the project uses fluid typography (vw) which resists native browser zoom,
     we intercept Ctrl + / - / scroll to manually adjust the CSS zoom property.
     This ensures perfect proportional scaling on all screens/projectors. */
  let currentZoom = 1.0;
  function updateZoom(newZoom) {
    currentZoom = Math.max(0.3, Math.min(newZoom, 3.0));
    if (document.body) {
      document.body.style.zoom = currentZoom;
    }
  }

  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey) {
      if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        updateZoom(currentZoom - 0.1);
      } else if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        updateZoom(currentZoom + 0.1);
      } else if (e.key === '0') {
        e.preventDefault();
        updateZoom(1.0);
      }
    }
  }, { passive: false });

  window.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      if (e.deltaY > 0) updateZoom(currentZoom - 0.05);
      else updateZoom(currentZoom + 0.05);
    }
  }, { passive: false });
})();
