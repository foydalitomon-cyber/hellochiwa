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

    if (profileAvatarBtn && dropdownMenu) {

    // Telefonda ham, kompyuterda ham birdek ishlashi uchun
    ['click', 'touchend'].forEach(eventType => {
        profileAvatarBtn.addEventListener(eventType, function (e) {
            e.stopPropagation(); // Faqat tarqalishini to'xtatamiz, preventDefault shart emas

            console.log('PROFILE BUTTON CLICKED');

            dropdownMenu.classList.toggle('show');

            console.log(
                'DROPDOWN SHOW:',
                dropdownMenu.classList.contains('show')
            );
        });
    });

    document.addEventListener('click', function (e) {
        if (
            userProfileDropdown &&
            !userProfileDropdown.contains(e.target)
        ) {
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

    // =====================================================
// AUTH — REGISTER / LOGIN / GOOGLE
// =====================================================


// =====================================================
// 1. RO'YXATDAN O'TISH (REGISTER) — ENGLISH MESSAGES
// =====================================================

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!supabase) {
            console.error('Supabase not found!');
            return;
        }

        const email = document.getElementById('regEmail')?.value.trim();
        const password = document.getElementById('regPassword')?.value;

        if (!email || !password) {
            if (authMessage) {
                authMessage.style.color = '#e53935';
                authMessage.textContent = 'Please enter both email and password.';
            }
            return;
        }

        if (authMessage) {
            authMessage.style.color = '#70757c';
            authMessage.textContent = 'Signing up...';
        }

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            console.error('REGISTER ERROR:', error);

            if (authMessage) {
                authMessage.style.color = '#e53935';
                
                // Email allaqachon mavjudligini aniqlash va inglizcha xabar berish
                if (error.message.toLowerCase().includes('already registered') || error.status === 400) {
                    authMessage.textContent = 'This email is already registered. Please switch to Login.';
                    
                    // Avtomatik tarzda Login tabiga o'tkazib yuborish
                    if (loginTabBtn && loginForm) {
                        setTimeout(() => {
                            loginTabBtn.click();
                        }, 1500);
                    }
                } else {
                    authMessage.textContent = error.message;
                }
            }

            return;
        }

        console.log('REGISTER USER:', data.user);
        console.log('REGISTER SESSION:', data.session);

        // Email confirmation yoqilgan bo'lsa, session bo'lmaydi
        if (!data.session) {
            if (authMessage) {
                authMessage.style.color = '#4caf50';
                authMessage.textContent = 'Registration successful! Please check your email to verify your account.';
            }
            return;
        }

        // Session mavjud bo'lsa profilni ko'rsatamiz
        updateAuthUI(data.user);

        if (authMessage) {
            authMessage.style.color = '#4caf50';
            authMessage.textContent = 'Successfully registered!';
        }

        setTimeout(() => {
            if (authModal) {
                authModal.classList.remove('show');
            }
        }, 1000);
    });
}
// =====================================================
// 2. TIZIMGA KIRISH (LOGIN)
// =====================================================

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!supabase) {
            console.error('Supabase topilmadi!');
            return;
        }

        const email = document.getElementById('loginEmail')?.value.trim();
        const password = document.getElementById('loginPassword')?.value;

        if (!email || !password) {
            if (authMessage) {
                authMessage.style.color = '#e53935';
                authMessage.textContent = 'Email va parolni kiriting.';
            }
            return;
        }

        if (authMessage) {
            authMessage.style.color = '#70757c';
            authMessage.textContent = 'Tekshirilmoqda...';
        }

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

        if (error) {
            console.error('LOGIN ERROR:', error);

            if (authMessage) {
                authMessage.style.color = '#e53935';
                authMessage.textContent =
                    'Email yoki parol xato!';
            }

            return;
        }

        console.log('LOGIN USER:', data.user);
        console.log('LOGIN SESSION:', data.session);

        // Profilni darhol yangilash
        updateAuthUI(data.user);

        if (authMessage) {
            authMessage.style.color = '#4caf50';
            authMessage.textContent = 'Tizimga kirildi!';
        }

        setTimeout(() => {
            if (authModal) {
                authModal.classList.remove('show');
            }
        }, 800);
    });
}


