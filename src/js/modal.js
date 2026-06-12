export function showModal(message) {
    document.getElementById('modalMessage').innerHTML = message;
    document.getElementById('modal').classList.add('modal--visible');
}

export function closeModal() {
    document.getElementById('modal').classList.remove('modal--visible');
}

export function initModal() {
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modal').addEventListener('click', e => {
        if (e.target === e.currentTarget) closeModal();
    });
}