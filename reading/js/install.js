document.addEventListener('DOMContentLoaded', () => {

    let deferredPrompt = null;

    // =========================================
    // 1. QURILMA VA BROWSERNI ANIQLASH
    // =========================================

    const isIOS =
        /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;

    // Agar HelloChiwa allaqachon o'rnatilgan bo'lsa,
    // hech qanday install popup ko'rsatmaymiz.
    if (isStandalone) {
        return;
    }


    // =========================================
    // 2. ANDROID / DESKTOP INSTALL PROMPT
    // =========================================

    window.addEventListener('beforeinstallprompt', (event) => {

        event.preventDefault();

        deferredPrompt = event;

        console.log('HelloChiwa install prompt ready.');

    });


    // =========================================
    // 3. INSTALL POPUP YARATISH
    // =========================================

    function createInstallPopup(type) {

        // Oldin popup mavjud bo'lsa qayta yaratmaymiz
        if (document.getElementById('helloChiwaInstallPopup')) {
            return;
        }

        const popup = document.createElement('div');

        popup.id = 'helloChiwaInstallPopup';

        popup.innerHTML = `
            <div class="hello-install-box">

                <button
                    type="button"
                    class="hello-install-close"
                    id="helloInstallClose">
                    ×
                </button>

                <div class="hello-install-icon">
                    <img
                        src="/reading/images/logo.png"
                        alt="HelloChiwa">
                </div>

                <h3>Install HelloChiwa</h3>

                <p id="helloInstallMessage"></p>

                <div class="hello-install-actions">

                    <button
                        type="button"
                        class="hello-install-later"
                        id="helloInstallLater">
                        Not now
                    </button>

                    <button
                        type="button"
                        class="hello-install-button"
                        id="helloInstallButton">
                        Install
                    </button>

                </div>

            </div>
        `;

        document.body.appendChild(popup);


        const message =
            document.getElementById('helloInstallMessage');

        const installButton =
            document.getElementById('helloInstallButton');

        const closeButton =
            document.getElementById('helloInstallClose');

        const laterButton =
            document.getElementById('helloInstallLater');


        // =====================================
        // IOS
        // =====================================

        if (type === 'ios') {

            message.textContent =
                'Add HelloChiwa to your iPhone or iPad from Safari using Share → Add to Home Screen.';

            installButton.textContent =
                'How to install';

            installButton.addEventListener('click', () => {

                alert(
                    'In Safari, tap the Share button and choose "Add to Home Screen".'
                );

            });

        }


        // =====================================
        // ANDROID / DESKTOP
        // =====================================

        if (type === 'browser') {

            message.textContent =
                'Install HelloChiwa on your device for quick access.';

            installButton.addEventListener('click', async () => {

                if (!deferredPrompt) {
                    return;
                }

                deferredPrompt.prompt();

                const result =
                    await deferredPrompt.userChoice;

                console.log(
                    'Install choice:',
                    result.outcome
                );

                deferredPrompt = null;

                removeInstallPopup();

            });

        }


        // =====================================
        // NOT NOW
        // =====================================

        laterButton.addEventListener('click', () => {

            localStorage.setItem(
                'helloChiwaInstallDismissed',
                Date.now().toString()
            );

            removeInstallPopup();

        });


        // =====================================
        // X BUTTON
        // =====================================

        closeButton.addEventListener('click', () => {

            localStorage.setItem(
                'helloChiwaInstallDismissed',
                Date.now().toString()
            );

            removeInstallPopup();

        });


        // Popupni ko'rsatish
        requestAnimationFrame(() => {
            popup.classList.add('show');
        });
    }


    // =========================================
    // 4. POPUPNI O'CHIRISH
    // =========================================

    function removeInstallPopup() {

        const popup =
            document.getElementById(
                'helloChiwaInstallPopup'
            );

        if (!popup) {
            return;
        }

        popup.classList.remove('show');

        setTimeout(() => {

            popup.remove();

        }, 250);
    }


    // =========================================
    // 5. 30 SONIYA KUTISH
    // =========================================

    setTimeout(() => {

        // Agar allaqachon o'rnatilgan bo'lsa
        if (isStandalone) {
            return;
        }


        // Kuniga faqat 1 marta ko'rsatish
        const dismissed =
            localStorage.getItem(
                'helloChiwaInstallDismissed'
            );

        if (dismissed) {

            const dismissedTime =
                parseInt(dismissed, 10);

            const oneDay =
                24 * 60 * 60 * 1000;

            if (
                Date.now() - dismissedTime <
                oneDay
            ) {
                return;
            }
        }


        // =====================================
        // IOS
        // =====================================

        if (isIOS) {

            createInstallPopup('ios');

            return;
        }


        // =====================================
        // ANDROID / DESKTOP
        // =====================================

        if (deferredPrompt) {

            createInstallPopup('browser');

        }

    }, 30000);


    // =========================================
    // 6. O'RNATILGANINI KUZATISH
    // =========================================

    window.addEventListener('appinstalled', () => {

        console.log(
            'HelloChiwa successfully installed.'
        );

        deferredPrompt = null;

        removeInstallPopup();

    });

});