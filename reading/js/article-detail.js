document.addEventListener('DOMContentLoaded', async () => {
    const supabase = window.supabaseClient;
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    console.log('ARTICLE ID:', articleId);

    const titleEl = document.getElementById('articleTitle');
    const bodyEl = document.getElementById('articleBody');
    const levelEl = document.getElementById('articleLevel');
    const langEl = document.getElementById('articleLanguage');
    
    if (!articleId) {
        console.error('ARTICLE ID TOPILMADI!');
        if (titleEl) titleEl.textContent = 'Maqola ID topilmadi.';
        if (bodyEl) {
            bodyEl.innerHTML = `
                <p>Maqolani ochishda xatolik yuz berdi.</p>
                <p>URL ichida article ID mavjud emas.</p>
            `;
        }
        return;
    }

    // Audio va Action elementlari
    const audioEl = document.getElementById('articleAudio');
    const likeBtn = document.getElementById('likeBtn');
    const likeCountEl = document.getElementById('likeCount');
    const shareBtn = document.getElementById('shareBtn');
    const commentInput = document.getElementById('commentInput');
    const submitCommentBtn = document.getElementById('submitCommentBtn');
    const commentsList = document.getElementById('commentsList');
    const commentCountEl = document.getElementById('commentCount');

    // Auth elementlari
    const authBtn = document.getElementById('authBtn');
    const authModal = document.getElementById('authModal');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const userProfile = document.getElementById('userProfileDropdown');
    const userAvatar = document.getElementById('profileAvatarBtn');
    const profileDropdown = document.getElementById('dropdownMenu');
    const logoutBtn = document.getElementById('logoutBtn');

    let isLiked = false;
    let userLikeId = null;

    // --- AUTH MODALNI OCHIB-YOPISH ---
    if (authBtn && authModal) {
        authBtn.addEventListener('click', () => {
            authModal.classList.add('show');
        });
    }

    if (closeAuthModal && authModal) {
        closeAuthModal.addEventListener('click', () => {
            authModal.classList.remove('show');
        });
    }

    if (authModal) {
        window.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.classList.remove('show');
            }
        });
    }

    // --- AUTH TABLARNI ALMASHTIRISH ---
    const authTabBtns = document.querySelectorAll('.auth-tab-btn');
    const authForms = document.querySelectorAll('.auth-form');

    authTabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            authTabBtns.forEach((b) => b.classList.remove('active'));
            authForms.forEach((form) => form.classList.remove('active'));

            btn.classList.add('active');
            const tabName = btn.getAttribute('data-tab');

            if (tabName === 'login') {
                const loginForm = document.getElementById('loginForm');
                if (loginForm) loginForm.classList.add('active');
            }

            if (tabName === 'register') {
                const registerForm = document.getElementById('registerForm');
                if (registerForm) registerForm.classList.add('active');
            }
        });
    });

    // --- 1. SIGN IN (LOGIN) LOGIKASI ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail')?.value;
            const password = document.getElementById('loginPassword')?.value;
            
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) {
                alert('Kirishda xatolik: ' + error.message);
            } else {
                if (authModal) authModal.classList.remove('show');
                checkUser();
            }
        });
    }

    // --- GOOGLE SIGN IN (OAUTH) ---
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            if (!supabase) return;
            
            // Keep the current article ID in the URL upon redirect
            const currentUrl = window.location.origin + window.location.pathname + (articleId ? `?id=${articleId}` : '');

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: currentUrl,
                    queryParams: {
                        prompt: 'select_account' // Har qanday qurilmada emaillarni tanlash oynasini majburiy chiqaradi
                    }
                }
            });

            if (error) {
                alert('Google sign-in error: ' + error.message);
            }
        });
    }
    // --- 2. SIGN UP (RO'YXATDAN O'TISH) LOGIKASI ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('registerEmail')?.value || document.getElementById('regEmail')?.value;
            const password = document.getElementById('registerPassword')?.value || document.getElementById('regPassword')?.value;
            
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) {
                alert("Ro'yxatdan o'tishda xatolik: " + error.message);
            } else {
                alert("Muvaffaqiyatli ro'yxatdan o'tdingiz! Emailingizni tasdiqlang yoki tizimga kiring.");
                if (authModal) authModal.classList.remove('show');
            }
        });
    }

    // --- PROFILE DROPDOWN ---
    if (userProfile) {
        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            if (profileDropdown) profileDropdown.classList.toggle('show');
        });
    }

    document.addEventListener('click', () => {
        if (profileDropdown) profileDropdown.classList.remove('show');
    });

    // --- LOGOUT ---
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if (!supabase) return;
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Logout error:', error);
                return;
            }
            updateUI(null);
        });
    }

    // --- USERNI TEKSHIRISH ---
    async function checkUser() {
        if (!supabase) return;
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            updateUI(null);
            return;
        }
        updateUI(data?.user || null);
    }

    // --- UI YANGILASH (EMAILNING BOSH HARFI YOKI GMAIL RASMI) ---
    function updateUI(user) {
        if (user) {
            if (authBtn) authBtn.style.setProperty('display', 'none', 'important');
            if (userProfile) userProfile.style.setProperty('display', 'flex', 'important');

            // Gmaildan yoki metadata kelgan avatar
            const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
            const email = user.email || 'U';
            const firstLetter = email.charAt(0).toUpperCase();

            if (userAvatar) {
                if (avatarUrl) {
                    // Agar rasm mavjud bo'lsa, o'shani chiqaramiz
                    userAvatar.innerHTML = `<img src="${avatarUrl}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
                } else {
                    // Rasm bo'lmasa, emailning bosh harfini chiroyli dizaynda chiqaramiz
                    userAvatar.innerHTML = `
                        <div style="width: 100%; height: 100%; border-radius: 50%; background-color: #4a5568; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px;">
                            ${firstLetter}
                        </div>
                    `;
                }
            }
        } else {
            if (authBtn) authBtn.style.setProperty('display', 'block', 'important');
            if (userProfile) userProfile.style.setProperty('display', 'none', 'important');
        }
    }

    if (supabase) {
        supabase.auth.onAuthStateChange((event, session) => {
            updateUI(session?.user || null);
        });
    }

    checkUser();

    // 3. MAQOLANI VA LUG'ATNI YUKLASH
    async function loadArticle() {
        if (!supabase) return;

        try {
            const { data: article, error } = await supabase
                .from('reading_articles')
                .select('*')
                .eq('id', articleId)
                .single();

            if (error || !article) {
                console.error("Maqola topilmadi:", error?.message);
                if (titleEl) titleEl.textContent = "Maqola topilmadi.";
                return;
            }

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

            const articleLanguage = article.language;
            const articleLangCode = article.language_code;

            // LUG'ATNI YUKLASH (Til va ID bo'yicha qidirish mantiqi)
            await loadVocabulary(articleLanguage, articleLangCode, articleId);

        } catch (err) {
            console.error("Maqolani yuklashda xatolik:", err);
        }
    }

    async function loadVocabulary(articleLanguage, articleLangCode, currentArticleId) {
        if (!supabase) return;

        // Barcha lug'at so'zlarini bazadan to'g'ridan-to'g'ri olib kelamiz
        const { data: words, error } = await supabase
            .from('reading_vocabularies')
            .select('*');

        if (error) {
            console.error("Lug'atni yuklashda xatolik:", error.message);
            return;
        }

        console.log("Bazadagi barcha yuklangan lug'at so'zlari:", words);

        const wordMap = {};
        if (words && words.length > 0) {
            words.forEach(w => {
                if (w.word) {
                    const defText = w.explanation || w.definition || w.translation || w.meaning || 'Izoh biriktirilmagan';
                    const cleanWord = w.word.replace(/[\s\n\r]+/g, ' ').trim().toLowerCase();
                    wordMap[cleanWord] = defText;
                }
            });
        }

        const handleWordClick = (e) => {
            const target = e.target.closest('.hard-word');
            document.querySelectorAll('.hard-word-tooltip').forEach(el => el.remove());

            if (target) {
                const rawWord = target.dataset.word || target.innerText;
                const cleanTargetWord = rawWord.replace(/[\s\n\r]+/g, ' ').trim().toLowerCase();

                // 1. Aniq mos kelishini tekshiramiz (masalan: "기준금리")
                let definition = wordMap[cleanTargetWord];

                // 2. Agar aniq topilmasa, so'z qo'shimchasi bilan birga kelgan bo'lishi mumkin (masalan: "기준금리를" -> "기준금리")
                if (!definition) {
                    for (const [dbWord, def] of Object.entries(wordMap)) {
                        // Faqat matndagi so'z bazadagi so'zni o'z ichiga olsa (va bazadagi so'z qisqa emas, ma'noli uzunlikda bo'lsa)
                        if (cleanTargetWord.startsWith(dbWord) || cleanTargetWord === dbWord) {
                            definition = def;
                            break;
                        }
                    }
                }

                const finalDefinition = definition || 'Izoh topilmadi';

                const tooltip = document.createElement('div');
                tooltip.className = 'hard-word-tooltip';
                tooltip.textContent = finalDefinition;

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
    // 4. SHARE FUNKSIYASI
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

    // 5. LIKE FUNKSIYASI
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

    // 6. COMMENTS FUNKSIYASI
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

            const { count, error: countError } = await supabase
                .from('reading_comments')
                .select('*', { count: 'exact', head: true })
                .eq('article_id', articleId)
                .eq('user_id', user.id);

            if (countError) {
                submitCommentBtn.disabled = false;
                return alert('An error occurred: ' + countError.message);
            }

            if (count >= 3) {
                submitCommentBtn.disabled = false;
                return alert('You can leave a maximum of 3 comments on this article.');
            }

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

    // ISHGA TUSHIRISH
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

if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-mode');
    if (darkModeToggle) darkModeToggle.textContent = '☀️';
}

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