
(function () {
    const overlay = document.getElementById('introOverlay');
    const video = document.getElementById('introVideo');
    const skipBtn = document.getElementById('introSkip');

    if (!overlay || !video || !skipBtn) return;

    const KEY = 'nxc_intro_seen';
    const today = new Date();                       // data local do usuário
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    // Respeito a "reduzir movimento"
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Já viu hoje? então não exibe
    try {
        const lastSeen = localStorage.getItem(KEY);
        if (lastSeen === todayStr || reduceMotion) {
            // Marca como visto no dia, caso reduceMotion
            if (reduceMotion && lastSeen !== todayStr) {
                localStorage.setItem(KEY, todayStr);
            }
            return; // sem overlay
        }
    } catch (err) {
        // Se storage falhar, segue normal (overlay exibirá)
    }

    // Escolhe vídeo por "breakpoint" mobile vs desktop
    const isMobile = window.matchMedia && window.matchMedia('(max-width: 899px)').matches;
    const videoUrl = isMobile ? '/Video/intro-mobile.mp4' : '/Video/intro-desktop.mp4';

    // Bloqueia scroll do body enquanto a intro roda
    const lockScroll = () => document.documentElement.style.overflow = 'hidden';
    const unlockScroll = () => document.documentElement.style.overflow = '';

    function showOverlay() {
        overlay.hidden = false;
        overlay.setAttribute('aria-hidden', 'false');
        lockScroll();

        // Define a fonte e tenta autoplay
        video.src = videoUrl;
        video.autoplay = true;
        video.muted = true;        // autoplay exige muted
        video.playsInline = true;

        // Mostra "Pular" após 2s
        setTimeout(() => skipBtn.classList.add('show'), 2000);

        // Tenta tocar
        const playPromise = video.play();
        if (playPromise && playPromise.catch) {
            playPromise.catch(() => {
                // Se falhar o autoplay (casos muito específicos), mostra pular imediatamente
                skipBtn.classList.add('show');
            });
        }
    }

    function finishIntro() {
        try { localStorage.setItem(KEY, todayStr); } catch { }
        try {
            video.pause();
            video.removeAttribute('src');
            video.load();
        } catch { }
        overlay.setAttribute('aria-hidden', 'true');
        overlay.hidden = true;
        skipBtn.classList.remove('show');
        unlockScroll();
    }

    // Eventos
    video.addEventListener('ended', finishIntro);
    video.addEventListener('error', finishIntro);

    skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        finishIntro();
    });

    // Inicia
    showOverlay();
})();

(function () {
    const overlay = document.getElementById('introOverlay');
    const video = document.getElementById('introVideo');
    const skipBtn = document.getElementById('introSkip');
    const soundBtn = document.getElementById('introSound');

    if (!overlay || !video || !skipBtn || !soundBtn) return;

    const SEEN_KEY = 'nxc_intro_seen';
    const SOUND_KEY = 'nxc_intro_sound_pref'; // 'on' | 'off'
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1x por dia: se já viu hoje ou prefere menos movimento, não mostra
    try {
        const lastSeen = localStorage.getItem(SEEN_KEY);
        if (lastSeen === today || reduceMotion) {
            if (reduceMotion && lastSeen !== today) localStorage.setItem(SEEN_KEY, today);
            return;
        }
    } catch { }

    // Escolhe vídeo por breakpoint
    const isMobile = window.matchMedia && window.matchMedia('(max-width: 899px)').matches;
    const videoUrl = isMobile ? '/Video/intro-mobile.mp4' : '/Video/intro-desktop.mp4';

    // Bloquear scroll enquanto overlay está ativo
    const lockScroll = () => document.documentElement.style.overflow = 'hidden';
    const unlockScroll = () => document.documentElement.style.overflow = '';

    function markSeenToday() {
        try { localStorage.setItem(SEEN_KEY, today); } catch { }
    }
    function setSoundPref(on) {
        try { localStorage.setItem(SOUND_KEY, on ? 'on' : 'off'); } catch { }
    }
    function getSoundPref() {
        try { return localStorage.getItem(SOUND_KEY) === 'on'; } catch { return false; }
    }

    function finishIntro() {
        markSeenToday();
        try {
            video.pause();
            video.removeAttribute('src');
            video.load();
        } catch { }
        overlay.setAttribute('aria-hidden', 'true');
        overlay.hidden = true;
        skipBtn.classList.remove('show');
        soundBtn.hidden = true;
        unlockScroll();
    }

    // Tenta reproduzir com som; se falhar (autoplay policy), cai para mudo
    async function tryPlay(preferSound) {
        video.src = videoUrl;
        video.playsInline = true;

        if (preferSound) {
            video.muted = false;
            try {
                await video.play();
                return 'sound'; // sucesso com som
            } catch {
                // cai para mudo
            }
        }

        video.muted = true;
        try {
            await video.play();
            return 'muted';
        } catch {
            // fallback extremo: mostrar botão de som e deixar o usuário iniciar
            return 'blocked';
        }
    }

    async function showOverlay() {
        overlay.hidden = false;
        overlay.setAttribute('aria-hidden', 'false');
        lockScroll();

        // Pular aparece após 2s
        setTimeout(() => skipBtn.classList.add('show'), 2000);

        const wantSound = getSoundPref(); // lembra escolha anterior
        const result = await tryPlay(wantSound);

        if (result === 'sound') {
            // Tudo certo: exibe som; esconde botão de som
            soundBtn.hidden = true;
        } else if (result === 'muted') {
            // Vídeo está rodando mudo -> oferecer “Ativar som”
            soundBtn.hidden = false;
        } else {
            // Autoplay totalmente bloqueado -> pedir gesto para iniciar com som
            soundBtn.hidden = false;
            soundBtn.textContent = '▶ Reproduzir com som';
            soundBtn.addEventListener('click', async () => {
                try {
                    video.muted = false;
                    await video.play();
                    setSoundPref(true);
                    soundBtn.hidden = true;
                } catch {
                    // Se ainda falhar, tentar mudo
                    video.muted = true;
                    try { await video.play(); soundBtn.hidden = false; soundBtn.textContent = '🔊 Ativar som'; } catch { }
                }
            }, { once: true });
        }
    }

    // Eventos
    video.addEventListener('ended', finishIntro);
    video.addEventListener('error', finishIntro);

    skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        finishIntro();
    });

    soundBtn.addEventListener('click', async () => {
        try {
            // Volta um pouco para sincronizar áudio/visuais, opcional
            if (video.currentTime > 0.25) video.currentTime = Math.max(0, video.currentTime - 0.25);
            video.muted = false;
            await video.play();
            setSoundPref(true);
            soundBtn.hidden = true;
        } catch {
            // Se não puder, mantém o botão visível
        }
    });

    // Iniciar
    showOverlay();
})();
