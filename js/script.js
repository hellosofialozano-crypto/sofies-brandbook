// Seção 1 do brandbook — preloader, cursor customizado,
// parallax no fundo, efeito magnético e texto decodificando.

(function () {
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  /* =========================================================
     1) PRELOADER
     Acompanha o carregamento real da imagem de fundo + um
     tempo mínimo (pra não "piscar" em conexões rápidas).
     Quando termina, libera a cascata via body.is-ready.
     ========================================================= */
  function initPreloader() {
    var preloader = document.getElementById("preloader");
    var fill = document.getElementById("preloaderFill");
    var pct = document.getElementById("preloaderPct");
    var bgImg = document.querySelector(".section1__bg");

    var MIN_DURATION = 1300; // ms mínimos, mesmo com cache
    var startTime = performance.now();
    var imageDone = false;
    var progress = 0;

    function setProgress(p) {
      progress = Math.min(p, 100);
      if (fill) fill.style.width = progress + "%";
      if (pct) pct.textContent = Math.round(progress) + "%";
    }

    function tick(now) {
      var elapsed = now - startTime;
      var timeRatio = Math.min(elapsed / MIN_DURATION, 1);
      // sobe rápido até ~90%, e só fecha os 10% finais quando
      // a imagem realmente carregou
      var target = imageDone ? 100 : Math.min(timeRatio * 90, 90);
      setProgress(progress + (target - progress) * 0.18);

      if (progress < 99.5) {
        requestAnimationFrame(tick);
      } else {
        finish();
      }
    }

    function finish() {
      setProgress(100);
      setTimeout(function () {
        if (preloader) preloader.classList.add("is-done");
        document.body.classList.add("is-ready");
        startDecode();
      }, 280);
    }

    if (reduced) {
      // sem preloader chamativo: libera tudo direto
      if (preloader) preloader.style.display = "none";
      document.body.classList.add("is-ready");
      startDecode();
      return;
    }

    if (bgImg) {
      if (bgImg.complete && bgImg.naturalWidth > 0) {
        imageDone = true;
      } else {
        bgImg.addEventListener("load", function () { imageDone = true; });
        bgImg.addEventListener("error", function () { imageDone = true; });
      }
    } else {
      imageDone = true;
    }

    requestAnimationFrame(tick);
  }

  /* =========================================================
     2) CURSOR CUSTOMIZADO
     Só ativa em telas com mouse de verdade. Cresce ao passar
     sobre elementos interativos (skills, footer).
     ========================================================= */
  function initCursor() {
    if (!hasFinePointer || reduced) return;

    var cursor = document.getElementById("cursor");
    if (!cursor) return;

    document.documentElement.classList.add("has-custom-cursor");

    var mouseX = 0, mouseY = 0;
    var curX = 0, curY = 0;
    var shown = false;

    window.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!shown) {
        cursor.classList.add("is-active");
        shown = true;
      }
    });

    document.addEventListener("mouseleave", function () {
      cursor.classList.remove("is-active");
      shown = false;
    });

    function loop() {
      curX += (mouseX - curX) * 0.35;
      curY += (mouseY - curY) * 0.35;
      cursor.style.left = curX + "px";
      cursor.style.top = curY + "px";
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    var hoverables = document.querySelectorAll("[data-magnetic]");
    hoverables.forEach(function (el) {
      el.addEventListener("mouseenter", function () { cursor.classList.add("is-hover"); });
      el.addEventListener("mouseleave", function () { cursor.classList.remove("is-hover"); });
    });
  }

  /* =========================================================
     3) EFEITO MAGNÉTICO
     Elementos com [data-magnetic] se deslocam em direção ao
     cursor conforme ele se aproxima, dentro dos próprios
     limites do elemento.
     ========================================================= */
  function initMagnetic() {
    if (!hasFinePointer || reduced) return;

    var items = document.querySelectorAll("[data-magnetic]");
    items.forEach(function (el) {
      var strength = parseFloat(el.getAttribute("data-magnetic-strength")) || 14;

      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var relX = (e.clientX - rect.left) / rect.width - 0.5;
        var relY = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.transform = "translate(" + (relX * strength).toFixed(1) + "px, " + (relY * strength).toFixed(1) + "px)";
      });

      el.addEventListener("mouseleave", function () {
        el.style.transform = "";
      });
    });
  }

  /* =========================================================
     4) PARALLAX NO FUNDO
     Desktop: segue o mouse. Touch: deriva ambiente automática.
     ========================================================= */
  function initParallax() {
    if (reduced) return;

    var bg = document.querySelector(".section1__bg");
    var stage = document.querySelector(".section1");
    if (!bg || !stage) return;

    var MAX_PX = 14;
    var targetX = 0, targetY = 0, currentX = 0, currentY = 0;

    function loop() {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      bg.style.transform = "scale(1.06) translate(" + currentX.toFixed(2) + "px, " + currentY.toFixed(2) + "px)";
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    if (hasFinePointer) {
      stage.addEventListener("mousemove", function (e) {
        var rect = stage.getBoundingClientRect();
        var relX = (e.clientX - rect.left) / rect.width - 0.5;
        var relY = (e.clientY - rect.top) / rect.height - 0.5;
        targetX = -relX * MAX_PX * 2;
        targetY = -relY * MAX_PX * 2;
      });
      stage.addEventListener("mouseleave", function () {
        targetX = 0;
        targetY = 0;
      });
    } else {
      var t = 0;
      setInterval(function () {
        t += 0.015;
        targetX = Math.sin(t) * (MAX_PX * 0.5);
        targetY = Math.cos(t * 0.8) * (MAX_PX * 0.35);
      }, 50);
    }
  }

  /* =========================================================
     5) TEXTO DECODIFICANDO
     Cada linha da quote "monta" as letras a partir de
     caracteres aleatórios, revelando da esquerda pra direita.
     ========================================================= */
  var SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function decodeLine(el, delay) {
    var original = el.textContent;
    var len = original.length;
    var duration = 700;
    var frameTime = 30;
    var totalFrames = Math.round(duration / frameTime);
    var frame = 0;
    var timer = null;

    setTimeout(function () {
      timer = setInterval(function () {
        var output = "";
        for (var i = 0; i < len; i++) {
          var ch = original[i];
          if (ch === " " || /[.,'’]/.test(ch)) {
            output += ch;
            continue;
          }
          var revealAt = (i / len) * totalFrames * 0.7;
          if (frame >= revealAt) {
            output += ch;
          } else {
            output += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
        }
        el.textContent = output;
        frame++;
        if (frame > totalFrames) {
          el.textContent = original;
          clearInterval(timer);
        }
      }, frameTime);
    }, delay);
  }

  function startDecode() {
    var lines = document.querySelectorAll("#decodeQuote .decode-line");
    if (reduced || !lines.length) return;
    lines.forEach(function (line, i) {
      decodeLine(line, 1300 + i * 160);
    });
  }

  // ---- boot ----
  initPreloader();
  initCursor();
  initMagnetic();
  initParallax();
})();
