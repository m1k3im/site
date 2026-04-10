// Данные приложения
const app = {
    currentUser: null,
    subscriptionTiers: [
        {
            id: 'free',
            name: 'Бесплатно',
            price: 0,
            description: 'Доступ к базовому контенту',
            color: '#6b7280',
            icon: 'fas fa-user',
            benefits: ['Просмотр общедоступных постов', 'Комментарии']
        },
        {
            id: 'bronze',
            name: 'Bronze',
            price: 199,
            description: 'Начальный уровень поддержки',
            color: '#cd7f32',
            icon: 'fas fa-medal',
            benefits: ['Все из бесплатного', 'Эксклюзивные посты', 'Ранний доступ']
        },
        {
            id: 'silver',
            name: 'Silver',
            price: 499,
            description: 'Средний уровень поддержки',
            color: '#c0c0c0',
            icon: 'fas fa-gem',
            benefits: ['Все из Bronze', 'Голосование в опросах', 'Месячные бонусы', 'Приоритетная поддержка'],
            featured: true
        },
        {
            id: 'gold',
            name: 'Gold',
            price: 999,
            description: 'Премиум уровень',
            color: '#ffd700',
            icon: 'fas fa-crown',
            benefits: ['Все из Silver', 'Персональный контент', 'Закрытые трансляции', 'Личное общение']
        }
    ],
    posts: [
        {
            id: 1,
            title: 'Добро пожаловать!',
            content: 'Спасибо что поддерживаете мой проект! Здесь будет много интересного контента.',
            tier: 'free',
            image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
            date: new Date('2024-01-15'),
            author: 'Креатор'
        },
        {
            id: 2,
            title: 'Эксклюзивный пост для Bronze',
            content: 'Это специальный контент доступный только подписчикам уровня Bronze и выше.',
            tier: 'bronze',
            image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
            date: new Date('2024-01-20'),
            author: 'Креатор'
        },
        {
            id: 3,
            title: 'Silver контент',
            content: 'Этот пост доступен только Silver и Gold подписчикам.',
            tier: 'silver',
            date: new Date('2024-01-22'),
            author: 'Креатор'
        }
    ],
    polls: [
        {
            id: 1,
            question: 'Какой контент вы хотите видеть больше?',
            options: [
                { text: 'Обучающие материалы', votes: 15 },
                { text: 'Развлекательный контент', votes: 23 },
                { text: 'Закулисье', votes: 18 },
                { text: 'Q&A сессии', votes: 12 }
            ],
            tier: 'silver',
            date: new Date('2024-01-18'),
            userVoted: false
        }
    ],
    users: [
        {
            id: 1,
            email: 'admin',
            password: 'admin',
            role: 'creator',
            name: 'Креатор'
        },
        {
            id: 2,
            email: 'user',
            password: 'user',
            role: 'subscriber',
            name: 'Подписчик',
            subscription: 'gold'
        }
    ]
};

// Получение уровня подписки по ID
function getTierById(tierId) {
    return app.subscriptionTiers.find(tier => tier.id === tierId);
}

// Проверка доступа к контенту
function hasAccess(requiredTier) {
    if (!app.currentUser) return requiredTier === 'free';
    if (app.currentUser.role === 'creator') return true;
    
    const userTier = app.currentUser.subscription || 'free';
    const tierLevels = ['free', 'bronze', 'silver', 'gold'];
    const userLevel = tierLevels.indexOf(userTier);
    const requiredLevel = tierLevels.indexOf(requiredTier);
    
    return userLevel >= requiredLevel;
}

// Инициализация страниц
function initPages() {
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.getAttribute('data-page');
            
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(`${targetPage}Page`).classList.add('active');
            
            if (targetPage === 'subscriptions') {
                renderSubscriptionTiers();
            } else if (targetPage === 'posts') {
                renderPosts();
            }
        });
    });
}

// Отрисовка уровней подписок
function renderSubscriptionTiers() {
    const container = document.getElementById('subscriptionTiers');
    container.innerHTML = '';
    
    app.subscriptionTiers.forEach(tier => {
        const card = document.createElement('div');
        card.className = `subscription-card ${tier.featured ? 'featured' : ''}`;
        card.style.borderColor = tier.color;
        
        card.innerHTML = `
            <div class="subscription-header">
                <div class="subscription-icon" style="color: ${tier.color}">
                    <i class="${tier.icon}"></i>
                </div>
                <h3 class="subscription-name">${tier.name}</h3>
                <div class="subscription-price">
                    ${tier.price === 0 ? 'Бесплатно' : `${tier.price}₽`}
                    ${tier.price > 0 ? '<span>/месяц</span>' : ''}
                </div>
            </div>
            <p class="subscription-description">${tier.description}</p>
            <ul class="subscription-benefits">
                ${tier.benefits.map(benefit => `
                    <li><i class="fas fa-check"></i> ${benefit}</li>
                `).join('')}
            </ul>
            <button class="btn btn-primary btn-block subscribe-btn" data-tier="${tier.id}">
                ${tier.price === 0 ? 'Зарегистрироваться' : 'Подписаться'}
            </button>
        `;
        
        container.appendChild(card);
    });
    
    // Обработчики кнопок подписки
    document.querySelectorAll('.subscribe-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tierId = btn.getAttribute('data-tier');
            handleSubscription(tierId);
        });
    });
}

