import { tabMap } from './tabs.js';

export function initSidebar() {
    const sidebar        = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const tabButtons     = document.querySelectorAll('.tab');

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
}