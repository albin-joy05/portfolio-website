(function () {
  'use strict';

  (function initCustomCursor() {
    var cursor = document.getElementById('custom-cursor');
    if (!cursor) return;
    var ring = cursor.querySelector('.cursor-ring');
    var dot = cursor.querySelector('.cursor-dot');
    if (!ring || !dot) return;

    var mouseX = 0;
    var mouseY = 0;
    var cursorX = 0;
    var cursorY = 0;
    var useCustomCursor = window.matchMedia('(pointer: fine)').matches;

    if (!useCustomCursor) return;

    document.body.classList.add('custom-cursor-active');

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function tick() {
      cursorX = lerp(cursorX, mouseX, 0.18);
      cursorY = lerp(cursorY, mouseY, 0.18);
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    var hoverSelectors = 'a, button, .btn, input, textarea, [role="button"]';
    document.addEventListener('mouseover', function (e) {
      cursor.classList.toggle('hover', e.target.closest(hoverSelectors));
    });
    document.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget) { cursor.classList.remove('hover'); return; }
      if (!e.relatedTarget.closest || !e.relatedTarget.closest(hoverSelectors)) cursor.classList.remove('hover');
    });
  })();

  (function initTyping() {
    var typedEl = document.getElementById('typed-text');
    if (!typedEl) return;
    var phrases = ['Software Developer', 'Web Developer', 'Software Engineer', 'Full Stack Developer'];
    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var tick = 80;
    var holdEnd = 1500;
    var holdDelete = 400;

    function step() {
      var phrase = phrases[phraseIndex];
      if (isDeleting) {
        typedEl.textContent = phrase.slice(0, charIndex - 1);
        charIndex--;
        tick = charIndex ? 50 : holdDelete;
      } else {
        typedEl.textContent = phrase.slice(0, charIndex + 1);
        charIndex++;
        tick = charIndex < phrase.length ? 120 : holdEnd;
      }
      if (!isDeleting && charIndex === phrase.length) {
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
      setTimeout(step, tick);
    }
    setTimeout(step, 400);
  })();

  const homeSection = document.getElementById('home');
  const aboutSection = document.getElementById('about');
  const homeImg = document.querySelector('.home-img img');
  const aboutImg = document.querySelector('.about-img img');
  const transitionWrap = document.getElementById('image-transition-wrap');
  const transitionImg = document.getElementById('image-transition-img');

  if (!homeSection || !aboutSection || !homeImg || !aboutImg || !transitionWrap || !transitionImg) return;


  const transitionZoneStart = 0.75;
  const transitionZoneEnd = 0.05;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function updateTransition() {
    const aboutRect = aboutSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const rawProgress = 1 - (aboutRect.top - viewportHeight * transitionZoneEnd) / (viewportHeight * (transitionZoneStart - transitionZoneEnd));
    const progress = Math.max(0, Math.min(1, rawProgress));
    const eased = easeInOutCubic(progress);

    const inZone = progress > 0 && progress < 1;
    transitionWrap.classList.toggle('is-active', inZone);

    if (inZone) {
      const homeRect = homeImg.getBoundingClientRect();
      const aboutImgRect = aboutImg.getBoundingClientRect();

      const homeCenterX = homeRect.left + homeRect.width / 2;
      const homeCenterY = homeRect.top + homeRect.height / 2;
      const aboutCenterX = aboutImgRect.left + aboutImgRect.width / 2;
      const aboutCenterY = aboutImgRect.top + aboutImgRect.height / 2;

      const x = homeCenterX + (aboutCenterX - homeCenterX) * eased;
      const y = homeCenterY + (aboutCenterY - homeCenterY) * eased;

      const scale = 1 + 0.02 * Math.sin(progress * Math.PI);
      transitionImg.style.left = x + 'px';
      transitionImg.style.top = y + 'px';
      transitionImg.style.transform = `translate(-50%, -50%) scale(${scale})`;
      transitionImg.style.opacity = String(Math.sin(progress * Math.PI));
      const homeOpacity = progress <= 0.2 ? 1 : progress >= 0.4 ? 0 : 1 - (progress - 0.2) / 0.2;
      const aboutOpacity = progress <= 0.6 ? 0 : progress >= 0.8 ? 1 : (progress - 0.6) / 0.2;
      homeImg.style.opacity = String(homeOpacity);
      homeImg.style.visibility = homeOpacity > 0 ? 'visible' : 'hidden';
      aboutImg.style.opacity = String(aboutOpacity);
      aboutImg.style.visibility = aboutOpacity > 0 ? 'visible' : 'hidden';
    } else {
      transitionImg.style.opacity = '0';
      transitionImg.style.transform = 'translate(-50%, -50%) scale(1)';
      homeImg.style.opacity = progress < 1 ? '1' : '0';
      homeImg.style.visibility = progress < 1 ? 'visible' : 'hidden';
      aboutImg.style.opacity = progress >= 1 ? '1' : '0';
      aboutImg.style.visibility = progress >= 1 ? 'visible' : 'hidden';
    }
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateTransition();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', updateTransition);
  updateTransition();
  var menuIcon = document.getElementById('menu-icon');
  var navbar = document.querySelector('.navbar');
  var navOverlay = document.getElementById('nav-overlay');
  function closeNav() {
    if (navbar) navbar.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('show');
    if (menuIcon) {
      menuIcon.classList.remove('is-open');
      menuIcon.setAttribute('aria-expanded', 'false');
    }
  }
  if (menuIcon && navbar) {
    menuIcon.addEventListener('click', function () {
      var isOpen = navbar.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('show', isOpen);
      menuIcon.classList.toggle('is-open', isOpen);
      menuIcon.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    document.querySelectorAll('.navbar a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
    if (navOverlay) navOverlay.addEventListener('click', closeNav);
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) closeNav();
    });
  }
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        } else {
          entry.target.classList.remove('revealed');
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }
})();