// Обработка подписки
function handleSubscription(tierId) {
    if (!app.currentUser) {
        alert('Пожалуйста, войдите в систему');
        document.getElementById('loginModal').style.display = 'block';
        return;
    }
    
    const tier = getTierById(tierId);
    const modal = document.getElementById('subscriptionModal');
    const infoContainer = document.getElementById('selectedTierInfo');
    
    infoContainer.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 3rem; color: ${tier.color}">
                <i class="${tier.icon}"></i>
            </div>
            <h3>${tier.name}</h3>
            <p style="font-size: 2rem; color: ${tier.color}; font-weight: bold;">
                ${tier.price === 0 ? 'Бесплатно' : `${tier.price}₽/месяц`}
            </p>
        </div>
    `;
    
    modal.style.display = 'block';
}

// Отрисовка постов
function renderPosts() {
    const container = document.getElementById('postsContainer');
    container.innerHTML = '';
    
    // Сортировка постов по дате (новые первыми)
    const sortedPosts = [...app.posts, ...app.polls].sort((a, b) => b.date - a.date);
    
    sortedPosts.forEach(item => {
        if (item.question) {
            renderPoll(item, container);
        } else {
            renderPost(item, container);
        }
    });
    
    if (sortedPosts.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 50px; color: var(--gray);">Пока нет постов</p>';
    }
}

// Отрисовка поста
function renderPost(post, container) {
    const tier = getTierById(post.tier);
    const hasUserAccess = hasAccess(post.tier);
    
    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    
    postCard.innerHTML = `
        <div class="post-header">
            <h2 class="post-title">${post.title}</h2>
            <span class="post-badge" style="background: ${tier.color}">
                <i class="${tier.icon}"></i> ${tier.name}
            </span>
        </div>
        
        ${hasUserAccess ? `
            ${post.image ? `<img src="${post.image}" alt="${post.title}" class="post-image">` : ''}
            <div class="post-content">${post.content}</div>
        ` : `
            <div class="post-locked">
                <i class="fas fa-lock"></i>
                <h3>Этот контент доступен только подписчикам ${tier.name}</h3>
                <p style="margin: 15px 0;">Оформите подписку чтобы получить доступ</p>
                <button class="btn btn-primary subscribe-btn" data-tier="${post.tier}">
                    Подписаться
                </button>
            </div>
        `}
        
        <div class="post-meta">
            <span><i class="fas fa-user"></i> ${post.author}</span>
            <span><i class="fas fa-calendar"></i> ${post.date.toLocaleDateString('ru-RU')}</span>
        </div>
    `;
    
    container.appendChild(postCard);
}

// Отрисовка опроса
function renderPoll(poll, container) {
    const tier = getTierById(poll.tier);
    const hasUserAccess = hasAccess(poll.tier);
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
    
    const pollCard = document.createElement('div');
    pollCard.className = 'post-card';
    
    pollCard.innerHTML = `
        <div class="post-header">
            <h2 class="post-title"><i class="fas fa-poll"></i> ${poll.question}</h2>
            <span class="post-badge" style="background: ${tier.color}">
                <i class="${tier.icon}"></i> ${tier.name}
            </span>
        </div>
        
        ${hasUserAccess ? `
            ${!poll.userVoted ? `
                <form class="poll-form" data-poll-id="${poll.id}">
                    <div class="poll-options">
                        ${poll.options.map((opt, index) => `
                            <label class="poll-option">
                                <input type="radio" name="poll-${poll.id}" value="${index}" required>
                                ${opt.text}
                            </label>
                        `).join('')}
                    </div>
                    <button type="submit" class="btn btn-primary">Проголосовать</button>
                </form>
            ` : `
                <div class="poll-results">
                    <p style="margin-bottom: 15px; color: var(--gray);">
                        Всего голосов: ${totalVotes}
                    </p>
                    ${poll.options.map(opt => {
                        const percentage = totalVotes > 0 ? (opt.votes / totalVotes * 100).toFixed(1) : 0;
                        return `
                            <div class="poll-result-item">
                                <div class="poll-result-label">
                                    <span>${opt.text}</span>
                                    <span>${opt.votes} голосов</span>
                                </div>
                                <div class="poll-result-bar">
                                    <div class="poll-result-fill" style="width: ${percentage}%">
                                        ${percentage}%
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `}
        ` : `
            <div class="post-locked">
                <i class="fas fa-lock"></i>
                <h3>Этот опрос доступен только подписчикам ${tier.name}</h3>
                <button class="btn btn-primary subscribe-btn" data-tier="${poll.tier}">
                    Подписаться
                </button>
            </div>
        `}
        
        <div class="post-meta">
            <span><i class="fas fa-calendar"></i> ${poll.date.toLocaleDateString('ru-RU')}</span>
        </div>
    `;
    
    container.appendChild(pollCard);
    
    // Обработчик голосования
    const form = pollCard.querySelector('.poll-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedOption = form.querySelector('input[type="radio"]:checked').value;
            votePoll(poll.id, parseInt(selectedOption));
        });
    }
}

// Голосование в опросе
function votePoll(pollId, optionIndex) {
    const poll = app.polls.find(p => p.id === pollId);
    if (poll) {
        poll.options[optionIndex].votes++;
        poll.userVoted = true;
        renderPosts();
    }
}

// Система входа
function initAuth() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginModal = document.getElementById('loginModal');
    const loginForm = document.getElementById('loginForm');
    
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });
    
    logoutBtn.addEventListener('click', () => {
        app.currentUser = null;
        updateAuthUI();
        renderPosts();
    });
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        const user = app.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            app.currentUser = user;
            loginModal.style.display = 'none';
            updateAuthUI();
            renderPosts();
            
            if (user.role === 'creator') {
                document.getElementById('openAdminPanel').style.display = 'block';
            }
        } else {
            alert('Неверный логин или пароль');
        }
    });
}

