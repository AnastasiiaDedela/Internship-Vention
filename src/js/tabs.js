import { showClients, showProducts, showFeedback } from './cards.js';

export const tabMap = {
    clientsBtn:  showClients,
    productsBtn: showProducts,
    feedbackBtn: showFeedback,
};

export function initTabs() {
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
}