// =====================================================
// 3. GOOGLE LOGIN
// =====================================================

const googleLoginBtn = document.getElementById('googleLoginBtn');

if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
        if (!supabase) {
            console.error('Supabase not found!');
            return;
        }

        if (authMessage) {
            authMessage.style.color = '#70757c';
            authMessage.textContent = 'Logging in with Google...';
        }

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.href,
                queryParams: {
                    prompt: 'select_account' // Har qanday qurilmada emaillarni tanlash oynasini chiqaradi
                }
            }
        });

        if (error) {
            console.error('GOOGLE LOGIN ERROR:', error);
            if (authMessage) {
                authMessage.style.color = '#e53935';
                authMessage.textContent = error.message;
            }
        }
    });
}

// =====================================================
// 4. AUTH SESSIONNI KUZATISH
// =====================================================

if (supabase) {

    supabase.auth.onAuthStateChange(
        (event, session) => {

            console.log('AUTH EVENT:', event);

            const user = session?.user || null;

            updateAuthUI(user);
        }
    );
}


// =====================================================
// 5. FOYDALANUVCHI SESSIYASINI TEKSHIRISH
// =====================================================

async function checkUser() {

    if (!supabase) {
        console.error('Supabase topilmadi!');
        return;
    }

    const { data, error } =
        await supabase.auth.getSession();

    if (error) {

        console.error(
            'SESSION ERROR:',
            error
        );

        updateAuthUI(null);
        return;
    }

    const session = data?.session || null;

    console.log(
        'CURRENT SESSION:',
        session
    );

    updateAuthUI(
        session?.user || null
    );
}


// =====================================================
// 6. AUTH UI NI YANGILASH
// =====================================================

function updateAuthUI(user) {

    if (user) {

        // Sign In tugmasini yashirish
        if (authBtn) {
            authBtn.style.display = 'none';
        }

        // Profilni ko'rsatish
        if (userProfileDropdown) {
            userProfileDropdown.style.display =
                'inline-block';
        }


        // ---------------------------------------------
        // EMAIL
        // ---------------------------------------------

        const emailEl =
            document.getElementById(
                'dropdownUserEmail'
            );

        if (emailEl) {
            emailEl.textContent =
                user.email || '';
        }


        // ---------------------------------------------
        // ISM
        // ---------------------------------------------

        const fullName =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.user_metadata?.user_name ||
            (
                user.email
                    ? user.email.split('@')[0]
                    : 'User'
            );

        const nameEl =
            document.getElementById(
                'dropdownUserName'
            );

        if (nameEl) {
            nameEl.textContent = fullName;
        }


        // ---------------------------------------------
        // AVATAR (Rasm yoki Harf)
        // ---------------------------------------------

        const firstLetter =
            fullName
                .charAt(0)
                .toUpperCase();

        const avatarSpan =
            document.querySelector(
                '.user-avatar-placeholder, .user-avatar'
            );

        // Google yoki boshqa provayerdan kelgan rasm havolasini tekshirish
        const avatarUrl = 
            user.user_metadata?.avatar_url || 
            user.user_metadata?.picture;

        if (avatarSpan) {
            if (avatarUrl) {
                // Agar profil rasmi mavjud bo'lsa, rasmni chiqaramiz
                avatarSpan.innerHTML = `<img src="${avatarUrl}" alt="Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            } else {
                // Rasm bo'lmasa eski tizimgacha bo'lgan holatdagi harfni chiqaramiz
                avatarSpan.textContent = firstLetter;
            }
        }


    } else {

        // User yo'q bo'lsa Sign In ko'rinadi
        if (authBtn) {
            authBtn.style.display =
                'inline-block';
        }

        // Profil yashiriladi
        if (userProfileDropdown) {
            userProfileDropdown.style.display =
                'none';
        }
    }
}


// =====================================================
// 7. SAHIFA YUKLANGANDA USERNI TEKSHIRISH
// =====================================================

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

