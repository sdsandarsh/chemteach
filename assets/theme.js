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
})();
