import { showModal } from './modal.js';

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

export function initForm() {
    document.querySelector('.btn-subscribe').addEventListener('click', () => {
        if (!validateForm()) return;
        const name  = document.getElementById('firstName').value.trim();
        const email = document.getElementById('email').value.trim();
        showModal(`Form submitted successfully!<br>${name}, ${email}`);
    });
}