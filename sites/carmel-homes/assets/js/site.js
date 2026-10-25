/* Carmel Homes preview — motion and behaviour.
 * Lenis drives the scroll, GSAP drives everything tied to it.
 * Every effect here degrades to a readable static page if JS or motion is off. */
(function () {
  'use strict';

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var SplitText = window.SplitText;

  gsap.registerPlugin(ScrollTrigger, SplitText);

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.body.classList.add('is-ready');

  /* ---------------- Lenis ---------------- */

  var lenis = null;
  if (!REDUCED) {
    lenis = new window.Lenis({
      duration: 1.05,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      touchMultiplier: 1.6
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // Anchor links go through Lenis so the smooth scroll stays in one system.
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (!id || id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -66 });
      });
    });
  }

  /* ---------------- hero ---------------- */

  var heroTitle = document.querySelector('[data-split]');
  if (heroTitle) {
    if (REDUCED) {
      gsap.set(heroTitle, { opacity: 1 });
    } else {
      var split = SplitText.create
        ? SplitText.create(heroTitle, { type: 'lines,words', mask: 'lines', wordsClass: 'word' })
        : new SplitText(heroTitle, { type: 'lines,words', wordsClass: 'word' });

      gsap.from(split.words, {
        yPercent: 112,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.055,
        delay: 0.12
      });
    }
  }

  /* The hero now leads with type on a Swiss grid rather than an arched
   * image, so the old arch-reveal and parallax are gone with it. What is
   * left is the headline split, plus a slow drift on the full-bleed
   * photograph underneath it — enough to give the page depth without
   * anything sliding about. */

  var heroShot = document.querySelector('.hero__shot img');
  if (heroShot && !REDUCED) {
    gsap.fromTo(heroShot,
      { scale: 1.08, yPercent: -2 },
      {
        scale: 1, yPercent: 2, ease: 'none',
        scrollTrigger: {
          trigger: '.hero__shot', start: 'top bottom', end: 'bottom top', scrub: 0.6,
        },
      });
  }

  /* ---------------- generic reveals ---------------- */

  if (!REDUCED) {
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 22 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        }
      );
    });
  }


  /* ---------------- React Bits ---------------- */

  if (window.ReactBits) {
    document.querySelectorAll('[data-countup]').forEach(function (node) {
      window.ReactBits.mount(node, window.ReactBits.CountUp, {
        to: Number(node.dataset.to),
        from: Number(node.dataset.from || 0),
        duration: Number(node.dataset.duration || 2),
        decimals: node.dataset.decimals == null ? undefined : Number(node.dataset.decimals),
        separator: node.dataset.separator == null ? ',' : node.dataset.separator,
        prefix: node.dataset.prefix || '',
        suffix: node.dataset.suffix || '',
        easing: 'expo',
        trigger: 'view'
      });
    });

    // The drafting grid sits behind Jamie's section only, and only where there
    // is a pointer to push it around with.
    var grid = document.querySelector('[data-dotgrid]');
    if (grid && window.matchMedia('(min-width: 900px) and (pointer: fine)').matches) {
      window.ReactBits.mount(grid, window.ReactBits.DotGrid, {
        baseColor: '#2a2519',
        activeColor: '#c0652f',
        dotSize: 3,
        gap: 26,
        proximity: 150,
        strength: 1.1,
        bounce: 0.55,
        tension: 0.45,
        returnDuration: 0.9,
        swell: 0.9,
        glow: 0.45,
        fade: 0.55,
        opacity: 0.85,
        shape: 'square'
      });
    }
  }

  /* ---------------- lead form ---------------- */

  var form = document.querySelector('[data-form]');
  var note = document.querySelector('[data-form-note]');

  if (form) {
    var button = form.querySelector('button[type="submit"]');
    var defaultLabel = button ? button.textContent : '';

    function say(message, tone) {
      if (!note) return;
      note.textContent = message;
      note.style.color = tone === 'bad' ? '#d9704a'
        : tone === 'good' ? '#7faa6d'
        : '';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      function field(key) {
        var el = form.elements[key];
        return el ? String(el.value).trim() : '';
      }

      // The honeypot is off-screen and label-less, so a person never fills
      // it. A bot that does gets the same reply a person gets and nothing
      // is sent anywhere.
      if (field('company')) {
        form.reset();
        say('Got it. Jamie will call you back.', 'good');
        if (button) button.textContent = 'Sent';
        return;
      }

      var data = {
        name: field('name'),
        phone: field('phone'),
        email: field('email'),
        type: field('type'),
        stage: field('stage'),
        timing: field('timing'),
        budget: field('budget'),
        message: field('message'),
        page: location.pathname
      };

      if (!data.name || !data.phone) {
        say('Add a name and a phone number so Jamie can call you back.', 'bad');
        return;
      }

      if (button) { button.disabled = true; button.textContent = 'Sending'; }
      say('Sending');

      // Two ways out, tried in order.
      //
      // 1. POST JSON to /api/lead — server/server.py, which validates the
      //    lead, appends it to leads.jsonl and notifies Jamie. That is what
      //    runs locally and on any host where we control the backend.
      // 2. POST the same fields urlencoded back to this page, carrying
      //    form-name — which is how Netlify captures a submission with no
      //    backend at all, from the data-netlify attributes on the form.
      //
      // On a static host with neither, both fail and the caller is given the
      // phone number. That is the honest outcome: nothing was captured, and
      // saying otherwise would lose Jamie the job.

      function viaApi() {
        return fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).then(function (res) {
          if (res.status === 404 || res.status === 405 || res.status === 501) {
            var gone = new Error('no lead endpoint here');
            gone.tryNetlify = true;
            throw gone;
          }
          return res.json().then(function (body) {
            if (!res.ok) throw new Error((body && body.error) || 'failed');
          });
        });
      }

      function viaNetlify() {
        var body = new URLSearchParams();
        body.set('form-name', form.getAttribute('name') || 'lead');
        Object.keys(data).forEach(function (k) { body.set(k, data[k]); });
        return fetch(location.pathname, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: body.toString()
        }).then(function (res) {
          if (!res.ok) throw new Error('failed');
        });
      }

      viaApi()
        .catch(function (err) {
          if (err && err.tryNetlify) return viaNetlify();
          throw err;
        })
        .then(function () {
          form.reset();
          say('Got it. Jamie has been notified and will call you back on ' + data.phone + '.', 'good');
          if (button) button.textContent = 'Sent';
        })
        .catch(function () {
          say('That did not send. Call 602-348-2430 and Jamie will pick up during office hours.', 'bad');
          if (button) { button.disabled = false; button.textContent = defaultLabel; }
        });
    });
  }

  /* ---------------- keep ScrollTrigger honest ---------------- */

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
