const API = {
    clients:  'https://rickandmortyapi.com/api/character',
    products: 'https://fakestoreapi.com/products?limit=6',
    feedback: 'https://fakerapi.it/api/v1/texts?_quantity=6&_characters=300',
};

function normalizeClients(data) {
    return data.map(character => ({
        name: character.name,
        img:  character.image,
        type: 'client',
    }));
}

function normalizeProducts(data) {
    return data.map(product => ({
        name: product.title,
        img:  product.image,
        type: 'product',
    }));
}

function normalizeFeedback(data) {
    return data.data.map(item => ({
        name:  item.author,
        img:   null,
        text:  item.content,
        title: item.title,
        type:  'feedback',
    }));
}

function createdCard({ name, img, text, title, type }) {
    if (type === 'feedback') {
        return `
            <article class="card card--feedback">
                <p class="card__title">${title ?? ''}</p>
                <p class="card__text">${text ?? ''}</p>
                <p class="card__name">${name}</p>
            </article>
        `;
    }

    const avatarClass = type === 'product' ? 'card__avatar card__avatar--product' : 'card__avatar';
    const avatar = img
        ? `<img class="${avatarClass}" src="${img}" alt="${name}" loading="lazy" />`
        : `<div class="card__avatar card__avatar--placeholder">👤</div>`;

    return `
        <article class="card">
            ${avatar}
            <p class="card__name">${name}</p>
        </article>
    `;
}

function renderCards(data) {
    document.getElementById('cardsContainer').innerHTML = data.map(createdCard).join('');
}

function renderLoading() {
    document.getElementById('cardsContainer').innerHTML = `<p class="cards-loading">Loading…</p>`;
}

function renderError(msg) {
    document.getElementById('cardsContainer').innerHTML = `<p class="cards-error">${msg}</p>`;
}

async function showClients() {
    renderLoading();
    try {
        const res  = await fetch(API.clients);
        const data = await res.json();
        renderCards(normalizeClients(data.results.slice(0, 6)));
    } catch (err) {
        renderError('Failed to load clients.');
        showModal(`Error fetching data: ${err.message}`);
    }
}

async function showProducts() {
    renderLoading();
    try {
        const res  = await fetch(API.products);
        const data = await res.json();
        renderCards(normalizeProducts(data));
    } catch (err) {
        renderError('Failed to load products.');
        showModal(`Error fetching data: ${err.message}`);
    }
}

async function showFeedback() {
    renderLoading();
    try {
        const res  = await fetch(API.feedback);
        const data = await res.json();
        renderCards(normalizeFeedback(data));
    } catch (err) {
        renderError('Failed to load feedback.');
        showModal(`Error fetching data: ${err.message}`);
    }
}

const tabMap = {
    clientsBtn:  showClients,
    productsBtn: showProducts,
    feedbackBtn: showFeedback,
};

const tabButtons = document.querySelectorAll('.tab');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => {
            b.classList.remove('tab--active');
            b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('tab--active');
        btn.setAttribute('aria-selected', 'true');
        tabMap[btn.id]();
    });
});

function showModal(message) {
    document.getElementById('modalMessage').innerHTML = message;
    document.getElementById('modal').classList.add('modal--visible');
}

function closeModal() {
    document.getElementById('modal').classList.remove('modal--visible');
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
});

function showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const existing = input.closest('.form-group').querySelector('.form-error');
    if (existing) existing.remove();

    const error = document.createElement('span');
    error.className = 'form-error';
    error.textContent = message;
    input.closest('.form-group').appendChild(error);
}

function clearAllErrors() {
    document.querySelectorAll('.form-error').forEach(el => el.remove());
}

function validateForm() {
    clearAllErrors();
    let isValid = true;

    const name = document.getElementById('firstName').value.trim();
    if (!name) {
        showFieldError('firstName', 'Please enter your first name.');
        isValid = false;
    }

    const email = document.getElementById('email').value.trim();
    if (!email || !email.includes('@') || !email.includes('.')) {
        showFieldError('email', 'Please enter a valid email address.');
        isValid = false;
    }

    if (!document.getElementById('agree').checked) {
        showFieldError('agree', 'Please consent to the processing of personal data.');
        isValid = false;
    }

    return isValid;
}

document.querySelector('.btn-subscribe').addEventListener('click', () => {
    if (!validateForm()) return;
    const name  = document.getElementById('firstName').value.trim();
    const email = document.getElementById('email').value.trim();
    showModal(`Form submitted successfully!<br>${name}, ${email}`);
});

const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

function openSidebar() {
    sidebar.classList.add('sidebar--open');
    sidebarOverlay.classList.add('sidebar__overlay--visible');
}

function closeSidebar() {
    sidebar.classList.remove('sidebar--open');
    sidebarOverlay.classList.remove('sidebar__overlay--visible');
}

document.getElementById('burger').addEventListener('click', openSidebar);
document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

document.querySelectorAll('.sidebar__link').forEach(link => {
    link.addEventListener('click', () => {
        const tabId = link.dataset.tab;
        tabButtons.forEach(b => {
            b.classList.remove('tab--active');
            b.setAttribute('aria-selected', 'false');
        });
        const activeTab = document.getElementById(tabId);
        activeTab.classList.add('tab--active');
        activeTab.setAttribute('aria-selected', 'true');
        tabMap[tabId]();
        closeSidebar();
    });
});

showClients();