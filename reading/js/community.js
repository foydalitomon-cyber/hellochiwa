document.addEventListener('DOMContentLoaded', async () => {

    console.log('=== HELLOCHIWA COMMUNITY START ===');

    const supabase = window.supabaseClient;

    if (!supabase) {
        console.error('Community: Supabase client not found.');
        return;
    }


    // =====================================================
    // ELEMENTS
    // =====================================================

    const backBtn =
        document.getElementById('communityBackBtn');

    const menuBtn =
        document.getElementById('communityMenuBtn');

    const closeDrawerBtn =
        document.getElementById('communityCloseDrawerBtn');

    const drawer =
        document.getElementById('communityProfileDrawer');

    const drawerOverlay =
        document.getElementById('communityDrawerOverlay');

    const navButtons =
        document.querySelectorAll('.community-nav-btn');

    const sections =
        document.querySelectorAll('[data-community-section]');


    // =====================================================
    // PROFILE
    // =====================================================

    const profileName =
        document.getElementById('communityProfileName');

    const profileUsername =
        document.getElementById('communityProfileUsername');

    const profileBio =
        document.getElementById('communityProfileBio');

    const profileAvatar =
        document.getElementById('communityProfileAvatar');

    const followersCount =
        document.getElementById('communityFollowersCount');

    const followingCount =
        document.getElementById('communityFollowingCount');

    const momentsCount =
        document.getElementById('communityMomentsCount');


    // =====================================================
    // PROFILE SETUP
    // =====================================================

    const setupModal =
        document.getElementById('communityProfileSetupModal');

    const setupForm =
        document.getElementById('communityProfileSetupForm');

    const setupAvatar =
        document.getElementById('communitySetupAvatar');

    const avatarInput =
        document.getElementById('communityAvatarInput');

    const changeAvatarBtn =
        document.getElementById('communityChangeAvatarBtn');

    const setupFullName =
        document.getElementById('communitySetupFullName');

    const setupUsername =
        document.getElementById('communitySetupUsername');

    const setupBio =
        document.getElementById('communitySetupBio');

    const setupCountry =
        document.getElementById('communitySetupCountry');

    const setupCity =
        document.getElementById('communitySetupCity');

    const setupNative1 =
        document.getElementById(
            'communitySetupNativeLanguage1'
        );

    const setupNative2 =
        document.getElementById(
            'communitySetupNativeLanguage2'
        );

    const setupLearning1 =
        document.getElementById(
            'communitySetupLearningLanguage1'
        );

    const setupLearning2 =
        document.getElementById(
            'communitySetupLearningLanguage2'
        );

    const setupInterests =
        document.getElementById('communitySetupInterests');

    const setupGender =
        document.getElementById('communitySetupGender');

    const setupAge =
        document.getElementById('communitySetupAge');

    const ageValue =
        document.getElementById('communityAgeValue');

    const setupMessage =
        document.getElementById(
            'communityProfileSetupMessage'
        );

    const saveProfileBtn =
        document.getElementById(
            'communitySaveProfileBtn'
        );


    // =====================================================
    // MOMENTS
    // =====================================================

    const momentsList =
        document.getElementById(
            'communityMomentsList'
        );

    const createMomentBtn =
        document.getElementById(
            'communityCreateMomentBtn'
        );

    const momentModal =
        document.getElementById(
            'communityMomentModal'
        );

    const closeMomentModal =
        document.getElementById(
            'communityCloseMomentModal'
        );

    const momentText =
        document.getElementById(
            'communityMomentText'
        );

    const momentMedia =
        document.getElementById(
            'communityMomentMedia'
        );

    const mediaPreview =
        document.getElementById(
            'communityMediaPreview'
        );

    const mediaInfo =
        document.getElementById(
            'communityMediaInfo'
        );

    const momentMessage =
        document.getElementById(
            'communityMomentMessage'
        );

    const publishMomentBtn =
        document.getElementById(
            'communityPublishMomentBtn'
        );


    // =====================================================
    // STATE
    // =====================================================

    let currentUser = null;
    let currentProfile = null;
    let selectedAvatarFile = null;


    // =====================================================
    // WORLDWIDE COUNTRIES
    // =====================================================

    const countries = [
        ['AF', '🇦🇫', 'Afghanistan'],
        ['AL', '🇦🇱', 'Albania'],
        ['DZ', '🇩🇿', 'Algeria'],
        ['AR', '🇦🇷', 'Argentina'],
        ['AM', '🇦🇲', 'Armenia'],
        ['AU', '🇦🇺', 'Australia'],
        ['AT', '🇦🇹', 'Austria'],
        ['AZ', '🇦🇿', 'Azerbaijan'],
        ['BH', '🇧🇭', 'Bahrain'],
        ['BD', '🇧🇩', 'Bangladesh'],
        ['BY', '🇧🇾', 'Belarus'],
        ['BE', '🇧🇪', 'Belgium'],
        ['BO', '🇧🇴', 'Bolivia'],
        ['BA', '🇧🇦', 'Bosnia and Herzegovina'],
        ['BR', '🇧🇷', 'Brazil'],
        ['BG', '🇧🇬', 'Bulgaria'],
        ['CA', '🇨🇦', 'Canada'],
        ['CL', '🇨🇱', 'Chile'],
        ['CN', '🇨🇳', 'China'],
        ['CO', '🇨🇴', 'Colombia'],
        ['HR', '🇭🇷', 'Croatia'],
        ['CY', '🇨🇾', 'Cyprus'],
        ['CZ', '🇨🇿', 'Czech Republic'],
        ['DK', '🇩🇰', 'Denmark'],
        ['DO', '🇩🇴', 'Dominican Republic'],
        ['EC', '🇪🇨', 'Ecuador'],
        ['EG', '🇪🇬', 'Egypt'],
        ['EE', '🇪🇪', 'Estonia'],
        ['FI', '🇫🇮', 'Finland'],
        ['FR', '🇫🇷', 'France'],
        ['GE', '🇬🇪', 'Georgia'],
        ['DE', '🇩🇪', 'Germany'],
        ['GH', '🇬🇭', 'Ghana'],
        ['GR', '🇬🇷', 'Greece'],
        ['HK', '🇭🇰', 'Hong Kong'],
        ['HU', '🇭🇺', 'Hungary'],
        ['IS', '🇮🇸', 'Iceland'],
        ['IN', '🇮🇳', 'India'],
        ['ID', '🇮🇩', 'Indonesia'],
        ['IR', '🇮🇷', 'Iran'],
        ['IQ', '🇮🇶', 'Iraq'],
        ['IE', '🇮🇪', 'Ireland'],
        ['IL', '🇮🇱', 'Israel'],
        ['IT', '🇮🇹', 'Italy'],
        ['JP', '🇯🇵', 'Japan'],
        ['JO', '🇯🇴', 'Jordan'],
        ['KZ', '🇰🇿', 'Kazakhstan'],
        ['KE', '🇰🇪', 'Kenya'],
        ['KR', '🇰🇷', 'South Korea'],
        ['KW', '🇰🇼', 'Kuwait'],
        ['KG', '🇰🇬', 'Kyrgyzstan'],
        ['LV', '🇱🇻', 'Latvia'],
        ['LB', '🇱🇧', 'Lebanon'],
        ['LT', '🇱🇹', 'Lithuania'],
        ['LU', '🇱🇺', 'Luxembourg'],
        ['MY', '🇲🇾', 'Malaysia'],
        ['MT', '🇲🇹', 'Malta'],
        ['MX', '🇲🇽', 'Mexico'],
        ['MD', '🇲🇩', 'Moldova'],
        ['MN', '🇲🇳', 'Mongolia'],
        ['ME', '🇲🇪', 'Montenegro'],
        ['MA', '🇲🇦', 'Morocco'],
        ['NP', '🇳🇵', 'Nepal'],
        ['NL', '🇳🇱', 'Netherlands'],
        ['NZ', '🇳🇿', 'New Zealand'],
        ['NG', '🇳🇬', 'Nigeria'],
        ['MK', '🇲🇰', 'North Macedonia'],
        ['NO', '🇳🇴', 'Norway'],
        ['PK', '🇵🇰', 'Pakistan'],
        ['PE', '🇵🇪', 'Peru'],
        ['PH', '🇵🇭', 'Philippines'],
        ['PL', '🇵🇱', 'Poland'],
        ['PT', '🇵🇹', 'Portugal'],
        ['QA', '🇶🇦', 'Qatar'],
        ['RO', '🇷🇴', 'Romania'],
        ['RU', '🇷🇺', 'Russia'],
        ['SA', '🇸🇦', 'Saudi Arabia'],
        ['RS', '🇷🇸', 'Serbia'],
        ['SG', '🇸🇬', 'Singapore'],
        ['SK', '🇸🇰', 'Slovakia'],
        ['SI', '🇸🇮', 'Slovenia'],
        ['ZA', '🇿🇦', 'South Africa'],
        ['ES', '🇪🇸', 'Spain'],
        ['LK', '🇱🇰', 'Sri Lanka'],
        ['SE', '🇸🇪', 'Sweden'],
        ['CH', '🇨🇭', 'Switzerland'],
        ['TW', '🇹🇼', 'Taiwan'],
        ['TJ', '🇹🇯', 'Tajikistan'],
        ['TH', '🇹🇭', 'Thailand'],
        ['TN', '🇹🇳', 'Tunisia'],
        ['TR', '🇹🇷', 'Turkey'],
        ['TM', '🇹🇲', 'Turkmenistan'],
        ['UA', '🇺🇦', 'Ukraine'],
        ['AE', '🇦🇪', 'United Arab Emirates'],
        ['GB', '🇬🇧', 'United Kingdom'],
        ['US', '🇺🇸', 'United States'],
        ['UY', '🇺🇾', 'Uruguay'],
        ['UZ', '🇺🇿', 'Uzbekistan'],
        ['VA', '🇻🇦', 'Vatican City'],
        ['VE', '🇻🇪', 'Venezuela'],
        ['VN', '🇻🇳', 'Vietnam'],
        ['YE', '🇾🇪', 'Yemen'],
        ['ZM', '🇿🇲', 'Zambia'],
        ['ZW', '🇿🇼', 'Zimbabwe']
    ];


    // =====================================================
    // WORLDWIDE LANGUAGES
    // =====================================================

    const languages = [
        ['en', '🇺🇸', 'English'],
        ['ja', '🇯🇵', 'Japanese'],
        ['zh', '🇨🇳', 'Chinese'],
        ['ko', '🇰🇷', 'Korean'],
        ['es', '🇪🇸', 'Spanish'],
        ['fr', '🇫🇷', 'French'],
        ['de', '🇩🇪', 'German'],
        ['it', '🇮🇹', 'Italian'],
        ['pt', '🇵🇹', 'Portuguese'],
        ['ru', '🇷🇺', 'Russian'],
        ['ar', '🇸🇦', 'Arabic'],
        ['hi', '🇮🇳', 'Hindi'],
        ['bn', '🇧🇩', 'Bengali'],
        ['tr', '🇹🇷', 'Turkish'],
        ['vi', '🇻🇳', 'Vietnamese'],
        ['th', '🇹🇭', 'Thai'],
        ['id', '🇮🇩', 'Indonesian'],
        ['ms', '🇲🇾', 'Malay'],
        ['nl', '🇳🇱', 'Dutch'],
        ['pl', '🇵🇱', 'Polish'],
        ['uk', '🇺🇦', 'Ukrainian'],
        ['sv', '🇸🇪', 'Swedish'],
        ['no', '🇳🇴', 'Norwegian'],
        ['da', '🇩🇰', 'Danish'],
        ['fi', '🇫🇮', 'Finnish'],
        ['cs', '🇨🇿', 'Czech'],
        ['el', '🇬🇷', 'Greek'],
        ['he', '🇮🇱', 'Hebrew'],
        ['fa', '🇮🇷', 'Persian'],
        ['ur', '🇵🇰', 'Urdu'],
        ['ro', '🇷🇴', 'Romanian'],
        ['hu', '🇭🇺', 'Hungarian'],
        ['bg', '🇧🇬', 'Bulgarian'],
        ['sr', '🇷🇸', 'Serbian'],
        ['hr', '🇭🇷', 'Croatian'],
        ['sk', '🇸🇰', 'Slovak'],
        ['sl', '🇸🇮', 'Slovenian'],
        ['et', '🇪🇪', 'Estonian'],
        ['lv', '🇱🇻', 'Latvian'],
        ['lt', '🇱🇹', 'Lithuanian'],
        ['ka', '🇬🇪', 'Georgian'],
        ['hy', '🇦🇲', 'Armenian'],
        ['az', '🇦🇿', 'Azerbaijani'],
        ['kk', '🇰🇿', 'Kazakh'],
        ['ky', '🇰🇬', 'Kyrgyz'],
        ['uz', '🇺🇿', 'Uzbek'],
        ['tg', '🇹🇯', 'Tajik'],
        ['tk', '🇹🇲', 'Turkmen'],
        ['mn', '🇲🇳', 'Mongolian'],
        ['sw', '🇰🇪', 'Swahili']
    ];


    // =====================================================
    // POPULATE SELECTS
    // =====================================================

    function populateCountries() {

        if (!setupCountry) return;

        countries.forEach(country => {

            const option =
                document.createElement('option');

            option.value = country[2];

            option.textContent =
                `${country[1]} ${country[2]}`;

            setupCountry.appendChild(option);

        });

    }


    function populateLanguages() {

        const selects = [
            setupNative1,
            setupNative2,
            setupLearning1,
            setupLearning2
        ];

        selects.forEach(select => {

            if (!select) return;

            languages.forEach(language => {

                const option =
                    document.createElement('option');

                option.value = language[2];

                option.textContent =
                    `${language[1]} ${language[2]}`;

                select.appendChild(option);

            });

        });

    }


    populateCountries();
    populateLanguages();


    // =====================================================
    // GET CURRENT USER
    // =====================================================

    async function getCurrentUser() {

        const {
            data,
            error
        } = await supabase.auth.getUser();

        if (error) {

            console.error(
                'Community getUser error:',
                error
            );

            return null;
        }

        return data?.user || null;
    }


    // =====================================================
    // GENERATE USERNAME
    // =====================================================

    async function generateUsername() {

        const base = 'hellochiwa_';

        const {
            data,
            error
        } = await supabase
            .from('hellochiwa_users')
            .select('username')
            .like(
                'username',
                `${base}%`
            );

        if (error) {

            console.error(
                'Username generation error:',
                error
            );

            return `${base}1`;
        }


        const usedNumbers = new Set();

        (data || []).forEach(row => {

            const username =
                String(row.username || '');

            if (
                username.startsWith(base)
            ) {

                const number =
                    Number(
                        username.substring(
                            base.length
                        )
                    );

                if (
                    Number.isInteger(number) &&
                    number > 0
                ) {

                    usedNumbers.add(number);

                }

            }

        });


        let number = 1;

        while (
            usedNumbers.has(number)
        ) {

            number++;

        }


        return `${base}${number}`;

    }


    // =====================================================
    // PROFILE COMPLETENESS
    // =====================================================

    function isCommunityProfileComplete(profile) {

        if (!profile) return false;

        return Boolean(
            profile.full_name &&
            profile.username &&
            profile.country &&
            profile.native_language_1 &&
            profile.learning_language_1
        );

    }


    // =====================================================
    // OPEN SETUP
    // =====================================================

    async function openProfileSetup(
        profile = null
    ) {

        if (!setupModal) return;

        setupModal.hidden = false;

        if (setupMessage) {
            setupMessage.textContent = '';
        }


        // =================================================
        // USERNAME AUTOMATIC
        // =================================================

        if (setupUsername) {

            if (profile?.username) {

                setupUsername.value =
                    profile.username;

            } else {

                setupUsername.value =
                    await generateUsername();

            }

        }


        // =================================================
        // FULL NAME
        // =================================================

        if (setupFullName) {

            setupFullName.value =
                profile?.full_name ||
                currentUser?.user_metadata?.full_name ||
                currentUser?.user_metadata?.name ||
                '';

        }


        // =================================================
        // BIO
        // =================================================

        if (setupBio) {

            setupBio.value =
                profile?.bio || '';

        }


        // =================================================
        // COUNTRY
        // =================================================

        if (setupCountry) {

            setupCountry.value =
                profile?.country || '';

        }


        // =================================================
        // CITY
        // =================================================

        if (setupCity) {

            setupCity.value =
                profile?.city || '';

        }


        // =================================================
        // LANGUAGES
        // =================================================

        if (setupNative1) {

            setupNative1.value =
                profile?.native_language_1 || '';

        }

        if (setupNative2) {

            setupNative2.value =
                profile?.native_language_2 || '';

        }

        if (setupLearning1) {

            setupLearning1.value =
                profile?.learning_language_1 || '';

        }

        if (setupLearning2) {

            setupLearning2.value =
                profile?.learning_language_2 || '';

        }


        // =================================================
        // INTERESTS
        // =================================================

        if (setupInterests) {

            setupInterests.value =
                Array.isArray(profile?.interests)
                    ? profile.interests.join(', ')
                    : profile?.interests || '';

        }


        // =================================================
        // GENDER
        // =================================================

        if (setupGender) {

            setupGender.value =
                profile?.gender || '';

        }


        // =================================================
        // AGE
        // =================================================

        if (setupAge) {

            const age =
                Number(profile?.age);

            setupAge.value =
                age >= 18 && age <= 120
                    ? age
                    : 18;

            updateAgeDisplay();

        }


        // =================================================
        // AVATAR
        // =================================================

        selectedAvatarFile = null;

        const avatarUrl =
            profile?.avatar_url ||
            currentUser?.user_metadata?.avatar_url ||
            currentUser?.user_metadata?.picture ||
            null;


        renderSetupAvatar(
            avatarUrl,
            profile?.full_name ||
            currentUser?.user_metadata?.full_name ||
            currentUser?.user_metadata?.name ||
            profile?.username ||
            'U'
        );

    }


    // =====================================================
    // RENDER AVATAR
    // =====================================================

    function renderSetupAvatar(
        avatarUrl,
        fallbackName
    ) {

        if (!setupAvatar) return;

        setupAvatar.innerHTML = '';

        if (avatarUrl) {

            const img =
                document.createElement('img');

            img.src = avatarUrl;

            img.alt = 'Profile photo';

            img.className =
                'community-setup-avatar-image';

            setupAvatar.appendChild(img);

        } else {

            setupAvatar.textContent =
                String(fallbackName || 'U')
                    .charAt(0)
                    .toUpperCase();

        }

    }


    // =====================================================
    // AVATAR BUTTON
    // =====================================================

    function openAvatarPicker() {

        if (!avatarInput) return;

        avatarInput.click();

    }


    if (changeAvatarBtn) {

        changeAvatarBtn.addEventListener(
            'click',
            openAvatarPicker
        );

    }


    if (setupAvatar) {

        setupAvatar.addEventListener(
            'click',
            openAvatarPicker
        );

    }


    // =====================================================
    // AVATAR FILE
    // =====================================================

    if (avatarInput) {

        avatarInput.addEventListener(
            'change',
            () => {

                const file =
                    avatarInput.files?.[0];

                if (!file) return;


                if (
                    !file.type.startsWith('image/')
                ) {

                    avatarInput.value = '';

                    return;

                }


                if (
                    file.size > 5 * 1024 * 1024
                ) {

                    alert(
                        'Profile photo must be smaller than 5 MB.'
                    );

                    avatarInput.value = '';

                    return;

                }


                selectedAvatarFile = file;


                const previewUrl =
                    URL.createObjectURL(file);

                renderSetupAvatar(
                    previewUrl,
                    currentProfile?.full_name ||
                    currentUser?.email ||
                    'U'
                );

            }
        );

    }


    // =====================================================
    // AGE
    // =====================================================

    function updateAgeDisplay() {

        if (!setupAge || !ageValue) return;

        ageValue.textContent =
            setupAge.value;

    }


    if (setupAge) {

        setupAge.addEventListener(
            'input',
            updateAgeDisplay
        );

    }


    // =====================================================
    // DRAWER
    // =====================================================

    function openDrawer() {

        if (!drawer) return;

        drawer.classList.add('open');

        drawer.setAttribute(
            'aria-hidden',
            'false'
        );


        if (drawerOverlay) {

            drawerOverlay.hidden = false;

            requestAnimationFrame(() => {

                drawerOverlay.classList.add('show');

            });

        }


        if (menuBtn) {

            menuBtn.setAttribute(
                'aria-expanded',
                'true'
            );

        }


        loadCommunityProfile();

    }


    function closeDrawer() {

        if (!drawer) return;

        drawer.classList.remove('open');

        drawer.setAttribute(
            'aria-hidden',
            'true'
        );


        if (drawerOverlay) {

            drawerOverlay.classList.remove('show');

            setTimeout(() => {

                drawerOverlay.hidden = true;

            }, 200);

        }


        if (menuBtn) {

            menuBtn.setAttribute(
                'aria-expanded',
                'false'
            );

        }

    }


    if (menuBtn) {

        menuBtn.addEventListener(
            'click',
            () => {

                if (
                    drawer?.classList.contains('open')
                ) {

                    closeDrawer();

                } else {

                    openDrawer();

                }

            }
        );

    }


    if (closeDrawerBtn) {

        closeDrawerBtn.addEventListener(
            'click',
            closeDrawer
        );

    }


    if (drawerOverlay) {

        drawerOverlay.addEventListener(
            'click',
            closeDrawer
        );

    }


    // =====================================================
    // ESC
    // =====================================================

    document.addEventListener(
        'keydown',
        event => {

            if (event.key !== 'Escape') return;

            closeDrawer();

            if (setupModal) {
                setupModal.hidden = true;
            }

            if (momentModal) {
                momentModal.hidden = true;
            }

        }
    );


    // =====================================================
    // BACK
    // =====================================================

    if (backBtn) {

        backBtn.addEventListener(
            'click',
            () => {

                if (window.history.length > 1) {

                    window.history.back();

                } else {

                    window.location.href =
                        'reading/index.html';

                }

            }
        );

    }


    // =====================================================
    // NAVIGATION
    // =====================================================

    navButtons.forEach(button => {

        button.addEventListener(
            'click',
            () => {

                const section =
                    button.dataset.section;

                if (!section) return;


                sections.forEach(item => {

                    const active =
                        item.dataset.communitySection ===
                        section;

                    item.hidden = !active;

                    item.classList.toggle(
                        'active',
                        active
                    );

                });


                navButtons.forEach(nav => {

                    nav.classList.toggle(
                        'active',
                        nav === button
                    );

                });

            }
        );

    });


    // =====================================================
    // RENDER PROFILE
    // =====================================================

    function renderProfile(profile) {

        if (!profile) return;


        if (profileName) {

            profileName.textContent =
                profile.full_name ||
                'HelloChiwa User';

        }


        if (profileUsername) {

            profileUsername.textContent =
                profile.username
                    ? `@${profile.username}`
                    : '@hellochiwa_1';

        }


        if (profileBio) {

            profileBio.textContent =
                profile.bio ||
                'No bio yet.';

        }


        if (profileAvatar) {

            profileAvatar.innerHTML = '';


            const avatarUrl =
                profile.avatar_url ||
                currentUser?.user_metadata?.avatar_url ||
                currentUser?.user_metadata?.picture ||
                null;


            if (avatarUrl) {

                const img =
                    document.createElement('img');

                img.src = avatarUrl;

                img.alt = 'Profile avatar';

                img.className =
                    'community-profile-avatar-image';

                profileAvatar.appendChild(img);

            } else {

                profileAvatar.textContent =
                    (
                        profile.full_name ||
                        profile.username ||
                        'U'
                    )
                    .charAt(0)
                    .toUpperCase();

            }

        }

    }

    // =====================================================
// PROFILE AVATAR LIGHTBOX
// =====================================================

if (profileAvatar) {

    profileAvatar.style.cursor = 'pointer';

    profileAvatar.addEventListener(
        'click',
        () => {

            const image =
                profileAvatar.querySelector('img');

            if (!image || !image.src) {
                return;
            }


            // ---------------------------------------------
            // OVERLAY
            // ---------------------------------------------

            const overlay =
                document.createElement('div');

            overlay.className =
                'community-avatar-lightbox';


            // ---------------------------------------------
            // IMAGE
            // ---------------------------------------------

            const largeImage =
                document.createElement('img');

            largeImage.src =
                image.src;

            largeImage.alt =
                'Profile photo';

            largeImage.className =
                'community-avatar-lightbox-image';


            // ---------------------------------------------
            // CLOSE / BACK BUTTON
            // ---------------------------------------------

            const closeButton =
                document.createElement('button');

            closeButton.type =
                'button';

            closeButton.className =
                'community-avatar-lightbox-close';

            closeButton.textContent =
                '← Back';


            // ---------------------------------------------
            // CLOSE FUNCTION
            // ---------------------------------------------

            function closeLightbox() {

                overlay.remove();

                document.body.style.overflow =
                    '';

            }


            closeButton.addEventListener(
                'click',
                closeLightbox
            );


            overlay.addEventListener(
                'click',
                event => {

                    if (
                        event.target === overlay
                    ) {

                        closeLightbox();

                    }

                }
            );


            // ---------------------------------------------
            // ESC
            // ---------------------------------------------

            const escapeHandler =
                event => {

                    if (
                        event.key === 'Escape'
                    ) {

                        closeLightbox();

                        document.removeEventListener(
                            'keydown',
                            escapeHandler
                        );

                    }

                };


            document.addEventListener(
                'keydown',
                escapeHandler
            );


            // ---------------------------------------------
            // APPEND
            // ---------------------------------------------

            overlay.appendChild(
                closeButton
            );

            overlay.appendChild(
                largeImage
            );

            document.body.appendChild(
                overlay
            );


            document.body.style.overflow =
                'hidden';

        }
    );

}


    // =====================================================
    // LOAD PROFILE
    // =====================================================

    async function loadCommunityProfile() {

        if (!currentUser) {

            currentUser =
                await getCurrentUser();

        }


        if (!currentUser) {

            alert(
                'Please sign in to use HelloChiwa Community.'
            );

            return;

        }


        const {
            data: profile,
            error
        } = await supabase
            .from('hellochiwa_users')
            .select('*')
            .eq(
                'id',
                currentUser.id
            )
            .maybeSingle();


        if (error) {

            console.error(
                'Load profile error:',
                error
            );

            return;

        }


        currentProfile = profile;


        if (
            !isCommunityProfileComplete(profile)
        ) {

            openProfileSetup(profile);

            return;

        }


        renderProfile(profile);

        await loadFollowCounts(
            currentUser.id
        );

        await loadMoments(
            currentUser.id
        );

    }


    // =====================================================
    // SAVE PROFILE
    // =====================================================

    if (setupForm) {

        setupForm.addEventListener(
            'submit',
            async event => {

                event.preventDefault();


                if (!currentUser) {

                    currentUser =
                        await getCurrentUser();

                }


                if (!currentUser) {

                    if (setupMessage) {

                        setupMessage.textContent =
                            'Please sign in first.';

                    }

                    return;

                }


                const fullName =
                    setupFullName?.value.trim();

                const username =
                    setupUsername?.value.trim();

                const bio =
                    setupBio?.value.trim();

                const country =
                    setupCountry?.value;

                const city =
                    setupCity?.value.trim() || null;

                const native1 =
                    setupNative1?.value || null;

                const native2 =
                    setupNative2?.value || null;

                const learning1 =
                    setupLearning1?.value || null;

                const learning2 =
                    setupLearning2?.value || null;

                const interestsText =
                    setupInterests?.value.trim() || '';

                const gender =
                    setupGender?.value || null;

                const age =
                    setupAge
                        ? Number(setupAge.value)
                        : null;


                // =================================================
                // VALIDATION
                // =================================================

                if (
                    !fullName ||
                    !username ||
                    !country ||
                    !native1 ||
                    !learning1
                ) {

                    if (setupMessage) {

                        setupMessage.textContent =
                            'Please complete the required fields.';

                    }

                    return;

                }


                const usernameRegex =
                    /^[A-Za-z0-9_]{3,30}$/;


                if (
                    !usernameRegex.test(username)
                ) {

                    if (setupMessage) {

                        setupMessage.textContent =
                            'Username can contain only letters, numbers and underscore.';

                    }

                    return;

                }


                if (
                    age !== null &&
                    (
                        age < 18 ||
                        age > 120
                    )
                ) {

                    if (setupMessage) {

                        setupMessage.textContent =
                            'Age must be between 18 and 120.';

                    }

                    return;

                }


                // =================================================
                // UNIQUE USERNAME CHECK
                // =================================================

                const {
                    data: existingUser,
                    error: usernameCheckError
                } = await supabase
                    .from('hellochiwa_users')
                    .select('id')
                    .eq(
                        'username',
                        username
                    )
                    .neq(
                        'id',
                        currentUser.id
                    )
                    .maybeSingle();


                if (usernameCheckError) {

                    console.error(
                        'Username check error:',
                        usernameCheckError
                    );

                }


                if (existingUser) {

                    if (setupMessage) {

                        setupMessage.textContent =
                            'That username is already taken. Please choose another one.';

                    }

                    return;

                }


                // =================================================
                // BUTTON STATE
                // =================================================

                if (saveProfileBtn) {

                    saveProfileBtn.disabled =
                        true;

                    saveProfileBtn.textContent =
                        'Saving...';

                }


                if (setupMessage) {

                    setupMessage.textContent =
                        '';

                }


                try {

        // =================================================
    // AVATAR UPLOAD
    // =================================================

    let avatarUrl =
        currentProfile?.avatar_url ||
        currentUser?.user_metadata?.avatar_url ||
        currentUser?.user_metadata?.picture ||
        null;


    if (selectedAvatarFile) {

        // ---------------------------------------------
        // FIXED PATH
        // ---------------------------------------------

        const filePath =
            `profiles/${currentUser.id}/community-avatar`;


        console.log(
            '=== COMMUNITY AVATAR UPLOAD ==='
        );

        console.log(
            'User ID:',
            currentUser.id
        );

        console.log(
            'Bucket:',
            'community-media'
        );

        console.log(
            'File path:',
            filePath
        );

        console.log(
            'File:',
            selectedAvatarFile
        );


        // ---------------------------------------------
        // UPLOAD / REPLACE
        // ---------------------------------------------

        const {
            error: avatarError
        } =
            await supabase
                .storage
                .from('community-media')
                .upload(
                    filePath,
                    selectedAvatarFile,
                    {
                        upsert: true,

                        contentType:
                            selectedAvatarFile.type,

                        cacheControl:
                            '3600'
                    }
                );


        if (avatarError) {

            console.error(
                'COMMUNITY AVATAR UPLOAD ERROR:',
                avatarError
            );

            throw avatarError;

        }


        // ---------------------------------------------
        // PUBLIC URL
        // ---------------------------------------------

        const {
            data: avatarData
        } =
            supabase
                .storage
                .from('community-media')
                .getPublicUrl(
                    filePath
                );


        avatarUrl =
            `${avatarData.publicUrl}?v=${Date.now()}`;


        console.log(
            'Avatar URL:',
            avatarUrl
        );

    }
    // =================================================
    // INTERESTS
    // =================================================

    const interests =
        interestsText
            ? interestsText
                .split(',')
                .map(
                    item =>
                        item.trim()
                )
                .filter(Boolean)
            : [];


    // =================================================
    // DATABASE
    // =================================================

    const profileData = {

        id:
            currentUser.id,

        email:
            currentUser.email,

        full_name:
            fullName,

        username:
            username,

        bio:
            bio || null,

        avatar_url:
            avatarUrl,

        country:
            country,

        city:
            city,

        native_language_1:
            native1,

        native_language_2:
            native2,

        learning_language_1:
            learning1,

        learning_language_2:
            learning2,

        interests:
            interests,

        gender:
            gender,

        age:
            age || null,

        updated_at:
            new Date().toISOString()

    };


    const {
        data,
        error
    } =
        await supabase
            .from(
                'hellochiwa_users'
            )
            .upsert(
                profileData,
                {
                    onConflict:
                        'id'
                }
            )
            .select()
            .single();


    if (error) {

        throw error;

    }


    currentProfile =
        data;


    selectedAvatarFile =
        null;


    // =================================================
    // CLOSE SETUP
    // =================================================

    if (setupModal) {

        setupModal.hidden =
            true;

    }


    // =================================================
    // RENDER
    // =================================================

    renderProfile(data);


    await loadFollowCounts(
        currentUser.id
    );


    await loadMoments(
        currentUser.id
    );


    // =================================================
    // OPEN PROFILE
    // =================================================

    openDrawer();


} catch (error) {

    console.error(
        'SAVE PROFILE ERROR:',
        error
    );


    if (setupMessage) {

        setupMessage.textContent =
            error.message ||
            'Could not save your profile.';

    }


                } finally {

                    if (saveProfileBtn) {

                        saveProfileBtn.disabled =
                            false;

                        saveProfileBtn.textContent =
                            'Save';

                    }

                }

            }
        );

    }

    // =====================================================
    // EDIT PROFILE
    // =====================================================

    const editProfileBtn =
        document.getElementById(
            'communityEditProfileBtn'
        );


    if (editProfileBtn) {

    editProfileBtn.addEventListener(
        'click',
        async () => {

            if (!currentUser) {
                currentUser = await getCurrentUser();
            }

            if (!currentUser) {
                return;
            }

            const {
                data: profile,
                error
            } = await supabase
                .from('hellochiwa_users')
                .select('*')
                .eq('id', currentUser.id)
                .maybeSingle();

            if (error) {
                console.error(
                    'EDIT PROFILE LOAD ERROR:',
                    error
                );

                return;
            }

            currentProfile = profile;

            await openProfileSetup(
                profile
            );

        }
    );

}


    // =====================================================
    // FOLLOW COUNTS
    // =====================================================

    async function loadFollowCounts(userId) {

        const {
            count: followers,
            error: followersError
        } =
            await supabase
                .from('hellochiwa_follows')
                .select(
                    '*',
                    {
                        count: 'exact',
                        head: true
                    }
                )
                .eq(
                    'following_id',
                    userId
                );


        if (!followersError && followersCount) {

            followersCount.textContent =
                followers || 0;

        }


        const {
            count: following,
            error: followingError
        } =
            await supabase
                .from('hellochiwa_follows')
                .select(
                    '*',
                    {
                        count: 'exact',
                        head: true
                    }
                )
                .eq(
                    'follower_id',
                    userId
                );


        if (!followingError && followingCount) {

            followingCount.textContent =
                following || 0;

        }

    }


    // =====================================================
    // LOAD MOMENTS
    // =====================================================

    async function loadMoments(userId) {

        if (!momentsList) return;


        const {
            data: moments,
            error
        } =
            await supabase
                .from('hellochiwa_moments')
                .select('*')
                .eq(
                    'user_id',
                    userId
                )
                .order(
                    'created_at',
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                'Load moments error:',
                error
            );

            return;

        }


        momentsList.innerHTML = '';


        if (
            !moments ||
            moments.length === 0
        ) {

            momentsList.innerHTML =
                '<p class="community-no-moments">No moments yet.</p>';


            if (momentsCount) {

                momentsCount.textContent =
                    '0';

            }

            return;

        }


        if (momentsCount) {

            momentsCount.textContent =
                moments.length;

        }


        moments.forEach(moment => {

            const card =
                document.createElement(
                    'article'
                );

            card.className =
                'community-moment-card';


            if (moment.content) {

                const text =
                    document.createElement(
                        'p'
                    );

                text.className =
                    'community-moment-text';

                text.textContent =
                    moment.content;

                card.appendChild(text);

            }


            if (moment.created_at) {

                const date =
                    document.createElement(
                        'time'
                    );

                date.className =
                    'community-moment-date';

                date.textContent =
                    new Date(
                        moment.created_at
                    ).toLocaleString();

                card.appendChild(date);

            }


            momentsList.appendChild(card);

        });

    }


    // =====================================================
    // CREATE MOMENT
    // =====================================================

    if (createMomentBtn) {

        createMomentBtn.addEventListener(
            'click',
            () => {

                if (momentModal) {

                    momentModal.hidden =
                        false;

                }

                if (momentText) {

                    momentText.focus();

                }

            }
        );

    }


    if (closeMomentModal) {

        closeMomentModal.addEventListener(
            'click',
            () => {

                if (momentModal) {

                    momentModal.hidden =
                        true;

                }

            }
        );

    }


    // =====================================================
    // MEDIA PREVIEW
    // =====================================================

    if (momentMedia) {

        momentMedia.addEventListener(
            'change',
            () => {

                const files =
                    Array.from(
                        momentMedia.files || []
                    );


                const images =
                    files.filter(
                        file =>
                            file.type.startsWith(
                                'image/'
                            )
                    );


                const videos =
                    files.filter(
                        file =>
                            file.type.startsWith(
                                'video/'
                            )
                    );


                if (
                    images.length > 0 &&
                    videos.length > 0
                ) {

                    momentMedia.value = '';

                    if (mediaInfo) {

                        mediaInfo.textContent =
                            'Choose photos OR videos, not both in one Moment.';

                    }

                    return;

                }


                if (images.length > 10) {

                    momentMedia.value = '';

                    if (mediaInfo) {

                        mediaInfo.textContent =
                            'Maximum 10 photos per Moment.';

                    }

                    return;

                }


                if (videos.length > 4) {

                    momentMedia.value = '';

                    if (mediaInfo) {

                        mediaInfo.textContent =
                            'Maximum 4 videos per Moment.';

                    }

                    return;

                }


                if (mediaInfo) {

                    mediaInfo.textContent =
                        `${files.length} media selected.`;

                }


                renderMediaPreview(files);

            }
        );

    }


    function renderMediaPreview(files) {

        if (!mediaPreview) return;

        mediaPreview.innerHTML = '';


        files.forEach(file => {

            const wrapper =
                document.createElement(
                    'div'
                );

            wrapper.className =
                'community-media-preview-item';


            const url =
                URL.createObjectURL(file);


            if (
                file.type.startsWith(
                    'image/'
                )
            ) {

                const img =
                    document.createElement(
                        'img'
                    );

                img.src =
                    url;

                img.alt =
                    file.name;

                wrapper.appendChild(img);

            } else {

                const video =
                    document.createElement(
                        'video'
                    );

                video.src =
                    url;

                video.controls =
                    true;

                wrapper.appendChild(video);

            }


            mediaPreview.appendChild(
                wrapper
            );

        });

    }


    // =====================================================
    // UPLOAD MOMENT MEDIA
    // =====================================================

    async function uploadMomentMedia(
        files,
        userId,
        momentId
    ) {

        const uploaded =
            [];


        for (
            let index = 0;
            index < files.length;
            index++
        ) {

            const file =
                files[index];


            const extension =
                file.name
                    .split('.')
                    .pop()
                    .toLowerCase();


            const path =
                `${userId}/${momentId}/${index}-${Date.now()}.${extension}`;


            const {
                error
            } =
                await supabase
                    .storage
                    .from('community-media')
                    .upload(
                        path,
                        file
                    );


            if (error) {

                throw error;

            }


            const {
                data
            } =
                supabase
                    .storage
                    .from('community-media')
                    .getPublicUrl(
                        path
                    );


            uploaded.push({
                url:
                    data.publicUrl,

                type:
                    file.type.startsWith(
                        'image/'
                    )
                        ? 'image'
                        : 'video'
            });

        }


        return uploaded;

    }


    // =====================================================
    // PUBLISH MOMENT
    // =====================================================

    if (publishMomentBtn) {

        publishMomentBtn.addEventListener(
            'click',
            async () => {

                if (!currentUser) {

                    currentUser =
                        await getCurrentUser();

                }


                if (!currentUser) {

                    if (momentMessage) {

                        momentMessage.textContent =
                            'Please sign in first.';

                    }

                    return;

                }


                const content =
                    momentText?.value.trim() || '';


                const files =
                    Array.from(
                        momentMedia?.files || []
                    );


                if (
                    !content &&
                    files.length === 0
                ) {

                    if (momentMessage) {

                        momentMessage.textContent =
                            'Write something or add media first.';

                    }

                    return;

                }


                const images =
                    files.filter(
                        file =>
                            file.type.startsWith(
                                'image/'
                            )
                    );


                const videos =
                    files.filter(
                        file =>
                            file.type.startsWith(
                                'video/'
                            )
                    );


                if (
                    images.length > 10 ||
                    videos.length > 4 ||
                    (
                        images.length > 0 &&
                        videos.length > 0
                    )
                ) {

                    if (momentMessage) {

                        momentMessage.textContent =
                            'Please check the media limits.';

                    }

                    return;

                }


                publishMomentBtn.disabled =
                    true;

                publishMomentBtn.textContent =
                    'Publishing...';


                try {

                    const {
                        data: moment,
                        error: momentError
                    } =
                        await supabase
                            .from(
                                'hellochiwa_moments'
                            )
                            .insert({
                                user_id:
                                    currentUser.id,

                                content:
                                    content
                            })
                            .select()
                            .single();


                    if (momentError) {

                        throw momentError;

                    }


                    if (files.length > 0) {

                        const uploaded =
                            await uploadMomentMedia(
                                files,
                                currentUser.id,
                                moment.id
                            );


                        console.log(
                            'Moment media uploaded:',
                            uploaded
                        );

                    }


                    if (momentText) {

                        momentText.value =
                            '';

                    }


                    if (momentMedia) {

                        momentMedia.value =
                            '';

                    }


                    if (mediaPreview) {

                        mediaPreview.innerHTML =
                            '';

                    }


                    if (momentMessage) {

                        momentMessage.textContent =
                            'Moment published successfully.';

                    }


                    await loadMoments(
                        currentUser.id
                    );


                    setTimeout(() => {

                        if (momentModal) {

                            momentModal.hidden =
                                true;

                        }

                        if (momentMessage) {

                            momentMessage.textContent =
                                '';

                        }

                    }, 700);

                } catch (error) {

                    console.error(
                        'PUBLISH MOMENT ERROR:',
                        error
                    );


                    if (momentMessage) {

                        momentMessage.textContent =
                            error.message ||
                            'Could not publish the moment.';

                    }

                } finally {

                    publishMomentBtn.disabled =
                        false;

                    publishMomentBtn.textContent =
                        'Publish Moment';

                }

            }
        );

    }


    // =====================================================
    // INITIALIZE
    // =====================================================

    showInitialSection();


    currentUser =
        await getCurrentUser();


    if (!currentUser) {

        console.log(
            'Community: no signed-in user.'
        );

        return;

    }


    // =====================================================
    // CHECK PROFILE
    // =====================================================

    const {
        data: profile,
        error
    } =
        await supabase
            .from('hellochiwa_users')
            .select('*')
            .eq(
                'id',
                currentUser.id
            )
            .maybeSingle();


    if (error) {

        console.error(
            'Initial community profile check:',
            error
        );

        return;

    }


    currentProfile =
        profile;


    // =====================================================
    // FIRST COMMUNITY ENTRY
    // =====================================================

    if (
        !isCommunityProfileComplete(profile)
    ) {

        await openProfileSetup(
            profile
        );

    }


    console.log(
        '=== HELLOCHIWA COMMUNITY READY ==='
    );


    // =====================================================
    // INITIAL SECTION
    // =====================================================

    function showInitialSection() {

        sections.forEach(section => {

            const active =
                section.dataset.communitySection ===
                'chats';

            section.hidden =
                !active;

            section.classList.toggle(
                'active',
                active
            );

        });


        navButtons.forEach(button => {

            button.classList.toggle(
                'active',
                button.dataset.section ===
                'chats'
            );

        });

    }

});