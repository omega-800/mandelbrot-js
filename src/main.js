import { calc_mandelbrot } from "./calc.js";
const ZOOM_SCALE = 2.0;

function draw_mandelbrot(width, height, frame, pixels, c) {
  const dbg = document.getElementById("dbg-info");
  dbg.innerHTML = `x: ${frame.x}, y: ${frame.y}, Z: ${frame.zoom}`;
}

function main() {
  let frame = { x: 0, y: 0, zoom: 1.0 };
  let c = { r: 10, g: 100, b: 255, a: 255 };

  const r_in = document.getElementById("input-r");
  const g_in = document.getElementById("input-g");
  const b_in = document.getElementById("input-b");
  const max_iter_in = document.getElementById("max-iter");
  const reset = document.getElementById("reset-zoom");

  const canvas = document.getElementById("mandelbroetli-canvas");
  const SCREEN_WIDTH = canvas.width;
  const SCREEN_HEIGHT = canvas.height;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(SCREEN_WIDTH, SCREEN_HEIGHT);

  function redraw() {
    c = {
      r: Number(r_in.value),
      g: Number(g_in.value),
      b: Number(b_in.value),
      a: 255,
    };
    calc_mandelbrot(
      SCREEN_WIDTH,
      SCREEN_HEIGHT,
      frame,
      img.data,
      Number(max_iter_in.value),
      c,
    );
    draw_mandelbrot(SCREEN_WIDTH, SCREEN_HEIGHT, frame, img.data, c);
    ctx.putImageData(img, 0, 0);
  }

  redraw();
  r_in.addEventListener("input", redraw);
  g_in.addEventListener("input", redraw);
  b_in.addEventListener("input", redraw);
  max_iter_in.addEventListener("input", redraw);
  reset.addEventListener("click", (e) => {
      frame = { x: 0, y: 0, zoom: 1.0 };
      redraw();
  });
  canvas.addEventListener("click", (e) => {
    if (e.which == 3 || e.button == 3) {
      frame = { x: 0, y: 0, zoom: 1.0 };
      return redraw();
    }
    let s_x = (SCREEN_WIDTH / ZOOM_SCALE) * 0.5;
    let s_y = (SCREEN_HEIGHT / ZOOM_SCALE) * 0.5;
    let new_x =
      0 > e.pageX - s_x
        ? 0
        : SCREEN_WIDTH < e.pageX + s_x
          ? SCREEN_WIDTH - 2 * s_x
          : e.pageX - s_x;
    let new_y =
      0 > e.pageY - s_y
        ? 0
        : SCREEN_HEIGHT < e.pageY + s_y
          ? SCREEN_HEIGHT - 2 * s_y
          : e.pageY - s_y;
    frame.x += new_x / frame.zoom;
    frame.y += new_y / frame.zoom;
    frame.zoom *= ZOOM_SCALE;
    redraw();
  });
}

main();
