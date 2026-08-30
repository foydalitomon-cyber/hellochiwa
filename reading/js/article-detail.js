document.addEventListener('DOMContentLoaded', async () => {
    const supabase = window.supabaseClient;
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    const titleEl = document.getElementById('articleTitle');
    const bodyEl = document.getElementById('articleBody');
    const levelEl = document.getElementById('articleLevel');
    const langEl = document.getElementById('articleLanguage');
    
    // 1. Audio elementini ushlab olamiz
    const audioEl = document.getElementById('articleAudio');

    if (!articleId) return;

    async function loadArticle() {
        if (!supabase) return;

        // Maqolani yuklash
        const { data: article, error } = await supabase
            .from('reading_articles')
            .select('*')
            .eq('id', articleId)
            .single();

        if (error || !article) return;

        // TITLE GA HAM HTML TEGLARINI QO'LLASH (Sarlavhadagi so'zlar uchun)
        if (titleEl) titleEl.innerHTML = article.title;
        if (bodyEl) bodyEl.innerHTML = article.content.replace(/\n/g, '<br>');
        if (levelEl) levelEl.textContent = article.level || 'General';
        if (langEl) langEl.textContent = article.language_code || '';

        // 2. Bazadan kelgan audio manzillarini pleyerga biriktiramiz
        if (audioEl && article.audio_url) {
            audioEl.src = article.audio_url;
        }

        // Supabase'dan so'zlar lug'atini yuklash
        const { data: words } = await supabase
            .from('reading_vocabularies')
            .select('*')
            .eq('article_id', articleId);

        const wordMap = {};
        if (words) {
            words.forEach(w => {
                if (w.word) {
                    const defText = w.explanation || w.definition || w.translation || w.meaning || 'Izoh biriktirilmagan';
                    wordMap[w.word.trim().toLowerCase()] = defText;
                }
            });
        }

        // So'z bosilganda popup chiqarish (ham Title, ham Body uchun)
        const handleWordClick = (e) => {
            const target = e.target.closest('.hard-word');
            
            document.querySelectorAll('.hard-word-tooltip').forEach(el => el.remove());

            if (target) {
                const wordKey = (target.dataset.word || target.innerText).trim().toLowerCase();
                const definition = wordMap[wordKey] || 'Izoh topilmadi';

                const tooltip = document.createElement('div');
                tooltip.className = 'hard-word-tooltip';
                tooltip.textContent = definition;

                target.appendChild(tooltip);

                e.stopPropagation();
            }
        };

        if (titleEl) titleEl.addEventListener('click', handleWordClick);
        if (bodyEl) bodyEl.addEventListener('click', handleWordClick);

        document.addEventListener('click', () => {
            document.querySelectorAll('.hard-word-tooltip').forEach(el => el.remove());
        });
    }

    loadArticle();
});