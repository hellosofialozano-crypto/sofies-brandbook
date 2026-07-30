// Seção 1 do brandbook — parallax sutil no fundo.
// Desktop (mouse): a imagem segue o cursor levemente.
// Celular/touch (sem mouse): leve deriva ambiente automática,
// só pra imagem não ficar "morta" — sem pedir permissão de
// giroscópio, que exige gesto do usuário no iOS.

(function () {
  const bg = document.querySelector(".section1__bg");
  const stage = document.querySelector(".section1");
  if (!bg || !stage) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return;

  const MAX_PX = 14; // deslocamento máximo em px

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  function loop() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    bg.style.transform =
      "scale(1.06) translate(" + currentX.toFixed(2) + "px, " + currentY.toFixed(2) + "px)";
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (hasFinePointer) {
    stage.addEventListener("mousemove", function (e) {
      const rect = stage.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = -relX * MAX_PX * 2;
      targetY = -relY * MAX_PX * 2;
    });
    stage.addEventListener("mouseleave", function () {
      targetX = 0;
      targetY = 0;
    });
  } else {
    let t = 0;
    setInterval(function () {
      t += 0.015;
      targetX = Math.sin(t) * (MAX_PX * 0.5);
      targetY = Math.cos(t * 0.8) * (MAX_PX * 0.35);
    }, 50);
  }
})();
