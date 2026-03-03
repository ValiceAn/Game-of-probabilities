(function () {
    const LOADER_ID = 'global-preloader';
    const MAX_WAIT_MS = 15000;

    function getLoadingText() {
        const lang = localStorage.getItem('siteLang');
        return lang === 'en' ? 'Loading...' : 'Загрузка...';
    }

    function createLoader() {
        if (document.getElementById(LOADER_ID)) return;

        const loader = document.createElement('div');
        loader.id = LOADER_ID;
        loader.innerHTML = `
            <div class="loader-shell">
                <div class="loader-orbit"></div>
                <div class="loader-core"></div>
                <div class="loader-text">${getLoadingText()}</div>
            </div>
        `;

        document.body.appendChild(loader);
    }

    function hideLoader() {
        const root = document.documentElement;
        root.classList.remove('preload-active');

        const loader = document.getElementById(LOADER_ID);
        if (!loader) return;

        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 450);
    }

    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createLoader, { once: true });
        } else {
            createLoader();
        }

        const timeoutId = setTimeout(hideLoader, MAX_WAIT_MS);

        window.addEventListener('load', () => {
            clearTimeout(timeoutId);
            requestAnimationFrame(hideLoader);
        }, { once: true });
    }

    init();
})();
