const MAX_THREADS = 16;
const MAX_THREAD_LOAD = 100000000;

export async function calc_mandelbrot(
  width,
  height,
  frame,
  pixels,
  max_iter,
  c,
) {
  return new Promise((r) => {
    let t = performance.now();
    const size = width * height;
    const load = max_iter * size;
    let pool_size =
      load > MAX_THREADS * MAX_THREAD_LOAD
        ? MAX_THREADS
        : Math.ceil(load / MAX_THREAD_LOAD);
    if (pool_size == 0) pool_size = 1;
    const chunk = Math.ceil(size / pool_size);
    const all = {};
    for (let i = 0; i < pool_size; i++) {
      const slice = {
        max_iter,
        width,
        height,
        from: i * chunk,
        // FIXME:
        to: /* i == pool_size - 1 ? size % pool_size : */ (i + 1) * chunk,
        x: frame.x,
        y: frame.y,
        zoom: frame.zoom,
        pixels,
        r: c.r,
        g: c.g,
        b: c.b,
      };
      const w = new Worker("worker.js");
      w.postMessage(slice);
      w.onmessage = (e) => {
        all[e.data.from] = e.data.px;
        if(Object.keys(all).length < pool_size) return;
        pixels = Object.keys(all).sort((a,b)=>Number(a)>Number(b)).flatMap(k=>all[k]);

        t = performance.now() - t;
        console.log(
          "calc took %fs to execute with x(%d) y(%d) zoom(%.2f) max_iter(%d) threads(%d)\n",
          t / 1000,
          frame.x,
          frame.y,
          frame.zoom,
          max_iter,
          pool_size,
        );
        r(pixels);
      };
    }
  });
}
