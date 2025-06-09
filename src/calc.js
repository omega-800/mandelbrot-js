const MAX_THREADS = 16;
const MAX_THREAD_LOAD = 100000000;

function _calc_mandelbrot(s) {
  for (let i = s.from; i < s.to; i++) {
    let x0 = (((i % s.width) / s.zoom + s.x) / s.width) * 2.47 - 2.0;
    let y0 = ((i / s.width / s.zoom + s.y) / s.height) * 2.24 - 1.12;
    let x1 = 0.0,
      y1 = 0.0,
      x2 = 0.0,
      y2 = 0.0;
    let iter = 0;
    while (x2 + y2 <= 4 && iter < s.max_iter) {
      y1 = 2 * x1 * y1 + y0;
      x1 = x2 - y2 + x0;
      x2 = x1 * x1;
      y2 = y1 * y1;
      iter += 1;
    }
    //pthread_mutex_lock(s.lock);
    s.pixels[i*4] = (iter * s.r) / s.max_iter;
    s.pixels[i*4+1] = (iter * s.g) / s.max_iter;
    s.pixels[i*4+2] = (iter * s.b) / s.max_iter;
    s.pixels[i*4+3] = 255;
    //pthread_mutex_unlock(s.lock);
  }
}

export function calc_mandelbrot(width, height, frame, pixels, max_iter, c) {
  let t = performance.now();
  const size = width * height;
  const load = max_iter * size;
  let pool_size =
    load > MAX_THREADS * MAX_THREAD_LOAD ? MAX_THREADS : load / MAX_THREAD_LOAD;
  if (pool_size == 0) pool_size = 1;
  // FIXME:
  const chunk = size / pool_size;
  let threads = [];
  for (let i = 0; i < pool_size; i++) {
    const slice = {
      max_iter,
      width,
      height,
      from: i * chunk,
      to: (i + 1) * chunk,
      x: frame.x,
      y: frame.y,
      zoom: frame.zoom,
      pixels,
      r: c.r,
      g: c.g,
      b: c.b
    };
    _calc_mandelbrot(slice);
  }
  for (let i = 0; i < pool_size; i++) console.log("join");

  t = performance.now() - t;
  console.log(
    "calc took %fs to execute with x(%d) y(%d) zoom(%.2f) max_iter(%d) threads(%d)\n",
    t/1000,
    frame.x,
    frame.y,
    frame.zoom,
    max_iter,
    pool_size,
  );

  return pixels;
}
