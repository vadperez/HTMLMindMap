/* HTML Mind Map — PWA glue (loaded in <head> of index.html and tutorial.html)
 *
 * 1. First run: index.html opens tutorial.html instead, once per browser profile.
 * 2. Registers the service worker (offline copy of the app; see sw.js).
 * 3. Shows a small bar when a new version is ready; it is used after "Restart".
 * 4. window.MindMapPWA: status for the app's Diagnostics dialog.
 *
 * Runs only when served over http(s). A map opened from disk (file://) ignores it.
 */
(function () {
  'use strict';
  if (!/^https?:$/.test(location.protocol)) return;

  var KEY = 'htmlmindmap.firstRun';        // namespaced: <user>.github.io may host other sites
  var page = location.pathname.split('/').pop() || 'index.html';
  var isTutorial = page === 'tutorial.html';
  var params = new URLSearchParams(location.search);

  // ---- 1. first run -------------------------------------------------------
  try {
    if (isTutorial) {
      if (!localStorage.getItem(KEY)) localStorage.setItem(KEY, new Date().toISOString());
    } else if (params.has('tutorial') || (!localStorage.getItem(KEY) && !params.has('new'))) {
      localStorage.setItem(KEY, new Date().toISOString());
      location.replace('tutorial.html');
      return;
    }
    if (params.has('new') || params.has('tutorial')) history.replaceState(null, '', location.pathname);
  } catch (e) { /* storage blocked: just open the empty map */ }

  // ---- 2–4. service worker, update bar, status ----------------------------
  var state = { version: null, update: false, registration: null, error: null };

  window.MindMapPWA = {
    state: state,
    installed: function () { return matchMedia('(display-mode: standalone)').matches; },
    checkForUpdate: function () { return state.registration ? state.registration.update() : Promise.resolve(); },
    applyUpdate: function () {
      var w = state.registration && state.registration.waiting;
      if (w) w.postMessage({ type: 'SKIP_WAITING' });
    },
    storage: function () { return navigator.storage && navigator.storage.estimate ? navigator.storage.estimate() : Promise.resolve(null); },
    showTutorial: function () { location.href = 'tutorial.html'; }
  };

  if (!('serviceWorker' in navigator)) { state.error = 'This browser has no service workers: the app works online only.'; return; }

  function showBar() {
    // inside the app's own message area when the app is running, else a small floating bar
    if (window.__mmBooted && window.__mm && window.__mm.Dlg && document.getElementById('mm-bars')) {
      window.__mm.Dlg.bar('A new version of MindMap is ready. Save your map, then restart to use it.', 'ok',
        [{ label: 'Restart now', primary: true, run: function () { window.MindMapPWA.applyUpdate(); } }], 'pwa-update');
      return;
    }
    if (document.getElementById('mmpwa-bar')) return;
    var bar = document.createElement('div');
    bar.id = 'mmpwa-bar';
    bar.setAttribute('role', 'status');
    bar.style.cssText = 'position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:2147483000;' +
      'display:flex;gap:12px;align-items:center;padding:10px 14px;border:1px solid #D0D7DE;border-radius:10px;' +
      'background:#FFFFFF;color:#1F2328;font:14px/1.4 system-ui,"Segoe UI",sans-serif;box-shadow:0 8px 24px rgba(31,35,40,.15)';
    var txt = document.createElement('span');
    txt.textContent = 'A new version of MindMap is ready. Save your map, then restart.';
    var go = document.createElement('button');
    go.type = 'button';
    go.textContent = 'Restart now';
    go.style.cssText = 'border:1px solid #1F883D;border-radius:6px;background:#1F883D;color:#fff;padding:4px 12px;font:inherit;cursor:pointer';
    go.onclick = function () { window.MindMapPWA.applyUpdate(); };
    var later = document.createElement('button');
    later.type = 'button';
    later.textContent = 'Later';
    later.style.cssText = 'border:1px solid #D0D7DE;border-radius:6px;background:#F6F8FA;color:#1F2328;padding:4px 12px;font:inherit;cursor:pointer';
    later.onclick = function () { bar.remove(); };
    bar.append(txt, go, later);
    document.body.appendChild(bar);
  }

  function watch(reg) {
    state.registration = reg;
    if (reg.waiting && navigator.serviceWorker.controller) { state.update = true; showBar(); }
    reg.addEventListener('updatefound', function () {
      var nw = reg.installing;
      if (!nw) return;
      nw.addEventListener('statechange', function () {
        // "installed" while another version controls the page = an update, not the first install
        if (nw.state === 'installed' && navigator.serviceWorker.controller) { state.update = true; showBar(); }
      });
    });
  }

  var reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (!state.update || reloading) return;   // first install: nothing to reload
    reloading = true;
    location.reload();                        // the app's own "unsaved changes" warning still applies
  });
  navigator.serviceWorker.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'VERSION') state.version = e.data.version;
  });

  // Register after the page has loaded so the app's first paint is not delayed.
  addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js').then(function (reg) {
      watch(reg);
      var c = navigator.serviceWorker.controller || reg.active;
      if (c) c.postMessage({ type: 'GET_VERSION' });
    }).catch(function (err) { state.error = String(err && err.message || err); });
  });
})();
