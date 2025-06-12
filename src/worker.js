onmessage = (e) => {
  const s = e.data;
  const px = [];
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
    px.push((iter * s.r) / s.max_iter);
    px.push((iter * s.g) / s.max_iter);
    px.push((iter * s.b) / s.max_iter);
    px.push(255);
  }
  e.data.g = 0;
  postMessage({from: s.from, px});
};
