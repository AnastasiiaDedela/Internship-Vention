import { initModal } from './modal.js';
import { initTabs } from './tabs.js';
import { initSidebar } from './sidebar.js';
import { initForm } from './form.js';
import { showClients } from './cards.js';

document.getElementById('year').textContent = new Date().getFullYear();

initModal();
initTabs();
initSidebar();
initForm();

showClients();
