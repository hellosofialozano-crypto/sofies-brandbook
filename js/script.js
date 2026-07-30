// ==========================================================
// PREMIUM PARALLAX - QUIET LUXURY
// Desktop:
// • Mouse parallax
// • Rotação 3D suave
// • Movimento amortecido
//
// Mobile:
// • Deriva ambiente orgânica
// • Respiração (zoom vivo)
//
// Ambos:
// • Compatível com 60Hz / 120Hz / 144Hz
// • Respeita prefers-reduced-motion
// ==========================================================

(function () {

  const bg = document.querySelector(".section1__bg");
  const stage = document.querySelector(".section1");

  if (!bg || !stage) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return;

  // ---------------------------------------
  // CONFIGURAÇÃO
  // ---------------------------------------

  const MAX_MOVE = 14;
  const MAX_ROTATION = 2.5;
  const BASE_SCALE = 1.08;

  let targetX = 0;
  let targetY = 0;

  let currentX = 0;
  let currentY = 0;

  let last = performance.now();

  let breathing = 0;

  // ---------------------------------------
  // LOOP
  // ---------------------------------------

  function animate(now) {

    const dt = Math.min((now - last) / 16.67, 2);
    last = now;

    currentX += (targetX - currentX) * 0.045 * dt;
    currentY += (targetY - currentY) * 0.045 * dt;

    breathing += 0.0035 * dt;

    const scale =
      BASE_SCALE +
      Math.sin(breathing) * 0.004;

    const rotY =
      (currentX / MAX_MOVE) * MAX_ROTATION;

    const rotX =
      (-currentY / MAX_MOVE) * MAX_ROTATION;

    const blur =
      (Math.abs(currentX) + Math.abs(currentY))
      * 0.012;

    bg.style.transform = `
      perspective(1200px)
      scale(${scale})
      translate3d(${currentX.toFixed(2)}px,
                  ${currentY.toFixed(2)}px,
                  0)
      rotateX(${rotX.toFixed(2)}deg)
      rotateY(${rotY.toFixed(2)}deg)
    `;

    bg.style.filter =
      `blur(${blur.toFixed(2)}px)`;

    requestAnimationFrame(animate);

  }

  requestAnimationFrame(animate);

  // ---------------------------------------
  // DESKTOP
  // ---------------------------------------

  if (window.matchMedia("(pointer:fine)").matches) {

    stage.addEventListener("mousemove", e => {

      const rect = stage.getBoundingClientRect();

      const x =
        (e.clientX - rect.left) / rect.width;

      const y =
        (e.clientY - rect.top) / rect.height;

      targetX =
        -(x - .5) * MAX_MOVE * 2;

      targetY =
        -(y - .5) * MAX_MOVE * 2;

    });

    stage.addEventListener("mouseleave", () => {

      targetX = 0;
      targetY = 0;

    });

  }

  // ---------------------------------------
  // MOBILE
  // ---------------------------------------

  else {

    let t = 0;

    function ambient() {

      t += 0.015;

      targetX =
        Math.sin(t * .8) * 7;

      targetY =
        Math.sin(t * .45) * 4 +
        Math.cos(t * .20) * 2;

      requestAnimationFrame(ambient);

    }

    requestAnimationFrame(ambient);

  }

  // ---------------------------------------
  // SCROLL PARALLAX
  // ---------------------------------------

  window.addEventListener("scroll", () => {

    const rect = stage.getBoundingClientRect();

    const progress =
      rect.top / window.innerHeight;

    bg.style.setProperty(
      "--scroll-offset",
      `${progress * -12}px`
    );

  }, {
    passive: true
  });

})();