// Обновление UI в зависимости от статуса входа
function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const openAdminBtn = document.getElementById('openAdminPanel');
    
    if (app.currentUser) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        logoutBtn.textContent = app.currentUser.name;
        
        if (app.currentUser.role === 'creator') {
            openAdminBtn.style.display = 'block';
        } else {
            openAdminBtn.style.display = 'none';
        }
    } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        openAdminBtn.style.display = 'none';
    }
}

// Админ панель
function initAdminPanel() {
    const openBtn = document.getElementById('openAdminPanel');
    const closeBtn = document.getElementById('closeAdminPanel');
    const adminPanel = document.getElementById('adminPanel');
    const adminNavLinks = document.querySelectorAll('.admin-nav-link');
    const sections = document.querySelectorAll('.admin-section');
    
    openBtn.addEventListener('click', () => {
        adminPanel.style.display = 'flex';
        renderTierList();
        updateAnalytics();
    });
    
    closeBtn.addEventListener('click', () => {
        adminPanel.style.display = 'none';
    });
    
    adminNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = link.getAttribute('data-section');
            
            adminNavLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(`${targetSection}Section`).classList.add('active');
            
            if (targetSection === 'manage-tiers') {
                renderTierList();
            } else if (targetSection === 'analytics') {
                updateAnalytics();
            }
        });
    });
    
    // Форма создания поста
    document.getElementById('createPostForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const postType = document.getElementById('postType').value;
        
        if (postType === 'poll') {
            alert('Для создания опроса перейдите в раздел "Создать опрос"');
            return;
        }
        
        const newPost = {
            id: app.posts.length + 1,
            title: document.getElementById('postTitle').value,
            content: document.getElementById('postContent').value,
            image: document.getElementById('postImage').value,
            tier: document.getElementById('postTier').value,
            date: new Date(),
            author: app.currentUser.name
        };
        
        app.posts.unshift(newPost);
        e.target.reset();
        alert('Пост успешно опубликован!');
        updateAnalytics();
    });
    
    // Форма создания уровня
    document.getElementById('createTierForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newTier = {
            id: 'tier-' + Date.now(),
            name: document.getElementById('tierName').value,
            price: parseInt(document.getElementById('tierPrice').value),
            description: document.getElementById('tierDescription').value,
            color: document.getElementById('tierColor').value,
            icon: document.getElementById('tierIcon').value,
            benefits: document.getElementById('tierBenefits').value.split(',').map(b => b.trim())
        };
        
        app.subscriptionTiers.push(newTier);
        e.target.reset();
        renderTierList();
        updateTierSelects();
        alert('Уровень подписки создан!');
    });
    
    // Форма создания опроса
    document.getElementById('createPollForm').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const options = Array.from(document.querySelectorAll('.poll-option'))
            .map(input => ({
                text: input.value,
                votes: 0
            }))
            .filter(opt => opt.text.trim() !== '');
        
        const newPoll = {
            id: app.polls.length + 1,
            question: document.getElementById('pollQuestion').value,
            options: options,
            tier: document.getElementById('pollTier').value,
            date: new Date(),
            userVoted: false
        };
        
        app.polls.unshift(newPoll);
        e.target.reset();
        document.getElementById('pollOptions').innerHTML = `
            <input type="text" class="form-control poll-option" placeholder="Вариант 1" required>
            <input type="text" class="form-control poll-option" placeholder="Вариант 2" required>
        `;
        alert('Опрос создан!');
        updateAnalytics();
    });
    
    // Добавление вариантов опроса
    document.getElementById('addPollOption').addEventListener('click', () => {
        const container = document.getElementById('pollOptions');
        const optionCount = container.querySelectorAll('.poll-option').length + 1;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'form-control poll-option';
        input.placeholder = `Вариант ${optionCount}`;
        container.appendChild(input);
    });
    
    updateTierSelects();
}

