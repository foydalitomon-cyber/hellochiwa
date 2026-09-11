document.addEventListener('DOMContentLoaded', async () => {

    // =========================================
    // HTML ELEMENTLARINI OLISH
    // =========================================

    const listWrapper =
        document.getElementById('vocabularyListWrapper');

    const languageTitle =
        document.getElementById('vocabularyLanguageTitle');

    const languageSubtitle =
        document.getElementById('vocabularyLanguageSubtitle');


    // =========================================
    // ELEMENTLAR MAVJUDLIGINI TEKSHIRISH
    // =========================================

    if (!listWrapper || !languageTitle || !languageSubtitle) {

        console.error(
            'Vocabulary list HTML elementlari topilmadi.'
        );

        return;
    }


    // =========================================
    // URL'DAN TILNI OLISH
    // =========================================

    const params =
        new URLSearchParams(window.location.search);

    const languageParam =
        params.get('lang');


    // =========================================
    // QO'LLAB-QUVVATLANADIGAN TILLAR
    // =========================================

    const supportedLanguages = [
        'japanese',
        'english',
        'chinese',
        'korean',
        'spanish',
        'french',
        'german',
        'italian',
        'portuguese',
        'russian'
    ];


    // =========================================
    // URL'DAGI TILNI TEKSHIRISH
    // =========================================

    if (!languageParam) {

        languageTitle.textContent =
            'Vocabulary';

        languageSubtitle.textContent =
            'Please select a language.';

        listWrapper.innerHTML = `
            <div class="vocabulary-empty">

                <p>
                    No language was selected.
                </p>

                <a href="vocabulary.html">
                    ← Back to Languages
                </a>

            </div>
        `;

        return;
    }


    const selectedLanguage =
        languageParam.trim().toLowerCase();


    if (!supportedLanguages.includes(selectedLanguage)) {

        languageTitle.textContent =
            'Vocabulary';

        languageSubtitle.textContent =
            'Language not found.';

        listWrapper.innerHTML = `
            <div class="vocabulary-empty">

                <p>
                    Language not found.
                </p>

                <a href="vocabulary.html">
                    ← Back to Languages
                </a>

            </div>
        `;

        return;
    }


    // =========================================
    // TIL NOMLARI
    // =========================================

    const languageNames = {

        japanese: 'Japanese Vocabulary',
        english: 'English Vocabulary',
        chinese: 'Chinese Vocabulary',
        korean: 'Korean Vocabulary',
        spanish: 'Spanish Vocabulary',
        french: 'French Vocabulary',
        german: 'German Vocabulary',
        italian: 'Italian Vocabulary',
        portuguese: 'Portuguese Vocabulary',
        russian: 'Russian Vocabulary'

    };


    languageTitle.textContent =
        languageNames[selectedLanguage];

    languageSubtitle.textContent =
        'Loading vocabulary...';


    // =========================================
    // SUPABASE CLIENTNI TEKSHIRISH
    // =========================================

    if (!window.supabaseClient) {

        console.error(
            'window.supabaseClient topilmadi.'
        );

        languageSubtitle.textContent =
            'Connection error.';

        listWrapper.innerHTML = `
            <div class="vocabulary-error">

                <p>
                    Supabase connection could not be established.
                </p>

            </div>
        `;

        return;
    }


    // =========================================
    // LOADING
    // =========================================

    listWrapper.innerHTML = `
        <div class="vocabulary-loading">
            Loading vocabulary...
        </div>
    `;


    // =========================================
    // SUPABASE'DAN VOCABULARY OLISH
    // =========================================

    try {

        const {
            data,
            error
        } = await window.supabaseClient

            .from('reading_vocabularies')

            .select('word, explanation')

            .eq('language', selectedLanguage);


        // =====================================
        // DATABASE ERROR
        // =====================================

        if (error) {

            console.error(
                'Supabase vocabulary error:',
                error
            );

            languageSubtitle.textContent =
                'Error loading vocabulary.';

            listWrapper.innerHTML = `
                <div class="vocabulary-error">

                    <p>
                        Could not load vocabulary.
                    </p>

                    <small>
                        ${escapeHTML(error.message)}
                    </small>

                </div>
            `;

            return;
        }


        // =====================================
        // BO'SH NATIJA
        // =====================================

        if (!data || data.length === 0) {

            languageSubtitle.textContent =
                '0 vocabulary words';

            listWrapper.innerHTML = `
                <div class="vocabulary-empty">

                    <p>
                        No vocabulary found for this language.
                    </p>

                    <a href="vocabulary.html">
                        ← Back to Languages
                    </a>

                </div>
            `;

            return;
        }


        // =====================================
        // TILGA MOS SORT
        // =====================================

        const localeMap = {

            japanese: 'ja',
            english: 'en',
            chinese: 'zh',
            korean: 'ko',
            spanish: 'es',
            french: 'fr',
            german: 'de',
            italian: 'it',
            portuguese: 'pt',
            russian: 'ru'

        };


        const locale =
            localeMap[selectedLanguage] || 'en';


        data.sort((a, b) => {

            return String(a.word || '')
                .localeCompare(
                    String(b.word || ''),
                    locale,
                    {
                        sensitivity: 'base'
                    }
                );

        });


        // =====================================
        // VOCABULARY KARTALARINI YARATISH
        // =====================================

        const vocabularyHTML =
            data.map((item, index) => {

                const word =
                    item.word ?? '';

                const explanation =
                    item.explanation ?? '';


                return `
                    <article class="vocabulary-item">

                        <div class="vocabulary-number">
                            ${index + 1}
                        </div>

                        <div class="vocabulary-content">

                            <h2 class="vocabulary-word">
                                ${escapeHTML(word)}
                            </h2>

                            <p class="vocabulary-explanation">
                                ${escapeHTML(explanation)}
                            </p>

                        </div>

                    </article>
                `;

            }).join('');


        // =====================================
        // LISTNI SAHIFAGA CHIQARISH
        // =====================================

        listWrapper.innerHTML =
            vocabularyHTML;


        // =====================================
        // SO'ZLAR SONI
        // =====================================

        languageSubtitle.textContent =
            `${data.length} vocabulary words`;


        // =====================================
        // CONSOLE
        // =====================================

        console.log(
            `Loaded ${data.length} vocabulary words for ${selectedLanguage}`
        );

    } catch (error) {

        console.error(
            'Unexpected vocabulary error:',
            error
        );

        languageSubtitle.textContent =
            'Error loading vocabulary.';

        listWrapper.innerHTML = `
            <div class="vocabulary-error">

                <p>
                    Something went wrong while loading vocabulary.
                </p>

            </div>
        `;
    }

});


// =========================================
// HTML XAVFSIZLIGI
// =========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

}