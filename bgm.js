// bgm.js — load & cache friendship.mp3 after first user gesture
(function () {
  const URL_FRIENDSHIP = "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Komiku/Its_time_for_adventure/Komiku_-_12_-_Friendship.mp3";
  let audioEl = null;
  let armed = false;

  function ensureAudio() {
    if (!audioEl) {
      audioEl = new Audio();
      audioEl.loop = true;
      audioEl.volume = 0.42;
      audioEl.src = URL_FRIENDSHIP;
    }
    return audioEl;
  }

  function cacheBGM() {
    if (!('caches' in window)) return;
    try {
      fetch(URL_FRIENDSHIP, { mode: 'no-cors' })
        .then(resp => caches.open('snake-pwa-v6-7').then(c => c.put(URL_FRIENDSHIP, resp)))
        .catch(()=>{});
    } catch (e) {}
  }

  function armOnce() {
    if (armed) return;
    armed = true;
    const a = ensureAudio();
    a.play().then(cacheBGM).catch(() => {
      // show mini hint toast if page provides one
      const t = document.getElementById('toast');
      if (t) { t.textContent = '点一下屏幕以开启音乐 🎵'; t.style.display='block'; setTimeout(()=>t.style.display='none', 1600); }
    });
  }

  // public API for page
  window.__xyPlayBGM = armOnce;
})();