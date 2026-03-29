/* Arianna Buratti Psychology — Main JS */

(function () {
  'use strict';

  // --- Mobile Navigation ---
  const hamburger = document.getElementById('hamburger');
  const navList = document.getElementById('navList');
  const navOverlay = document.getElementById('navOverlay');

  if (hamburger && navList) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navList.classList.toggle('active');
      if (navOverlay) navOverlay.classList.toggle('active');
      document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navList.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Mobile dropdown toggle
    var dropdowns = document.querySelectorAll('.nav__item--dropdown');
    dropdowns.forEach(function (item) {
      var link = item.querySelector('.nav__link');
      if (link) {
        link.addEventListener('click', function (e) {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            item.classList.toggle('active');
          }
        });
      }
    });
  }

  // --- Sticky Header Shadow ---
  var header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }, { passive: true });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile nav if open
        if (navList && navList.classList.contains('active')) {
          hamburger.classList.remove('active');
          navList.classList.remove('active');
          if (navOverlay) navOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  });

  // --- Contact Form ---
  var form = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  if (form && formSuccess) {
    form.addEventListener('submit', function (e) {
      // If Formspree is not configured (placeholder), prevent submit and show message
      if (form.action.indexOf('PLACEHOLDER') !== -1) {
        e.preventDefault();
        form.style.display = 'none';
        formSuccess.style.display = 'block';
      }
    });
  }

})();
