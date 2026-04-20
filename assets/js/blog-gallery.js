// blog-gallery.js
// Place at: assets/js/blog-gallery.js

(function () {
  'use strict';

  const pins = document.querySelectorAll('.pg-pin');
  if (!pins.length) return;

  // ── SCROLL REVEAL ────────────────────────────────────────
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
    );
    pins.forEach((p) => io.observe(p));
  } else {
    pins.forEach((p) => p.classList.add('is-visible'));
  }

  // ── MOBILE TAP TOGGLE ────────────────────────────────────
  // On touch devices, first tap shows overlay; second tap follows the link.
  const isTouchDevice = () =>
    window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  if (isTouchDevice()) {
    pins.forEach((pin) => {
      pin.addEventListener('click', (e) => {
        if (!pin.classList.contains('tapped')) {
          e.preventDefault();           // block navigation on first tap
          // Close any other open pin
          pins.forEach((p) => { if (p !== pin) p.classList.remove('tapped'); });
          pin.classList.add('tapped');
        }
        // Second tap — let the <a> navigate naturally
      });
    });

    // Tap outside to close
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.pg-pin')) {
        pins.forEach((p) => p.classList.remove('tapped'));
      }
    });
  }
})();
