document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // VOCABULARY LANGUAGE CARDS
    // =========================================

    const languageCards =
        document.querySelectorAll('.language-card-btn');

    if (languageCards.length > 0) {

        languageCards.forEach((card) => {

            card.addEventListener('click', () => {

                const language = card.dataset.language;

                console.log(`Selected language: ${language}`);

                if (language) {
                    window.location.href =
                        `vocabulary-list.html?lang=${encodeURIComponent(language)}`;
                }

            });

        });

    }

});