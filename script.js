const gloss = document.getElementById('gloss');

if (gloss && matchMedia('(hover:hover)').matches) {
  let x = window.innerWidth / 2, y = window.innerHeight / 2;
  let gx = x, gy = y;

  window.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
  });

  function loop() {
    gx += (x - gx) * 0.18;
    gy += (y - gy) * 0.18;
    gloss.style.transform = `translate(${gx}px, ${gy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('a, .tile, .swatch').forEach(el => {
    el.addEventListener('mouseenter', () => {
      gloss.style.width = '70px';
      gloss.style.height = '70px';
    });
    el.addEventListener('mouseleave', () => {
      gloss.style.width = '38px';
      gloss.style.height = '38px';
    });
  });
}
