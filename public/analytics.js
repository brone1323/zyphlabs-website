/**
 * Zyph Labs — Lightweight session-aware analytics tracker for static HTML pages.
 * Include with <script src="/analytics.js" defer></script>
 */
(function() {
  var sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
  var enterTime = Date.now();
  var path = location.pathname;
  var ref = 'direct';
  try { if (document.referrer) ref = new URL(document.referrer).hostname; } catch(e) {}

  function send(type, dur) {
    var payload = { type: type, sessionId: sid, path: path, referrer: ref, timestamp: Date.now() };
    if (typeof dur === 'number') payload.duration = Math.round(dur);
    try {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      });
    } catch(e) {}
  }

  // Send enter event
  send('enter');

  // Send leave event on page close
  function onLeave() {
    var dur = (Date.now() - enterTime) / 1000;
    send('leave', dur);
  }

  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') onLeave();
  });
  window.addEventListener('beforeunload', onLeave);
})();