// Обновление селектов с уровнями
function updateTierSelects() {
    const selects = [
        document.getElementById('postTier'),
        document.getElementById('pollTier')
    ];
    
    selects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = app.subscriptionTiers.map(tier => 
            `<option value="${tier.id}">${tier.name}</option>`
        ).join('');
        if (currentValue) select.value = currentValue;
    });
}

// Отрисовка списка уровней в админке
function renderTierList() {
    const container = document.getElementById('tierList');
    container.innerHTML = '';
    
    app.subscriptionTiers.forEach(tier => {
        const tierItem = document.createElement('div');
        tierItem.className = 'tier-item';
        tierItem.innerHTML = `
            <div class="tier-info">
                <h4 style="color: ${tier.color}">
                    <i class="${tier.icon}"></i> ${tier.name}
                </h4>
                <p>${tier.price === 0 ? 'Бесплатно' : `${tier.price}₽/месяц`} - ${tier.description}</p>
            </div>
            <div class="tier-actions">
                <button class="btn btn-sm btn-secondary" onclick="editTier('${tier.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                ${tier.id !== 'free' ? `
                    <button class="btn btn-sm btn-danger" onclick="deleteTier('${tier.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </div>
        `;
        container.appendChild(tierItem);
    });
}

// Удаление уровня
function deleteTier(tierId) {
    if (confirm('Вы уверены что хотите удалить этот уровень?')) {
        app.subscriptionTiers = app.subscriptionTiers.filter(t => t.id !== tierId);
        renderTierList();
        updateTierSelects();
    }
}

// Аналитика
function updateAnalytics() {
    const subscribers = app.users.filter(u => u.role === 'subscriber');
    
    document.getElementById('totalSubscribers').textContent = subscribers.length;
    document.getElementById('totalPosts').textContent = app.posts.length;
    document.getElementById('totalPolls').textContent = app.polls.length;
    
    const revenue = subscribers.reduce((sum, user) => {
        const tier = getTierById(user.subscription);
        return sum + (tier ? tier.price : 0);
    }, 0);
    document.getElementById('totalRevenue').textContent = revenue.toLocaleString('ru-RU');
    
    // Подписчики по уровням
    const subscribersByTier = {};
    app.subscriptionTiers.forEach(tier => {
        subscribersByTier[tier.id] = subscribers.filter(u => u.subscription === tier.id).length;
    });
    
    const container = document.getElementById('subscribersByTier');
    container.innerHTML = '';
    
    app.subscriptionTiers.forEach(tier => {
        const count = subscribersByTier[tier.id] || 0;
        container.innerHTML += `
            <div class="subscriber-tier-row">
                <span style="color: ${tier.color}">
                    <i class="${tier.icon}"></i> ${tier.name}
                </span>
                <strong>${count} подписчиков</strong>
            </div>
        `;
    });
}

// Модальные окна
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal .close');
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal').style.display = 'none';
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Форма подписки
    document.getElementById('subscriptionForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Подписка успешно оформлена! (демо-режим)');
        document.getElementById('subscriptionModal').style.display = 'none';
    });
}

// Делегирование событий для динамических кнопок
document.addEventListener('click', (e) => {
    if (e.target.closest('.subscribe-btn')) {
        const btn = e.target.closest('.subscribe-btn');
        const tierId = btn.getAttribute('data-tier');
        handleSubscription(tierId);
    }
});

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    initPages();
    initAuth();
    initAdminPanel();
    initModals();
    renderSubscriptionTiers();
    renderPosts();
    updateAuthUI();
});