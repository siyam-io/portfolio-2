/**
 * main.js — Application entry point
 * Esthyak Ahmmed Siyam Portfolio
 */

import {
    initNav
} from './nav.js';
import {
    initAnimations
} from './animations.js';
import {
    initForm
} from './form.js';

function init() {
    initNav();
    initAnimations();
    initForm();
}

// Run after DOM is parsed (module scripts are deferred by default)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}