document.addEventListener('DOMContentLoaded', async () => {

    console.log('=== HELLOCHIWA COMMUNITY CHAT START ===');

    const supabase = window.supabaseClient;

    if (!supabase) {
        console.error('Chat: Supabase client not found.');
        return;
    }


    // =====================================================
    // ELEMENTS
    // =====================================================

    const searchInput =
        document.getElementById(
            'communityChatSearchInput'
        );

    const searchClear =
        document.getElementById(
            'communityChatSearchClear'
        );

    const searchResults =
        document.getElementById(
            'communityChatSearchResults'
        );

    const conversationList =
        document.getElementById(
            'communityConversationList'
        );

    const emptyState =
        document.getElementById(
            'communityChatEmpty'
        );


    if (!searchInput || !conversationList) {
        console.error(
            'Chat elements not found.'
        );
        return;
    }


    // =====================================================
    // STATE
    // =====================================================

    let currentUser = null;
    let searchTimer = null;


    // =====================================================
    // CURRENT USER
    // =====================================================

    async function getCurrentUser() {

        const {
            data,
            error
        } = await supabase.auth.getUser();

        if (error) {

            console.error(
                'Chat getUser error:',
                error
            );

            return null;
        }

        return data?.user || null;
    }


    currentUser =
        await getCurrentUser();


    if (!currentUser) {

        console.log(
            'Chat: no authenticated user.'
        );

        return;
    }


    // =====================================================
    // HELPERS
    // =====================================================

    function escapeHtml(value) {

        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

    }


    function getInitial(profile) {

        return (
            profile?.full_name ||
            profile?.username ||
            'U'
        )
        .charAt(0)
        .toUpperCase();

    }


    function avatarHtml(profile) {

        if (profile?.avatar_url) {

            return `
                <img
                    src="${escapeHtml(profile.avatar_url)}"
                    alt=""
                    class="community-chat-avatar-image"
                >
            `;

        }

        return `
            <span class="community-chat-avatar-letter">
                ${escapeHtml(getInitial(profile))}
            </span>
        `;

    }


    function formatTime(dateValue) {

        if (!dateValue) return '';

        const date =
            new Date(dateValue);

        return date.toLocaleTimeString(
            [],
            {
                hour: '2-digit',
                minute: '2-digit'
            }
        );

    }


    // =====================================================
    // SEARCH UI
    // =====================================================

    function updateSearchButton() {

        const hasText =
            searchInput.value.trim().length > 0;

        if (searchClear) {

            searchClear.hidden =
                !hasText;

        }

    }


    function clearSearch() {

        searchInput.value = '';

        updateSearchButton();

        if (searchResults) {
            searchResults.innerHTML = '';
        }

        loadConversations();

    }


    if (searchInput) {

        searchInput.addEventListener(
            'input',
            () => {

                updateSearchButton();

                clearTimeout(
                    searchTimer
                );

                const query =
                    searchInput.value.trim();

                if (!query) {

                    if (searchResults) {
                        searchResults.innerHTML = '';
                    }

                    loadConversations();

                    return;
                }


                searchTimer =
                    setTimeout(
                        () => {
                            searchUsers(query);
                        },
                        300
                    );

            }
        );

    }


    if (searchClear) {

        searchClear.addEventListener(
            'click',
            clearSearch
        );

    }


    // =====================================================
    // SEARCH USERS
    // =====================================================

    async function searchUsers(query) {

        if (!searchResults) return;

        searchResults.innerHTML = `
            <div class="community-chat-loading">
                Searching...
            </div>
        `;


        const {
            data: users,
            error
        } =
            await supabase
                .from('hellochiwa_users')
                .select(`
                    id,
                    full_name,
                    username,
                    avatar_url,
                    bio,
                    country,
                    native_language_1,
                    learning_language_1
                `)
                .neq(
                    'id',
                    currentUser.id
                )
                .or(
                    `username.ilike.%${query}%,full_name.ilike.%${query}%`
                )
                .limit(30);


        if (error) {

            console.error(
                'Chat user search error:',
                error
            );

            searchResults.innerHTML = `
                <div class="community-chat-error">
                    Could not search users.
                </div>
            `;

            return;
        }


        renderSearchResults(
            users || []
        );

    }


    // =====================================================
    // RENDER SEARCH RESULTS
    // =====================================================

    function renderSearchResults(users) {

        if (!searchResults) return;

        searchResults.innerHTML = '';


        if (!users.length) {

            searchResults.innerHTML = `
                <div class="community-chat-no-results">
                    No HelloChiwa users found.
                </div>
            `;

            return;
        }


        users.forEach(user => {

            const item =
                document.createElement('button');

            item.type = 'button';

            item.className =
                'community-chat-user-result';


            item.innerHTML = `

                <div class="community-chat-avatar">
                    ${avatarHtml(user)}
                </div>

                <div class="community-chat-user-info">

                    <strong>
                        ${escapeHtml(
                            user.full_name ||
                            user.username ||
                            'HelloChiwa User'
                        )}
                    </strong>

                    <span>
                        @${escapeHtml(
                            user.username || ''
                        )}
                    </span>

                    <small>
                        ${escapeHtml(
                            user.learning_language_1
                                ? `Learning ${user.learning_language_1}`
                                : ''
                        )}
                    </small>

                </div>

            `;


            item.addEventListener(
                'click',
                () => {

                    openUserChat(
                        user
                    );

                }
            );


            searchResults.appendChild(
                item
            );

        });

    }


    // =====================================================
    // FIND / CREATE CONVERSATION
    // =====================================================

    async function openUserChat(user) {

        if (!user?.id) return;


        const ids =
            [
                currentUser.id,
                user.id
            ]
            .sort();


        const user1Id =
            ids[0];

        const user2Id =
            ids[1];


        let {
            data: conversation,
            error
        } =
            await supabase
                .from(
                    'hellochiwa_conversations'
                )
                .select('*')
                .eq(
                    'user1_id',
                    user1Id
                )
                .eq(
                    'user2_id',
                    user2Id
                )
                .maybeSingle();


        if (error) {

            console.error(
                'Find conversation error:',
                error
            );

            return;
        }


        if (!conversation) {

            const result =
                await supabase
                    .from(
                        'hellochiwa_conversations'
                    )
                    .insert({
                        user1_id:
                            user1Id,

                        user2_id:
                            user2Id
                    })
                    .select()
                    .single();


            if (result.error) {

                console.error(
                    'Create conversation error:',
                    result.error
                );

                return;
            }


            conversation =
                result.data;

        }


        openChatWindow(
            conversation,
            user
        );

    }


    // =====================================================
    // LOAD CONVERSATIONS
    // =====================================================

    async function loadConversations() {

        if (!conversationList) return;


        const {
            data: conversations,
            error
        } =
            await supabase
                .from(
                    'hellochiwa_conversations'
                )
                .select('*')
                .or(
                    `user1_id.eq.${currentUser.id},user2_id.eq.${currentUser.id}`
                )
                .order(
                    'last_message_at',
                    {
                        ascending: false,
                        nullsFirst: false
                    }
                );


        if (error) {

            console.error(
                'Load conversations error:',
                error
            );

            return;
        }


        conversationList.innerHTML = '';


        if (!conversations?.length) {

            if (emptyState) {
                emptyState.hidden = false;
            }

            return;
        }


        if (emptyState) {
            emptyState.hidden = true;
        }


        for (
            const conversation
            of conversations
        ) {

            const otherUserId =
                conversation.user1_id ===
                currentUser.id
                    ? conversation.user2_id
                    : conversation.user1_id;


            const {
                data: user,
                error: userError
            } =
                await supabase
                    .from(
                        'hellochiwa_users'
                    )
                    .select(`
                        id,
                        full_name,
                        username,
                        avatar_url
                    `)
                    .eq(
                        'id',
                        otherUserId
                    )
                    .maybeSingle();


            if (userError || !user) {
                continue;
            }


            const item =
                document.createElement('button');

            item.type = 'button';

            item.className =
                'community-conversation-item';


            item.innerHTML = `

                <div class="community-chat-avatar">
                    ${avatarHtml(user)}
                </div>

                <div class="community-conversation-info">

                    <strong>
                        ${escapeHtml(
                            user.full_name ||
                            user.username ||
                            'HelloChiwa User'
                        )}
                    </strong>

                    <span>
                        @${escapeHtml(
                            user.username || ''
                        )}
                    </span>

                </div>

                <time>
                    ${formatTime(
                        conversation.last_message_at
                    )}
                </time>

            `;


            item.addEventListener(
                'click',
                () => {

                    openChatWindow(
                        conversation,
                        user
                    );

                }
            );


            conversationList.appendChild(
                item
            );

        }

    }


    // =====================================================
    // CHAT WINDOW
    // =====================================================

    function openChatWindow(
        conversation,
        user
    ) {

        const existing =
            document.getElementById(
                'communityChatWindow'
            );

        if (existing) {
            existing.remove();
        }


        const chat =
            document.createElement('div');

        chat.id =
            'communityChatWindow';

        chat.className =
            'community-chat-window';


        chat.innerHTML = `

            <div class="community-chat-window-header">

                <button
                    type="button"
                    class="community-chat-back"
                    id="communityChatBack"
                >
                    ←
                </button>

                <div class="community-chat-header-user">

                    <div class="community-chat-avatar">
                        ${avatarHtml(user)}
                    </div>

                    <div>
                        <strong>
                            ${escapeHtml(
                                user.full_name ||
                                user.username ||
                                'User'
                            )}
                        </strong>

                        <span>
                            @${escapeHtml(
                                user.username || ''
                            )}
                        </span>
                    </div>

                </div>

                <button
                    type="button"
                    class="community-chat-more"
                    id="communityChatMore"
                >
                    ⋮
                </button>

            </div>


            <div
                id="communityChatMessages"
                class="community-chat-messages"
            ></div>


            <div class="community-chat-composer">

                <input
                    id="communityChatMessageInput"
                    type="text"
                    placeholder="Message..."
                    autocomplete="off"
                    maxlength="5000"
                >

                <button
                    id="communityChatSend"
                    type="button"
                >
                    Send
                </button>

            </div>

        `;


        const container =
            document.getElementById(
                'communityChatsContent'
            );


        if (!container) return;


        container.appendChild(
            chat
        );


        const back =
            chat.querySelector(
                '#communityChatBack'
            );


        if (back) {

            back.addEventListener(
                'click',
                () => {

                    chat.remove();

                    loadConversations();

                }
            );

        }


        const input =
            chat.querySelector(
                '#communityChatMessageInput'
            );


        const send =
            chat.querySelector(
                '#communityChatSend'
            );


        if (send) {

            send.addEventListener(
                'click',
                () => {

                    sendMessage(
                        conversation,
                        user,
                        input
                    );

                }
            );

        }


        if (input) {

            input.addEventListener(
                'keydown',
                event => {

                    if (
                        event.key === 'Enter'
                    ) {

                        event.preventDefault();

                        sendMessage(
                            conversation,
                            user,
                            input
                        );

                    }

                }
            );

        }


        loadMessages(
            conversation.id,
            user
        );

    }


    // =====================================================
    // LOAD MESSAGES
    // =====================================================

    async function loadMessages(
        conversationId,
        user
    ) {

        const messagesBox =
            document.getElementById(
                'communityChatMessages'
            );


        if (!messagesBox) return;


        const {
            data: messages,
            error
        } =
            await supabase
                .from(
                    'hellochiwa_messages'
                )
                .select('*')
                .eq(
                    'conversation_id',
                    conversationId
                )
                .order(
                    'created_at',
                    {
                        ascending: true
                    }
                );


        if (error) {

            console.error(
                'Load messages error:',
                error
            );

            messagesBox.innerHTML = `
                <div class="community-chat-error">
                    Could not load messages.
                </div>
            `;

            return;
        }


        messagesBox.innerHTML = '';


        (messages || []).forEach(
            message => {

                renderMessage(
                    messagesBox,
                    message,
                    user
                );

            }
        );


        scrollMessagesToBottom(
            messagesBox
        );

    }


    // =====================================================
    // RENDER MESSAGE
    // =====================================================

    function renderMessage(
        container,
        message,
        user
    ) {

        const mine =
            message.sender_id ===
            currentUser.id;


        const bubble =
            document.createElement('div');

        bubble.className =
            mine
                ? 'community-message mine'
                : 'community-message';


        const content =
            message.is_deleted
                ? 'Message deleted'
                : message.content || '';


        bubble.innerHTML = `

            <div class="community-message-bubble">

                <div class="community-message-content">
                    ${escapeHtml(content)}
                </div>

                <div class="community-message-time">
                    ${formatTime(
                        message.created_at
                    )}
                    ${
                        mine && message.read_at
                            ? ' ✓✓'
                            : ''
                    }
                </div>

            </div>

        `;


        container.appendChild(
            bubble
        );

    }


    // =====================================================
    // SEND MESSAGE
    // =====================================================

    async function sendMessage(
        conversation,
        user,
        input
    ) {

        if (!input) return;


        const content =
            input.value.trim();


        if (!content) return;


        input.disabled =
            true;


        const {
            error
        } =
            await supabase
                .from(
                    'hellochiwa_messages'
                )
                .insert({

                    conversation_id:
                        conversation.id,

                    sender_id:
                        currentUser.id,

                    receiver_id:
                        user.id,

                    message_type:
                        'text',

                    content:
                        content

                });


        input.disabled =
            false;


        if (error) {

            console.error(
                'Send message error:',
                error
            );

            alert(
                error.message ||
                'Could not send message.'
            );

            return;
        }


        input.value =
            '';


        await loadMessages(
            conversation.id,
            user
        );

    }


    // =====================================================
    // REALTIME MESSAGES
    // =====================================================

    supabase
        .channel(
            `hellochiwa-chat-${currentUser.id}`
        )
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'hellochiwa_messages'
            },
            payload => {

                const message =
                    payload.new;


                const chat =
                    document.getElementById(
                        'communityChatWindow'
                    );


                if (!chat) return;


                const box =
                    document.getElementById(
                        'communityChatMessages'
                    );


                if (!box) return;


                if (
                    box.dataset.conversationId &&
                    box.dataset.conversationId !==
                    message.conversation_id
                ) {
                    return;
                }


                if (
                    message.sender_id ===
                    currentUser.id
                ) {
                    return;
                }


                renderMessage(
                    box,
                    message,
                    {}
                );


                scrollMessagesToBottom(
                    box
                );

            }
        )
        .subscribe();


    // =====================================================
    // SCROLL
    // =====================================================

    function scrollMessagesToBottom(
        element
    ) {

        if (!element) return;

        element.scrollTop =
            element.scrollHeight;

    }


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    loadConversations();


    console.log(
        '=== HELLOCHIWA COMMUNITY CHAT READY ==='
    );

});