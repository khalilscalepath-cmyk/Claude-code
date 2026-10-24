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
        end: '+=' + (window.innerHeight * 4),
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

    /* ---- the house, built and turned by scroll ----
     * A wireframe model projected to SVG and re-rendered as the view moves.
     * No 3D library: an axonometric projection is a few lines of trigonometry,
     * and keeping it as SVG strokes means the building stays in the same
     * drawing language as the plan it grows out of.
     *
     * At 90 degrees of elevation the projection flattens to a true plan view,
     * which is why the drawing can lift off the page into a building instead
     * of cutting to a different graphic. */

    var MODEL = (function () {
      function box(x0, x1, y0, y1, z0, z1) {
        var c = [
          [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0],
          [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]
        ];
        return {
          base: [[c[0], c[1]], [c[1], c[2]], [c[2], c[3]], [c[3], c[0]]],
          posts: [[c[0], c[4]], [c[1], c[5]], [c[2], c[6]], [c[3], c[7]]],
          top: [[c[4], c[5]], [c[5], c[6]], [c[6], c[7]], [c[7], c[4]]]
        };
      }
      function panel(x0, x1, z0, z1, y) {
        return [
          [[x0, y, z0], [x1, y, z0]], [[x1, y, z0], [x1, y, z1]],
          [[x1, y, z1], [x0, y, z1]], [[x0, y, z1], [x0, y, z0]]
        ];
      }

      /* The model must land exactly on the hand-drawn plan, or plan view shows
         two drawings that disagree. The drawn sheet runs x 160..1040 and
         y 140..600 in viewBox units, so at scale 20 centred on (600, 370) one
         model unit is 20 units of the sheet and every partition below maps
         onto a wall that is already drawn:
             x 18 -> 520    x 31 -> 780    y 8 -> 300    y 14 -> 420          */
      var A = box(0, 31, 0, 23, 0, 11);   // main house
      var B = box(31, 44, 0, 23, 0, 8);   // lower wing, sharing the x=31 wall

      var partitions = [
        [[18, 0, 0], [18, 14, 0]],
        [[0, 14, 0], [18, 14, 0]],
        [[18, 8, 0], [31, 8, 0]]
      ];

      var rooms = [];
      partitions.forEach(function (e) {
        var a = e[0], b = e[1], h = 11;
        rooms.push([[a[0], a[1], h], [b[0], b[1], h]]);
        rooms.push([[a[0], a[1], 0], [a[0], a[1], h]]);
        rooms.push([[b[0], b[1], 0], [b[0], b[1], h]]);
      });

      function plane(x0, x1, y0, y1, z) {
        return [
          [[x0, y0, z], [x1, y0, z]], [[x1, y0, z], [x1, y1, z]],
          [[x1, y1, z], [x0, y1, z]], [[x0, y1, z], [x0, y0, z]]
        ];
      }

      var CLEAR = box(7, 24, 6, 17, 11, 14);
      var roof = plane(-2, 33, -2, 25, 11.6)
        .concat(plane(30, 46, -1, 24, 8.6), CLEAR.posts, CLEAR.top, [
          [[-2, -2, 11.6], [0, 0, 11]], [[33, -2, 11.6], [31, 0, 11]],
          [[33, 25, 11.6], [31, 23, 11]], [[-2, 25, 11.6], [0, 23, 11]]
        ]);

      // high y projects toward the viewer, so glazing goes on those faces
      var glazing = panel(2, 11, 2, 8, 23)
        .concat(panel(14, 28, 2, 8, 23), panel(33, 42, 2, 6, 23));

      return {
        slab: A.base.concat(B.base),
        walls: partitions,
        frame: A.posts.concat(B.posts, A.top, B.top),
        rooms: rooms,
        roof: roof,
        glass: glazing
      };
    })();

    function renderModel(group, ang, el, scale, cx, cy) {
      var ca = Math.cos(ang), sa = Math.sin(ang);
      var se = Math.sin(el), ce = Math.cos(el);
      var ox = 22, oy = 11.5; // turn on the footprint's own centre

      function pt(q) {
        var px = q[0] - ox, py = q[1] - oy;
        var x = px * ca - py * sa;
        var y = px * sa + py * ca;
        return (cx + x * scale).toFixed(1) + ' ' + (cy + (y * se - q[2] * ce) * scale).toFixed(1);
      }

      Object.keys(MODEL).forEach(function (part) {
        var node = group.querySelector('[data-part="' + part + '"]');
        if (!node) return;
        var edges = MODEL[part], d = '';
        for (var i = 0; i < edges.length; i++) {
          d += 'M' + pt(edges[i][0]) + 'L' + pt(edges[i][1]);
        }
        node.setAttribute('d', d);
      });
    }

    function planPainter() {
      var plan = scrubSection.querySelector('[data-plan]');
      if (!plan || REDUCED) return null;

      var model = plan.querySelector('[data-model]');
      if (!model) return null;

      var finish = scrubSection.querySelector('[data-scrub-finish]');
      var veil = scrubSection.querySelector('.scrub__veil');

      var parts = {};
      ['slab', 'walls', 'frame', 'rooms', 'roof', 'glass'].forEach(function (k) {
        parts[k] = model.querySelector('[data-part="' + k + '"]');
      });

      var annotations = ['planmarks', 'dims', 'structure', 'titleblock'].map(function (n) {
        return plan.querySelector('[data-layer="' + n + '"]');
      }).filter(Boolean);

      var dashed = [];
      annotations.forEach(function (layer) {
        Array.prototype.forEach.call(layer.querySelectorAll('path'), function (node) {
          var len;
          try { len = node.getTotalLength(); } catch (err) { len = 0; }
          if (!len) return;
          gsap.set(node, { strokeDasharray: len, strokeDashoffset: len });
          dashed.push({ node: node, len: len, layer: layer });
        });
      });

      var RAD = Math.PI / 180;
      function seg(v, a, b) { return b <= a ? (v >= b ? 1 : 0) : Math.max(0, Math.min(1, (v - a) / (b - a))); }
      function ease(t) { return t * t * (3 - 2 * t); }

      return function (progress) {
        var p = Math.min(1, Math.max(0, progress));

        // 01-02 look straight down at the drawing, held still so the plan
        // stays readable. From 03 onward it is one slow continuous sweep —
        // the building keeps turning at a constant rate and each stage of
        // the build arrives during the turn rather than between turns.
        // The sweep must START at zero. Any other starting angle means the
        // footprint is skewed while we are still looking straight down at it,
        // so the slab renders as diamonds across axis-aligned room labels and
        // dimension strings — which is what it did.
        var lift = ease(seg(p, 0.38, 0.58));
        var spin = seg(p, 0.38, 0.96);
        var el = (90 - 52 * lift) * RAD;
        var ang = 84 * spin * RAD;

        // on a phone the drawing sits in a shorter box, so it does not need
        // to climb as far to clear the phase copy
        var narrow = window.innerWidth < 760;
        renderModel(model, ang, el,
          20 - 5 * lift,
          600,
          (narrow ? 395 : 370) - (narrow ? 40 : 80) * lift);

        gsap.set(parts.slab, { opacity: seg(p, 0.02, 0.16) });
        gsap.set(parts.walls, { opacity: seg(p, 0.06, 0.20) });
        gsap.set(parts.frame, { opacity: seg(p, 0.40, 0.54) });
        gsap.set(parts.roof, { opacity: seg(p, 0.54, 0.66) });
        gsap.set(parts.rooms, { opacity: seg(p, 0.64, 0.74) });
        gsap.set(parts.glass, { opacity: seg(p, 0.72, 0.82) });

        var gone = 1 - seg(p, 0.28, 0.37);
        var shown = {
          planmarks: Math.min(seg(p, 0.02, 0.14), gone),
          dims: Math.min(seg(p, 0.14, 0.24), gone),
          structure: Math.min(seg(p, 0.20, 0.28), gone),
          titleblock: Math.min(seg(p, 0.05, 0.14), gone)
        };
        annotations.forEach(function (layer) {
          gsap.set(layer, { opacity: shown[layer.dataset.layer] });
        });
        dashed.forEach(function (d) {
          gsap.set(d.node, { strokeDashoffset: d.len * (1 - shown[d.layer.dataset.layer]) });
        });

        // 05: the drawing hands over to the photograph of the finished house.
        // The wireframe clears before the photograph is fully up, so the two
        // are only on screen together briefly — a long double exposure just
        // reads as a washed-out picture behind a drawing.
        var reveal = seg(p, 0.85, 0.95);
        if (finish) gsap.set(finish, { opacity: reveal });
        gsap.set(model, { opacity: 1 - seg(p, 0.80, 0.88) });
        if (veil) gsap.set(veil, { opacity: 1 - reveal });
      };
    }

    // Build the trigger now, synchronously, so later pins measure against a
    // page whose height has stopped changing.
    painter = planPainter();
    if (painter) painter(0);   // draw the sheet at rest, before any scroll
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
