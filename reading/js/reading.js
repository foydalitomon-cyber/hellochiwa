document.addEventListener('DOMContentLoaded', () => {
    // Supabase client obyektini olish
    const supabase = window.supabaseClient;

    // --- 0. SAHIFA OCHILGANDA DARK MODE'NI TEKSHIRISH ---
    const body = document.body;
    const darkModeToggle = document.getElementById('darkModeToggle');

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.textContent = '☀️';
    }

    // --- 1. TIL KARTALARI BOSILGANDA MAQOLALAR SAHIFASIGA O'TISH ---
    const languageCards = document.querySelectorAll(".language-card");

    languageCards.forEach((card) => {
        card.addEventListener("click", () => {
            const language = card.dataset.language; // Masalan: Japanese, English...
            console.log(`Selected language: ${language}`);

            if (language) {
                // Maqolalar sahifasiga parametr bilan yo'naltirish
                window.location.href = `articles.html?lang=${encodeURIComponent(language)}`;
            }
        });
    });

    // --- 2. AUTH MODAL VA DROPDOWN LOGIKASI ---
    const authBtn = document.getElementById('authBtn');
    const userProfileDropdown = document.getElementById('userProfileDropdown');
    const profileAvatarBtn = document.getElementById('profileAvatarBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const logoutBtn = document.getElementById('logoutBtn');
    const userNameText = document.getElementById('userNameText');
    const userEmailText = document.getElementById('userEmailText');
    const authModal = document.getElementById('authModal');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const loginTabBtn = document.getElementById('loginTabBtn');
    const registerTabBtn = document.getElementById('registerTabBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const authMessage = document.getElementById('authMessage');

    // Enter tugmasi bosilganda modalni ochish
    if (authBtn) {
        authBtn.addEventListener('click', () => {
            if (authModal) authModal.classList.add('show');
        });
    }

    // Avatar bosilganda dropdownni ochish/yopish
    if (profileAvatarBtn && dropdownMenu) {
        profileAvatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            dropdownMenu.classList.toggle('show');
        });

        // Ekran bo'sh joyi bosilganda menyuni yopish
        document.addEventListener('click', (e) => {
            if (userProfileDropdown && !userProfileDropdown.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }

    // Dropdown ichidagi Chiqish (Logout) tugmasi
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            if (!supabase) return;
            await supabase.auth.signOut();
            if (dropdownMenu) dropdownMenu.classList.remove('show');
            updateAuthUI(null);
        });
    }

    // Modalni yopish
    if (closeAuthModal && authModal) {
        closeAuthModal.addEventListener('click', () => {
            authModal.classList.remove('show');
        });
    }

    // Tablarni almashtirish (Login / Register)
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
            if (registerForm) registerForm.classList.add('active');
            if (loginForm) loginForm.classList.remove('active');
            if (authMessage) authMessage.textContent = '';
        });
    }

    // 1. RO'YXATDAN O'TISH (REGISTER)
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('regEmail').value;
            const password = document.getElementById('regPassword').value;

            if (authMessage) {
                authMessage.style.color = '#70757c';
                authMessage.textContent = 'Ro\'yxatdan o\'tilmoqda...';
            }

            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password
            });

            if (error) {
                if (authMessage) {
                    authMessage.style.color = '#e53935';
                    authMessage.textContent = error.message;
                }
            } else {
                if (authMessage) {
                    authMessage.style.color = '#4caf50';
                    authMessage.textContent = 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz!';
                }
                setTimeout(() => {
                    if (authModal) authModal.classList.remove('show');
                    checkUser();
                }, 1500);
            }
        });
    }

    // 2. TIZIMGA KIRISH (LOGIN)
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            if (authMessage) {
                authMessage.style.color = '#70757c';
                authMessage.textContent = 'Tekshirilmoqda...';
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                if (authMessage) {
                    authMessage.style.color = '#e53935';
                    authMessage.textContent = 'Email yoki parol xato!';
                }
            } else {
                if (authMessage) {
                    authMessage.style.color = '#4caf50';
                    authMessage.textContent = 'Tizimga kirildi!';
                }
                setTimeout(() => {
                    if (authModal) authModal.classList.remove('show');
                    checkUser();
                }, 1000);
            }
        });
    }

    // FOYDALANUVCHI SESSIYASINI TEKSHIRISH
    async function checkUser() {
        if (!supabase) return;
        const { data: { user } } = await supabase.auth.getUser();
        updateAuthUI(user);
    }

    function updateAuthUI(user) {
        if (user) {
            if (authBtn) authBtn.style.display = 'none';
            if (userProfileDropdown) userProfileDropdown.style.display = 'inline-block';
            if (userEmailText) userEmailText.textContent = user.email;

            const emailUsername = user.email ? user.email.split('@')[0] : 'Foydalanuvchi';
            if (userNameText) userNameText.textContent = emailUsername;

            const firstLetter = emailUsername.charAt(0).toUpperCase();
            const avatarSpan = document.querySelector('.user-avatar-placeholder');
            if (avatarSpan) avatarSpan.textContent = firstLetter;
        } else {
            if (authBtn) authBtn.style.display = 'inline-block';
            if (userProfileDropdown) userProfileDropdown.style.display = 'none';
        }
    }

    checkUser();

    // --- 3. DARK MODE (OYCHA) TUGMASI LOGIKASI ---
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
});