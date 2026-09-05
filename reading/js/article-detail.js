document.addEventListener('DOMContentLoaded', async () => {
    const supabase = window.supabaseClient;
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    const titleEl = document.getElementById('articleTitle');
    const bodyEl = document.getElementById('articleBody');
    const levelEl = document.getElementById('articleLevel');
    const langEl = document.getElementById('articleLanguage');
    
    // Audio va Action elementlari
    const audioEl = document.getElementById('articleAudio');
    const likeBtn = document.getElementById('likeBtn');
    const likeCountEl = document.getElementById('likeCount');
    const shareBtn = document.getElementById('shareBtn');
    const commentInput = document.getElementById('commentInput');
    const submitCommentBtn = document.getElementById('submitCommentBtn');
    const commentsList = document.getElementById('commentsList');
    const commentCountEl = document.getElementById('commentCount');

    let isLiked = false;
    let userLikeId = null;

    if (!articleId) return;

    // 1. MAQOLANI YUKLASH
    async function loadArticle() {
        if (!supabase) return;

        let article = null;

        try {
            const { data, error } = await supabase
                .from('reading_articles')
                .select('*')
                .eq('id', articleId)
                .single();

            if (error || !data) {
                console.error("Maqola topilmadi:", error?.message);
                if (titleEl) titleEl.textContent = "Maqola topilmadi.";
                return;
            }

            article = data;

            if (titleEl) titleEl.innerHTML = article.title;
            if (bodyEl) bodyEl.innerHTML = article.content.replace(/\n/g, '<br>');
            if (levelEl) levelEl.textContent = article.level || 'General';
            if (langEl) langEl.textContent = article.language_code || '';

            const backLink = document.getElementById('backLink');

            if (backLink && article.language_code) {
                backLink.href = `articles.html?lang=${encodeURIComponent(article.language_code)}`;
            }

            if (audioEl && article.audio_url) {
                audioEl.src = article.audio_url;
            }
        } catch (err) {
            console.error("Maqolani yuklashda xatolik:", err);
            return;
        }

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

        const handleWordClick = (e) => {
            const target = e.target.closest('.hard-word');
            
            document.querySelectorAll('.hard-word-tooltip').forEach(el => el.remove());

            if (target) {
                const rawWord = target.dataset.word || target.innerText;
                const wordKey = rawWord.replace(/[\s\n\r]+/g, ' ').trim().toLowerCase();

                console.log("Bosilgan so'z (toza):", `"${wordKey}"`); // F12 da ko'rish uchun
                console.log("Mavjud map:", wordMap);

                const definition = wordMap[wordKey] || wordMap[target.innerText.trim().toLowerCase()] || 'Izoh topilmadi';

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

    // 2. SHARE FUNKSIYASI
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = { title: document.title, url: window.location.href };
            if (navigator.share) {
                try { await navigator.share(shareData); } catch (err) {}
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Article link copied to clipboard!');
            }
        });
    }

    // 3. LIKE FUNKSIYASI
    async function fetchLikes() {
        if (!supabase) return;

        const { data: likes, count } = await supabase
            .from('reading_likes')
            .select('*', { count: 'exact' })
            .eq('article_id', articleId);

        if (likeCountEl) likeCountEl.textContent = count || 0;

        const { data: { user } } = await supabase.auth.getUser();
        if (user && likes) {
            const userLike = likes.find(like => like.user_id === user.id);
            if (userLike) {
                isLiked = true;
                userLikeId = userLike.id;
                if (likeBtn) likeBtn.classList.add('liked');
            }
        }
    }

    if (likeBtn) {
        likeBtn.addEventListener('click', async () => {
            if (!supabase) return;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return alert('Please log in to like articles.');

            if (!isLiked) {
                const { data, error } = await supabase
                    .from('reading_likes')
                    .insert([{ article_id: articleId, user_id: user.id }])
                    .select();

                if (!error && data.length > 0) {
                    isLiked = true;
                    userLikeId = data[0].id;
                    likeBtn.classList.add('liked');
                    if (likeCountEl) likeCountEl.textContent = parseInt(likeCountEl.textContent || 0) + 1;
                }
            } else {
                const { error } = await supabase.from('reading_likes').delete().eq('id', userLikeId);
                if (!error) {
                    isLiked = false;
                    userLikeId = null;
                    likeBtn.classList.remove('liked');
                    if (likeCountEl) likeCountEl.textContent = Math.max(0, parseInt(likeCountEl.textContent || 1) - 1);
                }
            }
        });
    }

    // 4. COMMENTS FUNKSIYASI
    async function fetchComments() {
        if (!supabase || !commentsList) return;

        const { data: comments } = await supabase
            .from('reading_comments')
            .select(`
                id,
                comment_text,
                created_at,
                user_id,
                profiles ( full_name )
            `)
            .eq('article_id', articleId)
            .order('created_at', { ascending: false });

        commentsList.innerHTML = '';
        if (commentCountEl) commentCountEl.textContent = comments ? comments.length : 0;

        if (comments && comments.length > 0) {
            comments.forEach(comment => renderComment(comment));
        } else {
            commentsList.innerHTML = '<p style="color: #817b6e; font-size: 14px;">No comments yet. Be the first to comment!</p>';
        }
    }

    function renderComment(comment) {
        const userName = comment.profiles?.full_name || 'Anonymous User';
        const dateStr = new Date(comment.created_at).toLocaleDateString();

        const card = document.createElement('div');
        card.className = 'comment-card';
        card.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${escapeHtml(userName)}</span>
                <span class="comment-date">${dateStr}</span>
            </div>
            <p class="comment-text">${escapeHtml(comment.comment_text)}</p>
        `;
        commentsList.appendChild(card);
    }

    if (submitCommentBtn) {
        submitCommentBtn.addEventListener('click', async () => {
            if (!supabase || !commentInput) return;

            const text = commentInput.value.trim();
            if (!text) return;

            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return alert('Izoh qoldirish uchun tizimga kiring.');

            submitCommentBtn.disabled = true;

            // 1. Foydalanuvchining ushbu maqoladagi izohlari sonini tekshirish
            const { count, error: countError } = await supabase
                .from('reading_comments')
                .select('*', { count: 'exact', head: true })
                .eq('article_id', articleId)
                .eq('user_id', user.id);

            if (countError) {
                submitCommentBtn.disabled = false;
                return alert('An error occurred: ' + countError.message);
            }

            // 2. Agar 3 ta yoki undan ko'p bo'lsa, to'xtatish
            if (count >= 3) {
                submitCommentBtn.disabled = false;
                return alert('You can leave a maximum of 3 comments on this article.');
            }

            // 3. Yangi izohni bazaga qo'shish
            const { error } = await supabase.from('reading_comments').insert([{
                article_id: articleId,
                user_id: user.id,
                comment_text: text
            }]);
            
            submitCommentBtn.disabled = false;

            if (!error) {
                commentInput.value = '';
                fetchComments();
            } else {
                alert('Error posting comment: ' + error.message);
            }
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.innerText = text;
        return div.innerHTML;
    }

    /// 5. ISHGA TUSHIRISH (Xavfsiz usulda)
    try {
        await loadArticle();
    } catch (e) {
        console.error("Load article error:", e);
    }
    
    fetchLikes();
    fetchComments();
});

/* =================================================
    DARK MODE (Article Detail sahifasi uchun)
================================================= */
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Sahifa yuklanganda saqlangan rejimni tekshirish
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    if (darkModeToggle) darkModeToggle.textContent = '☀️';
}

// Oycha tugmasi bosilganda
if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            darkModeToggle.textContent = '☀️';
        } else {
            localStorage.setItem('theme', 'light');
            darkModeToggle.textContent = '🌙';
        }
    });
}