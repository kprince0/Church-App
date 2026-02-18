import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const outDir = path.resolve('resources');
fs.mkdirSync(outDir, { recursive: true });

function setPixel(png, x, y, r, g, b, a = 255) {
  const idx = (png.width * y + x) << 2;
  png.data[idx] = r;
  png.data[idx + 1] = g;
  png.data[idx + 2] = b;
  png.data[idx + 3] = a;
}

function drawRect(png, x, y, w, h, color) {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      if (xx >= 0 && yy >= 0 && xx < png.width && yy < png.height) {
        setPixel(png, xx, yy, color[0], color[1], color[2], color[3] ?? 255);
      }
    }
  }
}

function createIcon() {
  const size = 1024;
  const png = new PNG({ width: size, height: size });

  const blue = [30, 58, 138, 255];
  const white = [255, 255, 255, 255];

  drawRect(png, 0, 0, size, size, blue);

  const crossW = 120;
  const crossH = 420;
  drawRect(png, Math.floor(size / 2 - crossW / 2), Math.floor(size / 2 - crossH / 2), crossW, crossH, white);
  drawRect(png, Math.floor(size / 2 - 230), Math.floor(size / 2 - 50), 460, 100, white);

  return png;
}

function createSplash() {
  const width = 2732;
  const height = 2732;
  const png = new PNG({ width, height });

  const white = [255, 255, 255, 255];
  const blue = [30, 58, 138, 255];
  const sky = [219, 234, 254, 255];

  drawRect(png, 0, 0, width, height, white);
  drawRect(png, 0, 0, width, 300, sky);
  drawRect(png, 0, height - 300, width, 300, sky);

  const cx = Math.floor(width / 2);
  const cy = Math.floor(height / 2);
  drawRect(png, cx - 70, cy - 320, 140, 640, blue);
  drawRect(png, cx - 260, cy - 40, 520, 80, blue);

  return png;
}

function writePng(fileName, png) {
  const outPath = path.join(outDir, fileName);
  fs.writeFileSync(outPath, PNG.sync.write(png));
  console.log(`생성: ${outPath}`);
}

writePng('icon.png', createIcon());
writePng('splash.png', createSplash());
