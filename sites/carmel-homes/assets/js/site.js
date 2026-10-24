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

  function drawStrokes(paths, opts) {
    paths.forEach(function (p) {
      var len;
      try { len = p.getTotalLength(); } catch (err) { len = 0; }
      if (!len) return;
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });
    return gsap.to(paths, Object.assign({
      strokeDashoffset: 0,
      duration: 1.4,
      ease: 'power2.inOut',
      stagger: 0.012
    }, opts || {}));
  }

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

  var heroDrawing = document.querySelector('[data-drawing]');
  if (heroDrawing && !REDUCED) {
    var heroPaths = Array.prototype.slice.call(heroDrawing.querySelectorAll('path'));
    gsap.set(heroDrawing, { opacity: 0 });
    gsap.to(heroDrawing, { opacity: 0.85, duration: 0.6, delay: 0.1 });
    drawStrokes(heroPaths, { duration: 1.9, stagger: 0.018, delay: 0.2 });

    // The elevation drifts down a little as the hero leaves, so the drawing
    // reads as a layer behind the page rather than a flat background image.
    gsap.to(heroDrawing, {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
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

  /* ---------------- scrubbed walkthrough ----------------
   * If a frame sequence has been produced from Jamie's own walkthrough
   * footage (tools/build-frames.sh writes assets/frames/), the canvas plays
   * it back against scroll position. Until then the floor plan draws itself
   * across the same scroll distance, so the section works either way. */

  var scrubSection = document.querySelector('[data-scrub]');

  if (scrubSection) {
    var canvas = scrubSection.querySelector('[data-scrub-canvas]');
    var fallback = scrubSection.querySelector('[data-scrub-fallback]');
    var phases = Array.prototype.slice.call(scrubSection.querySelectorAll('[data-phase]'));
    var ticks = Array.prototype.slice.call(scrubSection.querySelectorAll('[data-tick]'));

    function setPhase(progress) {
      var count = phases.length;
      var index = Math.min(count - 1, Math.floor(progress * count));

      phases.forEach(function (p, i) {
        var live = i === index;
        if (p.classList.contains('is-live') !== live) {
          p.classList.toggle('is-live', live);
          if (!REDUCED) {
            gsap.fromTo(p,
              { opacity: live ? 0 : 1, y: live ? 14 : 0 },
              { opacity: live ? 1 : 0, y: live ? 0 : -10, duration: 0.45, ease: 'power2.out' }
            );
          }
        }
      });

      ticks.forEach(function (t, i) {
        var local = progress * count - i;
        gsap.set(t, { scaleX: Math.max(0, Math.min(1, local)) });
      });
    }

    // Whatever is driving the visuals for this section. Swapped in place when
    // the frame sequence arrives, so the ScrollTrigger below never has to be
    // rebuilt — rebuilding it late would shift every pin further down the page.
    var painter = null;

    function buildScrub() {
      ScrollTrigger.create({
        trigger: scrubSection,
        start: 'top top',
        end: '+=' + (window.innerHeight * 3.2),
        pin: '.scrub__stage',
        scrub: REDUCED ? false : 0.6,
        refreshPriority: 2,
        onUpdate: function (self) {
          setPhase(self.progress);
          if (painter) painter(self.progress);
        }
      });
    }

    function framePainter(manifest) {
      canvas.hidden = false;
      if (fallback) fallback.style.display = 'none';

      var ctx = canvas.getContext('2d');
      var images = [];
      var current = 0;

      function size() {
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.floor(canvas.clientWidth * dpr);
        canvas.height = Math.floor(canvas.clientHeight * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      function paint(i) {
        var img = images[i];
        if (!img || !img.complete || !img.naturalWidth) return;
        var cw = canvas.clientWidth;
        var ch = canvas.clientHeight;
        // cover fit
        var scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
        var dw = img.naturalWidth * scale;
        var dh = img.naturalHeight * scale;
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      }

      manifest.frames.forEach(function (src, i) {
        var img = new Image();
        img.decoding = 'async';
        img.src = 'assets/frames/' + src;
        img.onload = function () {
          if (i === 0) { size(); paint(0); }
        };
        images[i] = img;
      });

      window.addEventListener('resize', function () {
        size();
        paint(current);
      });

      size();

      return function (progress) {
        var i = Math.min(images.length - 1, Math.round(progress * (images.length - 1)));
        if (i !== current) { current = i; paint(i); }
      };
    }

    // The drawing gains detail as the phases advance, the way a real document
    // set goes from schematic to permit to structural to interiors. Each
    // phase owns one layer of the plan.
    function planPainter() {
      var plan = scrubSection.querySelector('[data-plan]');
      if (!plan || REDUCED) return null;

      var layers = ['walls', 'dims', 'structure', 'interior'].map(function (name) {
        return plan.querySelector('[data-layer="' + name + '"]');
      }).filter(Boolean);

      if (!layers.length) return null;

      var tl = gsap.timeline({ paused: true });
      var slot = 1 / layers.length;

      layers.forEach(function (layer, i) {
        var strokes = Array.prototype.slice.call(layer.querySelectorAll('path'));
        var shapes = Array.prototype.slice.call(
          layer.querySelectorAll('rect, circle, ellipse, text')
        );

        strokes.forEach(function (node) {
          var len;
          try { len = node.getTotalLength(); } catch (err) { len = 0; }
          if (!len) return;
          gsap.set(node, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.set(shapes, { opacity: 0 });

        var at = i * slot;

        if (strokes.length) {
          tl.to(strokes, {
            strokeDashoffset: 0,
            ease: 'none',
            duration: slot * 0.78,
            stagger: { each: slot * 0.16 / Math.max(1, strokes.length) }
          }, at);
        }
        if (shapes.length) {
          tl.to(shapes, {
            opacity: 1,
            ease: 'none',
            duration: slot * 0.5,
            stagger: { each: slot * 0.2 / Math.max(1, shapes.length) }
          }, at + slot * 0.2);
        }
      });

      return function (progress) {
        tl.progress(Math.min(1, Math.max(0, progress)));
      };
    }

    // Build the trigger now, synchronously, so later pins measure against a
    // page whose height has stopped changing.
    painter = planPainter();
    buildScrub();

    // Frames are optional: an empty manifest just means we have not cut
    // Jamie's footage yet, and the floor plan keeps the section working.
    fetch('assets/frames/manifest.json', { cache: 'no-store' })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (manifest) {
        if (!manifest || !manifest.frames || manifest.frames.length < 2 || !canvas) return;
        painter = framePainter(manifest);
        ScrollTrigger.refresh();
      })
      .catch(function () { /* keep the plan */ });
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

      var data = {
        name: form.name.value.trim(),
        phone: form.phone.value.trim(),
        email: form.email.value.trim(),
        type: form.type.value,
        message: form.message.value.trim(),
        page: location.pathname
      };

      if (!data.name || !data.phone) {
        say('Add a name and a phone number so Jamie can call you back.', 'bad');
        return;
      }

      if (button) { button.disabled = true; button.textContent = 'Sending'; }
      say('Sending');

      fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          return res.json().then(function (body) {
            return { ok: res.ok, body: body };
          });
        })
        .then(function (result) {
          if (!result.ok) throw new Error(result.body && result.body.error || 'failed');
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
