/**
 * Editorial Modern Interactive Effects & Fluid Cursor
 * Designed for Literasi Digital - Muhammad Nabil Al Ma'ruf
 */
(function() {
	'use strict';

	// Check if device supports fine hover (desktop/mouse)
	const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

	// 1. FLUID CUSTOM CURSOR
	function initCustomCursor() {
		if (isTouchDevice) return;

		// Create cursor elements
		const dot = document.createElement('div');
		dot.className = 'editorial-cursor-dot cursor-hidden';

		const ring = document.createElement('div');
		ring.className = 'editorial-cursor-ring cursor-hidden';

		document.body.appendChild(dot);
		document.body.appendChild(ring);

		let mouseX = -100;
		let mouseY = -100;
		let ringX = -100;
		let ringY = -100;
		let isVisible = false;

		// Track mouse move
		window.addEventListener('mousemove', (e) => {
			mouseX = e.clientX;
			mouseY = e.clientY;

			if (!isVisible) {
				isVisible = true;
				ringX = mouseX;
				ringY = mouseY;
				dot.classList.remove('cursor-hidden');
				ring.classList.remove('cursor-hidden');
			}

			// Dot follows immediately with translate3d
			dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
		}, { passive: true });

		// Smooth lerp loop for the trailing ring (buttery smooth 60fps+)
		function renderLoop() {
			if (isVisible) {
				ringX += (mouseX - ringX) * 0.18;
				ringY += (mouseY - ringY) * 0.18;
				ring.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) translate(-50%, -50%)`;
			}
			requestAnimationFrame(renderLoop);
		}
		requestAnimationFrame(renderLoop);

		// Hide on mouseleave window
		document.addEventListener('mouseleave', () => {
			isVisible = false;
			dot.classList.add('cursor-hidden');
			ring.classList.add('cursor-hidden');
		});

		// Re-center and show on mouseenter window
		document.addEventListener('mouseenter', (e) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
			ringX = mouseX;
			ringY = mouseY;
			isVisible = true;
			dot.classList.remove('cursor-hidden');
			ring.classList.remove('cursor-hidden');
		});

		// Hover interactions over clickable / interactive elements
		const interactiveSelector = 'a, button, input, textarea, select, .editorial-pill-btn, .editorial-dynamic-card, .editorial-catalog-card, .editorial-pillar-card, .editorial-feature-row, .wp-block-post-template > li, [role="button"]';

		document.addEventListener('mouseover', (e) => {
			const target = e.target.closest(interactiveSelector);
			if (target) {
				dot.classList.add('cursor-hover');
				ring.classList.add('cursor-hover');
			}
		});

		document.addEventListener('mouseout', (e) => {
			const target = e.target.closest(interactiveSelector);
			if (target) {
				dot.classList.remove('cursor-hover');
				ring.classList.remove('cursor-hover');
			}
		});

		// Mechanical click feedback
		window.addEventListener('mousedown', () => {
			ring.classList.add('cursor-active');
			dot.classList.add('cursor-active');
		});

		window.addEventListener('mouseup', () => {
			ring.classList.remove('cursor-active');
			dot.classList.remove('cursor-active');
		});
	}

	// 2. SMOOTH SCROLL REVEAL ANIMATIONS
	function initScrollReveal() {
		const targetElements = document.querySelectorAll(`
			.editorial-pillar-card,
			.editorial-feature-row,
			.editorial-author-quote-wrap,
			.editorial-newsletter-box,
			.wp-block-post-template > li,
			.editorial-about-profile-card,
			.editorial-story-card,
			.editorial-contact-sidebar,
			.editorial-contact-form-box
		`);

		if (!('IntersectionObserver' in window)) {
			targetElements.forEach(el => el.classList.add('is-revealed'));
			return;
		}

		const observer = new IntersectionObserver((entries, obs) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-revealed');
					obs.unobserve(entry.target);
				}
			});
		}, {
			root: null,
			threshold: 0.05,
			rootMargin: '100px 0px 100px 0px'
		});

		targetElements.forEach((el, index) => {
			el.classList.add('editorial-reveal');
			const siblingIndex = index % 3;
			el.style.setProperty('--stagger-delay', `${siblingIndex * 0.1}s`);
			observer.observe(el);
		});
	}

	// Initialize on DOMContentLoaded
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', () => {
			initCustomCursor();
			initScrollReveal();
		});
	} else {
		initCustomCursor();
		initScrollReveal();
	}
})();
