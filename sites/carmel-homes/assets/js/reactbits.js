/* React Bits components, ported for a build-free page.
 *
 * Source project: React Bits by David Haz (MIT) — https://reactbits.dev
 * Props follow the documented API for CountUp and DotGrid exactly, so the
 * upstream docs still describe these. Two deliberate differences:
 *   - written with React.createElement instead of JSX, so the page needs no bundler;
 *   - animation is driven by GSAP, which is already on this page, rather than
 *     pulling in `motion` as a second animation runtime.
 */
(function (global) {
  'use strict';

  var React = global.React;
  var ReactDOM = global.ReactDOM;
  var gsap = global.gsap;
  var h = React.createElement;

  var reduceMotion = global.matchMedia
    ? global.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* ------------------------------------------------------------------ *
   * CountUp — reactbits.dev/text-animations/count-up
   * ------------------------------------------------------------------ */

  function formatNumber(value, opts) {
    var decimals = opts.decimals;
    var out;

    if (opts.format === 'compact') {
      out = new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: decimals == null ? 1 : decimals
      }).format(value);
      return opts.prefix + out + opts.suffix;
    }

    out = value.toFixed(decimals);

    if (opts.separator) {
      var parts = out.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, opts.separator);
      out = parts.join('.');
    }

    return opts.prefix + out + opts.suffix;
  }

  function decimalsOf(n) {
    var s = String(n);
    var i = s.indexOf('.');
    return i === -1 ? 0 : s.length - i - 1;
  }

  var EASES = {
    easeOut: 'power2.out',
    linear: 'none',
    expo: 'expo.out',
    spring: 'back.out(1.4)'
  };

  function CountUp(props) {
    var to = Number(props.to);
    var from = props.from == null ? 0 : Number(props.from);
    var direction = props.direction || 'up';
    var duration = props.duration == null ? 2 : props.duration;
    var delay = props.delay || 0;
    var trigger = props.trigger || 'view';
    var startWhen = props.startWhen !== false;

    var start = direction === 'down' ? to : from;
    var end = direction === 'down' ? from : to;

    var decimals = props.decimals != null
      ? props.decimals
      : Math.max(decimalsOf(from), decimalsOf(to));

    var fmt = {
      decimals: decimals,
      separator: props.separator || '',
      prefix: props.prefix || '',
      suffix: props.suffix || '',
      format: props.format || 'standard'
    };

    var ref = React.useRef(null);
    var done = React.useRef(false);

    var run = React.useCallback(function () {
      var node = ref.current;
      if (!node || done.current) return;
      done.current = true;

      if (reduceMotion) {
        node.textContent = formatNumber(end, fmt);
        if (props.onStart) props.onStart();
        if (props.onEnd) props.onEnd();
        return;
      }

      var counter = { v: start };
      gsap.to(counter, {
        v: end,
        duration: duration,
        delay: delay,
        ease: EASES[props.easing] || EASES.easeOut,
        onStart: props.onStart,
        onComplete: props.onEnd,
        onUpdate: function () {
          node.textContent = formatNumber(counter.v, fmt);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, end, duration, delay]);

    React.useEffect(function () {
      var node = ref.current;
      if (!node) return;

      node.textContent = formatNumber(start, fmt);

      if (!startWhen) return;

      if (trigger === 'load') {
        run();
        return;
      }

      if (!('IntersectionObserver' in global)) {
        run();
        return;
      }

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            run();
            io.disconnect();
          }
        });
      }, { threshold: 0.4 });

      io.observe(node);
      return function () { io.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [run, startWhen, trigger]);

    var handlers = {};
    if (props.replayOnHover) {
      handlers.onMouseEnter = function () { done.current = false; run(); };
    }

    return h('span', Object.assign({
      ref: ref,
      className: props.className || '',
      style: props.style
    }, handlers));
  }

  /* ------------------------------------------------------------------ *
   * DotGrid — reactbits.dev/backgrounds/dot-grid
   * A springy grid of dots the cursor pushes through. `tension` couples each
   * dot to its neighbours so a push travels across the grid.
   * ------------------------------------------------------------------ */

  function hexToRgb(hex) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(String(hex).trim());
    if (!m) return { r: 255, g: 255, b: 255 };
    return {
      r: parseInt(m[1], 16),
      g: parseInt(m[2], 16),
      b: parseInt(m[3], 16)
    };
  }

  function DotGrid(props) {
    var hostRef = React.useRef(null);
    var canvasRef = React.useRef(null);

    var opts = {
      baseColor: props.baseColor || '#3a3446',
      activeColor: props.activeColor || '#ffffff',
      shape: props.shape || 'circle',
      dotSize: props.dotSize == null ? 5 : props.dotSize,
      gap: props.gap == null ? 18 : props.gap,
      proximity: props.proximity == null ? 140 : props.proximity,
      strength: props.strength == null ? 1 : props.strength,
      bounce: props.bounce == null ? 0.6 : props.bounce,
      tension: props.tension == null ? 0.4 : props.tension,
      returnDuration: props.returnDuration == null ? 0.8 : props.returnDuration,
      shockRadius: props.shockRadius == null ? 320 : props.shockRadius,
      shockStrength: props.shockStrength == null ? 5 : props.shockStrength,
      swell: props.swell == null ? 0.8 : props.swell,
      stretch: props.stretch == null ? 0.5 : props.stretch,
      glow: props.glow == null ? 0.5 : props.glow,
      fade: props.fade == null ? 0 : props.fade,
      opacity: props.opacity == null ? 1 : props.opacity,
      intro: props.intro !== false,
      mouseInteraction: props.mouseInteraction !== false,
      clickShock: props.clickShock !== false,
      paused: !!props.paused,
      dpr: props.dpr
    };

    React.useEffect(function () {
      var host = hostRef.current;
      var canvas = canvasRef.current;
      if (!host || !canvas) return;

      var ctx = canvas.getContext('2d');
      var base = hexToRgb(opts.baseColor);
      var active = hexToRgb(opts.activeColor);

      var dots = [];
      var w = 0, h2 = 0;
      var dpr = Math.min(opts.dpr || global.devicePixelRatio || 1, 2);
      var pointer = { x: -9999, y: -9999, px: -9999, py: -9999, inside: false };
      var born = 0;
      var raf = 0;
      var visible = true;

      function layout() {
        var rect = host.getBoundingClientRect();
        w = Math.max(1, Math.floor(rect.width));
        h2 = Math.max(1, Math.floor(rect.height));

        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h2 * dpr);
        canvas.style.width = w + 'px';
        canvas.style.height = h2 + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        var step = opts.dotSize + opts.gap;
        var cols = Math.max(1, Math.floor((w + opts.gap) / step));
        var rows = Math.max(1, Math.floor((h2 + opts.gap) / step));
        var offX = (w - (cols * step - opts.gap)) / 2 + opts.dotSize / 2;
        var offY = (h2 - (rows * step - opts.gap)) / 2 + opts.dotSize / 2;

        dots = [];
        for (var r = 0; r < rows; r++) {
          for (var c = 0; c < cols; c++) {
            dots.push({
              ox: offX + c * step,
              oy: offY + r * step,
              x: 0, y: 0, vx: 0, vy: 0,
              col: c, row: r
            });
          }
        }
        born = performance.now();
      }

      function push(cx, cy, radius, power) {
        for (var i = 0; i < dots.length; i++) {
          var d = dots[i];
          var dx = d.ox + d.x - cx;
          var dy = d.oy + d.y - cy;
          var dist = Math.hypot(dx, dy);
          if (dist >= radius || dist === 0) continue;
          var falloff = 1 - dist / radius;
          var force = falloff * falloff * power;
          d.vx += (dx / dist) * force;
          d.vy += (dy / dist) * force;
        }
      }

      // Spring constants derived from the documented bounce / returnDuration.
      function frame() {
        raf = requestAnimationFrame(frame);
        if (opts.paused || !visible) return;

        var stiffness = 1 / Math.max(0.05, opts.returnDuration) * 0.55;
        var damping = 1 - Math.min(0.92, opts.bounce) * 0.22 - 0.06;

        // cursor drag
        if (opts.mouseInteraction && pointer.inside) {
          var moveX = pointer.x - pointer.px;
          var moveY = pointer.y - pointer.py;
          var speed = Math.min(40, Math.hypot(moveX, moveY));
          if (speed > 0.4) {
            push(pointer.x, pointer.y, opts.proximity, speed * 0.06 * opts.strength);
          }
          pointer.px = pointer.x;
          pointer.py = pointer.y;
        }

        var i, d;

        // neighbour coupling: a push travels through the grid
        if (opts.tension > 0) {
          for (i = 0; i < dots.length; i++) {
            d = dots[i];
            var left = dots[i - 1];
            var right = dots[i + 1];
            var ax = 0, ay = 0, n = 0;
            if (left && left.row === d.row) { ax += left.x; ay += left.y; n++; }
            if (right && right.row === d.row) { ax += right.x; ay += right.y; n++; }
            if (n) {
              d.vx += ((ax / n) - d.x) * opts.tension * 0.08;
              d.vy += ((ay / n) - d.y) * opts.tension * 0.08;
            }
          }
        }

        ctx.clearRect(0, 0, w, h2);
        ctx.globalAlpha = opts.opacity;

        var introT = opts.intro ? Math.min(1, (performance.now() - born) / 700) : 1;
        var cx0 = w / 2, cy0 = h2 / 2;
        var maxR = Math.hypot(cx0, cy0) || 1;

        for (i = 0; i < dots.length; i++) {
          d = dots[i];

          d.vx += -d.x * stiffness;
          d.vy += -d.y * stiffness;
          d.vx *= damping;
          d.vy *= damping;
          d.x += d.vx;
          d.y += d.vy;

          var px = d.ox + d.x;
          var py = d.oy + d.y;

          // lit amount: motion plus cursor proximity
          var moving = Math.min(1, Math.hypot(d.vx, d.vy) / 2.4);
          var near = 0;
          if (opts.mouseInteraction && pointer.inside) {
            var pd = Math.hypot(px - pointer.x, py - pointer.y);
            near = pd < opts.proximity ? 1 - pd / opts.proximity : 0;
          }
          var lit = Math.max(moving, near);

          // intro pop from the centre outward
          if (introT < 1) {
            var ringDelay = Math.hypot(px - cx0, py - cy0) / maxR;
            var local = (introT - ringDelay * 0.55) / 0.45;
            if (local <= 0) continue;
            lit *= Math.min(1, local);
            ctx.globalAlpha = opts.opacity * Math.min(1, local);
          } else {
            ctx.globalAlpha = opts.opacity;
          }

          // fade toward the edges
          if (opts.fade > 0) {
            var edge = Math.min(px, w - px, py, h2 - py);
            var band = Math.min(w, h2) * 0.5 * opts.fade;
            if (band > 0 && edge < band) {
              ctx.globalAlpha *= Math.max(0, edge / band);
            }
          }

          var r = base.r + (active.r - base.r) * lit;
          var g = base.g + (active.g - base.g) * lit;
          var b = base.b + (active.b - base.b) * lit;
          ctx.fillStyle = 'rgb(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ')';

          if (opts.glow > 0 && lit > 0.08) {
            ctx.shadowBlur = opts.glow * 12 * lit;
            ctx.shadowColor = 'rgba(' + (active.r | 0) + ',' + (active.g | 0) + ',' + (active.b | 0) + ',' + (0.8 * lit) + ')';
          } else {
            ctx.shadowBlur = 0;
          }

          var size = opts.dotSize * (1 + opts.swell * lit * 0.5);
          var sx = 1 + Math.min(1.4, Math.abs(d.vx) * 0.12) * opts.stretch;
          var sy = 1 + Math.min(1.4, Math.abs(d.vy) * 0.12) * opts.stretch;

          ctx.save();
          ctx.translate(px, py);
          ctx.scale(sx, sy);
          if (opts.shape === 'square') {
            ctx.fillRect(-size / 2, -size / 2, size, size);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      function onMove(e) {
        var rect = host.getBoundingClientRect();
        if (pointer.x < -999) {
          pointer.px = e.clientX - rect.left;
          pointer.py = e.clientY - rect.top;
        }
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
        pointer.inside = true;
      }
      function onLeave() { pointer.inside = false; pointer.x = -9999; pointer.y = -9999; }
      function onClick(e) {
        if (!opts.clickShock) return;
        var rect = host.getBoundingClientRect();
        push(e.clientX - rect.left, e.clientY - rect.top, opts.shockRadius, opts.shockStrength);
      }

      layout();

      if (reduceMotion) {
        // Draw the grid once, at rest, and stop.
        ctx.clearRect(0, 0, w, h2);
        ctx.globalAlpha = opts.opacity;
        ctx.fillStyle = opts.baseColor;
        for (var k = 0; k < dots.length; k++) {
          var dot = dots[k];
          ctx.beginPath();
          ctx.arc(dot.ox, dot.oy, opts.dotSize / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        return;
      }

      var ro = new ResizeObserver(layout);
      ro.observe(host);

      var io = new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
      }, { threshold: 0 });
      io.observe(host);

      if (opts.mouseInteraction) {
        global.addEventListener('mousemove', onMove, { passive: true });
        host.addEventListener('mouseleave', onLeave);
        host.addEventListener('click', onClick);
      }

      raf = requestAnimationFrame(frame);

      return function () {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        global.removeEventListener('mousemove', onMove);
        host.removeEventListener('mouseleave', onLeave);
        host.removeEventListener('click', onClick);
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return h('div', {
      ref: hostRef,
      className: props.className || '',
      style: Object.assign({ position: 'absolute', inset: 0 }, props.style)
    }, h('canvas', { ref: canvasRef, style: { display: 'block' } }));
  }

  global.ReactBits = {
    CountUp: CountUp,
    DotGrid: DotGrid,
    mount: function (node, component, props) {
      ReactDOM.createRoot(node).render(h(component, props || null));
    }
  };
})(window);
