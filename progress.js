/**
 * ChemTeach Progress Engine
 * All localStorage operations go through this module.
 * Session files and the dashboard NEVER call localStorage directly.
 */
const ChemProgress = (() => {
  const KEY = 'chemteach_v1';
  const DEFAULT_STATE = {
    version: '1.0',
    lastUpdated: null,
    lastOpened: null,
    sessions: {}
  };
  const DEFAULT_SESSION = {
    completed: false,
    completedAt: null,
    lastSlide: 1,
    notes: ''
  };

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_STATE));
      return JSON.parse(raw);
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  }

  function save(state) {
    try {
      state.lastUpdated = new Date().toISOString();
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.error('ChemProgress: Failed to save', e);
      return false;
    }
  }

  function ensureSession(state, sessionId) {
    if (!state.sessions[sessionId]) {
      state.sessions[sessionId] = JSON.parse(JSON.stringify(DEFAULT_SESSION));
    }
    return state;
  }

  function markComplete(sessionId) {
    const state = load();
    ensureSession(state, sessionId);
    state.sessions[sessionId].completed = true;
    state.sessions[sessionId].completedAt = new Date().toISOString();
    return save(state);
  }

  function markIncomplete(sessionId) {
    const state = load();
    ensureSession(state, sessionId);
    state.sessions[sessionId].completed = false;
    state.sessions[sessionId].completedAt = null;
    return save(state);
  }

  function saveNote(sessionId, text) {
    const state = load();
    ensureSession(state, sessionId);
    state.sessions[sessionId].notes = text;
    return save(state);
  }

  function getNote(sessionId) {
    const state = load();
    return state.sessions[sessionId]?.notes || '';
  }

  function setLastOpened(chapter, week, session) {
    const state = load();
    state.lastOpened = { chapter, week, session };
    return save(state);
  }

  function getLastOpened() {
    const state = load();
    return state.lastOpened;
  }

  function setLastSlide(sessionId, slideNumber) {
    const state = load();
    ensureSession(state, sessionId);
    state.sessions[sessionId].lastSlide = slideNumber;
    return save(state);
  }

  function getLastSlide(sessionId) {
    const state = load();
    return state.sessions[sessionId]?.lastSlide || 1;
  }

  function isComplete(sessionId) {
    const state = load();
    return state.sessions[sessionId]?.completed || false;
  }

  function chapterProgress(chapterNum) {
    // Returns {completed, total, percent} for a chapter.
    // 'total' here counts only sessions seen in storage; the dashboard
    // overrides 'total' using SCHEDULE.json for an accurate denominator.
    const state = load();
    const prefix = `ch${String(chapterNum).padStart(2, '0')}_`;
    const allKeys = Object.keys(state.sessions).filter(k => k.startsWith(prefix));
    const completedKeys = allKeys.filter(k => state.sessions[k].completed);
    return {
      completed: completedKeys.length,
      total: allKeys.length,
      percent: allKeys.length ? Math.round((completedKeys.length / allKeys.length) * 100) : 0
    };
  }

  function reset() {
    localStorage.removeItem(KEY);
    return true;
  }

  return {
    load,
    save,
    markComplete,
    markIncomplete,
    saveNote,
    getNote,
    setLastOpened,
    getLastOpened,
    setLastSlide,
    getLastSlide,
    isComplete,
    chapterProgress,
    reset
  };
})();
