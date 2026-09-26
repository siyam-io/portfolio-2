/**
 * form.js — Contact form submission via Formspree
 * Esthyak Ahmmed Siyam Portfolio
 */

export function initForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const feedback = document.getElementById('form-feedback');
    const submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!feedback || !submitBtn) return;

        // Loading state
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;
        feedback.className = 'form-feedback';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    Accept: 'application/json'
                },
            });

            if (response.ok) {
                feedback.textContent = '✓ Message sent. I\'ll get back to you shortly.';
                feedback.classList.add('success');
                form.reset();
            } else {
                const data = await response.json().catch(() => ({}));
                const msg = data ?.errors ?.map(e => e.message).join(', ') || 'Something went wrong. Please try again or email me directly.';
                feedback.textContent = msg;
                feedback.classList.add('error');
            }
        } catch {
            feedback.textContent = 'Network error. Please check your connection or email me directly at ssiyam563@gmail.com';
            feedback.classList.add('error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            feedback.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    });
}
