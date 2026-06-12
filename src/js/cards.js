import { API } from './api.js';
import { normalizeClients, normalizeProducts, normalizeFeedback } from './normalize.js';
import { showModal } from './modal.js';

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

export async function showClients() {
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

export async function showProducts() {
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

export async function showFeedback() {
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