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

  /* The hero arrives as one piece: the arch unmasks from the floor while the
   * photograph inside it settles out of a slight zoom, then the side column
   * and the thumbnail strip follow the headline in. Those elements carry
   * data-hero rather than data-reveal so the scroll reveals below do not also
   * claim them and fire a second, competing tween. */

  var arch = document.querySelector('.arch');
  var archImg = arch && arch.querySelector('img');

  if (arch && !REDUCED) {
    var intro = gsap.timeline({ delay: 0.1 });

    intro.fromTo(arch,
      { clipPath: 'inset(100% 0% 0% 0%)', opacity: 1 },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'power3.inOut' }, 0);

    if (archImg) {
      intro.from(archImg, { scale: 1.2, duration: 1.7, ease: 'power3.out' }, 0);
    }

    intro.from('.hero__side > [data-hero]',
      { y: 26, opacity: 0, duration: 0.8, ease: 'power2.out', stagger: 0.14 }, 0.45);

    intro.from('.thumbs img',
      { scale: 0.3, opacity: 0, duration: 0.55, ease: 'back.out(2.2)', stagger: 0.06 }, 0.6);

    intro.from('.thumbs .mark', { opacity: 0, x: -10, duration: 0.5 }, 0.85);

    // Two speeds across the hero: the photograph creeps up inside its fixed
    // mask, the side column leaves a little faster than the page. Small
    // numbers on purpose — this should read as depth, not as a slide.
    gsap.to(archImg || arch, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    gsap.to('.hero__side', {
      y: -52,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  gsap.utils.toArray('[data-hero]').forEach(function (el) {
    if (el.closest('.hero__side') || el.classList.contains('thumbs') || el.classList.contains('arch')) return;
    if (REDUCED) { gsap.set(el, { opacity: 1 }); return; }
    gsap.from(el, { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out', delay: 0.35 });
  });

  /* The archive strip drifts sideways as it crosses the viewport. The photo
   * set is printed twice in the markup, so moving the track by a quarter of
   * its width never exposes an end. */

  var band = document.querySelector('[data-band]');
  if (band && !REDUCED) {
    gsap.fromTo(band,
      { xPercent: -4 },
      {
        xPercent: -26,
        ease: 'none',
        scrollTrigger: {
          trigger: '.band',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6
        }
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


  /* ---------------- work, horizontal on desktop ---------------- */

  var viewport = document.querySelector('[data-work-viewport]');
  var track = document.querySelector('[data-work-track]');
  var workHint = document.querySelector('[data-work-hint]');

  if (viewport && track && !REDUCED) {
    var mm = gsap.matchMedia();

    mm.add('(min-width: 900px)', function () {
      var distance = function () { return track.scrollWidth - viewport.clientWidth; };

      var tween = gsap.to(track, {
        x: function () { return -distance(); },
        ease: 'none',
        scrollTrigger: {
          trigger: '.work',
          start: 'top top',
          end: function () { return '+=' + Math.max(1, distance()); },
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          refreshPriority: 1
        }
      });

      return function () {
        tween.scrollTrigger && tween.scrollTrigger.kill();
        tween.kill();
        gsap.set(track, { clearProps: 'x' });
      };
    });

    mm.add('(max-width: 899px)', function () {
      if (workHint) workHint.textContent = 'Nine projects, from Arcadia to Mountain Shadows';
    });
  }

  /* ---------------- one house, scrubbed through ----------------
   * Twelve photographs from Carmel's own Classic Contemporary archive, in the
   * photographer's shoot order, cross-dissolved against scroll so you walk
   * through the house. Hard cuts between rooms would strobe, hence the blend.
   * Phones keep the single static frame already in the HTML: the other eleven
   * images are never fetched there. */

  var tourSection = document.querySelector('[data-tour]');

  if (tourSection && !REDUCED && window.matchMedia('(min-width: 900px)').matches) {
    var tourFrames = tourSection.querySelector('[data-tour-frames]');
    var tourCaption = tourSection.querySelector('[data-tour-caption]');
    var tourCounter = tourSection.querySelector('[data-tour-counter]');

    // Built now, not in the fetch callback: a pin created after the page has
    // settled makes every pin below it measure against a stale height.
    var tourPainter = null;

    ScrollTrigger.create({
      trigger: tourSection,
      start: 'top top',
      end: '+=' + (window.innerHeight * 3.4),
      pin: '.tour__stage',
      scrub: 0.5,
      refreshPriority: 0,
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        if (tourPainter) tourPainter(self.progress);
      }
    });

    fetch('assets/tour/manifest.json', { cache: 'no-store' })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (manifest) {
        if (!manifest || !manifest.frames || manifest.frames.length < 2) return;

        var frames = manifest.frames;
        var images = [tourFrames.querySelector('img')];

        // frame 0 is already in the markup; add the rest
        frames.slice(1).forEach(function (frame) {
          var img = new Image();
          img.src = 'assets/tour/' + frame.file;
          img.alt = '';
          img.width = 1440;
          img.height = 810;
          img.decoding = 'async';
          tourFrames.appendChild(img);
          images.push(img);
        });

        var last = -1;

        // Each room holds for most of its slot and dissolves over the last
        // quarter. An even blend across the whole slot leaves two rooms at
        // half opacity for most of the scroll, which reads as a double
        // exposure rather than a walk through the house.
        var HOLD = 0.75;

        tourPainter = function (progress) {
          var pos = progress * (frames.length - 1);
          var index = Math.floor(pos);
          var raw = pos - index;
          var blend = raw <= HOLD ? 0 : (raw - HOLD) / (1 - HOLD);

          for (var i = 0; i < images.length; i++) {
            var opacity = 0;
            if (i === index) opacity = 1;
            else if (i === index + 1) opacity = blend;
            gsap.set(images[i], { opacity: opacity });
          }

          // the caption flips with the image, not with the raw position
          var shown = blend > 0.5 ? Math.min(frames.length - 1, index + 1) : index;
          if (shown !== last) {
            last = shown;
            tourCaption.textContent = frames[shown].caption;
            tourCounter.textContent = 'Room ' + (shown + 1) + ' of ' + frames.length
              + ', from 183 photographs';
          }
        };

        tourPainter(0);
        ScrollTrigger.refresh();
      })
      .catch(function () { /* the single static frame is a fine fallback */ });
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
