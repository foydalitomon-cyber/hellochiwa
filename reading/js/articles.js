document.addEventListener('DOMContentLoaded', () => {
    const supabase = window.supabaseClient;

    const authBtn = document.getElementById('authBtn');
    const userProfile = document.getElementById('userProfile');
    const userAvatar = document.getElementById('userAvatar');
    const profileDropdown = document.getElementById('profileDropdown');
    const logoutBtn = document.getElementById('logoutBtn');

    const authModal = document.getElementById('authModal');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const loginTabBtn = document.getElementById('loginTabBtn');
    const registerTabBtn = document.getElementById('registerTabBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authMessage = document.getElementById('authMessage');

    const articlesGrid = document.getElementById('articlesGrid');
    const articlesCount = document.getElementById('articlesCount');
    const selectedLanguageTitle = document.getElementById('selectedLanguageTitle');

    // URL parametridan tilni olish (?lang=English)
    const urlParams = new URLSearchParams(window.location.search);
    const selectedLang = urlParams.get('lang') || 'English';

    if (selectedLanguageTitle) {
        selectedLanguageTitle.textContent = `${selectedLang} Articles`;
    }

    // --- AUTH LOGIKA ---
    if (authBtn) {
        authBtn.addEventListener('click', () => {
            if (authModal) authModal.classList.add('show');
        });
    }

    if (closeAuthModal && authModal) {
        closeAuthModal.addEventListener('click', () => {
            authModal.classList.remove('show');
        });
    }

    if (userProfile) {
        userProfile.addEventListener('click', (e) => {
            e.stopPropagation();
            if (profileDropdown) profileDropdown.classList.toggle('show');
        });
    }

    document.addEventListener('click', () => {
        if (profileDropdown) profileDropdown.classList.remove('show');
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            if (!supabase) return;
            await supabase.auth.signOut();
            checkUser();
        });
    }

    if (loginTabBtn && registerTabBtn) {
        loginTabBtn.addEventListener('click', () => {
            loginTabBtn.classList.add('active');
            registerTabBtn.classList.remove('active');
            if (loginForm) loginForm.classList.add('active');
            if (registerForm) registerForm.classList.remove('active');
            if (authMessage) authMessage.textContent = '';
        });

        registerTabBtn.addEventListener('click', () => {
            registerTabBtn.classList.add('active');
            loginTabBtn.classList.remove('active');
            if (registerForm) registerForm.classList.remove('active');
            if (loginForm) loginForm.classList.add('active');
            if (authMessage) authMessage.textContent = '';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (authMessage) authMessage.textContent = 'Tekshirilmoqda...';

            const { error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                if (authMessage) {
                    authMessage.style.color = '#e53935';
                    authMessage.textContent = 'Email yoki parol xato!';
                }
            } else {
                if (authMessage) {
                    authMessage.style.color = '#4caf50';
                    authMessage.textContent = 'Muvaffaqiyatli kirildi!';
                }
                setTimeout(() => {
                    if (authModal) authModal.classList.remove('show');
                    checkUser();
                }, 800);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;

            if (authMessage) authMessage.textContent = 'Ro\'yxatdan o\'tilmoqda...';

            const { error } = await supabase.auth.signUp({ email, password });

            if (error) {
                if (authMessage) {
                    authMessage.style.color = '#e53935';
                    authMessage.textContent = error.message;
                }
            } else {
                if (authMessage) {
                    authMessage.style.color = '#4caf50';
                    authMessage.textContent = 'Ro\'yxatdan o\'tdingiz!';
                }
                setTimeout(() => {
                    if (authModal) authModal.classList.remove('show');
                    checkUser();
                }, 800);
            }
        });
    }

    async function checkUser() {
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        updateUI(user);
    }

    function updateUI(user) {
        if (user) {
            if (authBtn) authBtn.style.display = 'none';
            if (userProfile) userProfile.style.display = 'flex';

            const avatarUrl = user.user_metadata?.avatar_url || 
                              user.user_metadata?.picture || 
                              `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`;

            if (userAvatar) userAvatar.src = avatarUrl;
        } else {
            if (authBtn) authBtn.style.display = 'block';
            if (userProfile) userProfile.style.display = 'none';
        }
    }

    // --- MAQOLALARNI YUKLASH ---
    async function loadArticles() {
        if (!supabase || !articlesGrid) return;

        try {
            const { data: articles, error } = await supabase
                .from('reading_articles')
                .select('*');

            if (error) {
                console.error("Supabase xatoligi:", error);
                articlesGrid.innerHTML = `<p class="error-text">Xatolik: ${error.message}</p>`;
                return;
            }

            if (!articles || articles.length === 0) {
                articlesGrid.innerHTML = '<p class="no-articles">Hozircha maqolalar mavjud emas.</p>';
                if (articlesCount) articlesCount.textContent = '0 articles';
                return;
            }

            // Til bo'yicha filterlash
            const filteredArticles = articles.filter(a => {
                const lang = a.language_code || a.language || a.lang || '';
                return lang.toLowerCase() === selectedLang.toLowerCase();
            });

            if (articlesCount) {
                articlesCount.textContent = `${filteredArticles.length} articles`;
            }

            if (filteredArticles.length === 0) {
                articlesGrid.innerHTML = `<p class="no-articles">${selectedLang} tilida maqolalar topilmadi.</p>`;
                return;
            }

            // Maqolalarni chiqarish
            articlesGrid.innerHTML = filteredArticles.map(article => {
                // HTML teglarni tozalash
                const cleanTitle = (article.title || 'Sarlavhasiz').replace(/<[^>]*>?/gm, '').replace(/"/g, '&quot;');
                
                let rawDescription = article.description || article.content || '';
                rawDescription = rawDescription.replace(/<[^>]*>?/gm, '');
                const shortDescription = rawDescription.length > 120 
                    ? rawDescription.substring(0, 120) + '...' 
                    : rawDescription;

                let imageUrl = article.image_url || article.image || '';
                if (!imageUrl || !imageUrl.startsWith('http') || imageUrl.includes('<')) {
                    imageUrl = 'images/default-article.jpg';
                }

                return `
                    <div class="article-card" data-id="${article.id}" style="cursor: pointer;">
                        <div class="article-image-box">
                            <img src="${imageUrl}" alt="" class="article-image" onerror="this.src='images/default-article.jpg'">
                        </div>
                        <div class="article-content">
                            <span class="article-category">${article.category || 'General'}</span>
                            <h3 class="article-title">${cleanTitle}</h3>
                            <p class="article-description">${shortDescription}</p>
                            <span class="read-more-btn">Read Article →</span>
                        </div>
                    </div>
                `;
            }).join('');

            // Kartochkaga bosish hodisasini toza JS orqali biriktirish (miltillashni oldini oladi)
            document.querySelectorAll('.article-card').forEach(card => {
                card.addEventListener('click', () => {
                    const id = card.getAttribute('data-id');
                    if (id) {
                        window.location.href = `article-detail.html?id=${id}`;
                    }
                });
            });

        } catch (err) {
            console.error('Kutilmagan xatolik:', err);
            articlesGrid.innerHTML = '<p class="error-text">Maqolalarni yuklashda xatolik yuz berdi.</p>';
        }
    }

    if (supabase) {
        supabase.auth.onAuthStateChange((_event, session) => {
            updateUI(session?.user || null);
        });
    }

    checkUser();
    loadArticles();
});