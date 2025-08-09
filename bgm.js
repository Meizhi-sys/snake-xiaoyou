// bgm.js — robust BGM with HTMLAudio + WebAudio fallback
(function () {
  const URL_FRIENDSHIP = "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Komiku/Its_time_for_adventure/Komiku_-_12_-_Friendship.mp3";
  let audioEl = null;
  let ac = null, master = null, loopTimer = null;
  let started = false;

  function ensureAudioEl() {
    if (!audioEl) {
      audioEl = new Audio(URL_FRIENDSHIP);
      audioEl.loop = true;
      audioEl.volume = 0.8;
    }
    return audioEl;
  }
  function ensureCtx() {
    if (!ac) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ac = new AC();
      master = ac.createGain();
      master.gain.value = 0.35;
      master.connect(ac.destination);
    }
    return ac;
  }
  function startSynthLoop() {
    const AC = ensureCtx();
    if (!AC) return Promise.reject(new Error('No WebAudio'));
    if (loopTimer) return Promise.resolve();
    let t = ac.currentTime + 0.05;
    function bar() {
      const chords = [[261.63,392.00],[196.00,392.00],[220.00,440.00],[174.61,349.23]];
      for (let k=0;k<chords.length;k++) {
        const [f1,f2] = chords[k];
        const o1 = ac.createOscillator(), o2 = ac.createOscillator();
        const g = ac.createGain(); g.gain.value = 0.06;
        o1.type='triangle'; o2.type='sine';
        o1.frequency.value=f1; o2.frequency.value=f2;
        o1.connect(g); o2.connect(g); g.connect(master);
        o1.start(t+k*0.6); o2.start(t+k*0.6);
        g.gain.setValueAtTime(0.06, t+k*0.6);
        g.gain.exponentialRampToValueAtTime(0.0005, t+k*0.6+0.55);
        o1.stop(t+k*0.6+0.6); o2.stop(t+k*0.6+0.6);
      }
      t += 2.4;
      loopTimer = setTimeout(bar, 2200);
    }
    bar();
    return Promise.resolve();
  }

  function cacheBGM() {
    if (!('caches' in window)) return;
    fetch(URL_FRIENDSHIP, { mode: 'no-cors' })
      .then(resp => caches.open('snake-pwa-v6-13').then(c => c.put(URL_FRIENDSHIP, resp)))
      .catch(()=>{});
  }

  // Called by page on first gesture
  window.__xyPlayBGM = function () {
    if (started) return Promise.resolve();
    started = true;
    const a = ensureAudioEl();
    return a.play().then(() => {
      cacheBGM();
      return;
    }).catch(() => {
      // Fallback: synth loop
      return startSynthLoop();
    });
  };
})();