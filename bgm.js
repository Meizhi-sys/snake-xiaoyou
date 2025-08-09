let bgm;
let isBgmPlaying = false;

function initBgm() {
    if (!bgm) {
        bgm = new Audio('friendship.mp3'); // 确保文件在同目录
        bgm.loop = true;
        bgm.volume = 0.5; // 音量
    }
}

function playBgm() {
    if (!isBgmPlaying) {
        initBgm();
        bgm.play().then(() => {
            isBgmPlaying = true;
        }).catch(err => {
            console.warn('BGM autoplay blocked, will retry on next interaction.', err);
        });
    }
}

function pauseBgm() {
    if (bgm && isBgmPlaying) {
        bgm.pause();
        isBgmPlaying = false;
    }
}

// 监听首次交互来启动
window.addEventListener('touchstart', playBgm, { once: true });
window.addEventListener('click', playBgm, { once: true });
