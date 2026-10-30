import { mkdirSync } from 'node:fs';
import gifenc from 'gifenc';

const { GIFEncoder, quantize, applyPalette } = gifenc;

const outputDir = 'public/exercise-gifs';
const exercises = [
  'cat-camel',
  'childs-pose',
  'cobra',
  'bird-dog',
  'bridge',
  'plank',
  'spinal-twist',
  'chest-opener',
];
const width = 320;
const height = 180;
const frames = 8;

function setPixel(buffer, x, y, color) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const index = (y * width + x) * 4;
  buffer[index] = color[0];
  buffer[index + 1] = color[1];
  buffer[index + 2] = color[2];
  buffer[index + 3] = 255;
}

function line(buffer, x1, y1, x2, y2, color, thickness = 3) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
  for (let step = 0; step <= steps; step += 1) {
    const x = Math.round(x1 + ((x2 - x1) * step) / steps);
    const y = Math.round(y1 + ((y2 - y1) * step) / steps);
    for (let offset = -thickness; offset <= thickness; offset += 1) {
      setPixel(buffer, x + offset, y, color);
      setPixel(buffer, x, y + offset, color);
    }
  }
}

function circle(buffer, centerX, centerY, radius, color) {
  for (let y = -radius; y <= radius; y += 1) {
    for (let x = -radius; x <= radius; x += 1) {
      if (x * x + y * y <= radius * radius) setPixel(buffer, centerX + x, centerY + y, color);
    }
  }
}

function drawFigure(buffer, type, phase) {
  const ink = [48, 65, 88];
  const accent = [91, 93, 211];
  const floor = [203, 213, 225];
  const motion = Math.sin(phase * Math.PI * 2);
  line(buffer, 40, 145, 280, 145, floor, 1);

  if (type === 'cat-camel') {
    const arch = 42 + motion * 16;
    line(buffer, 95, 125, 125, 94, ink);
    line(buffer, 125, 94, 190, 94 - arch / 3, accent);
    line(buffer, 190, 94 - arch / 3, 220, 125, accent);
    line(buffer, 95, 125, 90, 145, ink);
    line(buffer, 220, 125, 225, 145, ink);
    circle(buffer, 83, 88 - motion * 4, 10, ink);
  } else if (type === 'childs-pose') {
    line(buffer, 220, 130, 165, 112, accent);
    line(buffer, 165, 112, 105, 130 - motion * 7, accent);
    line(buffer, 105, 130 - motion * 7, 75, 140, ink);
    line(buffer, 220, 130, 245, 145, ink);
    circle(buffer, 65, 138, 10, ink);
  } else if (type === 'cobra') {
    line(buffer, 72, 140, 245, 140, ink);
    line(buffer, 105, 140, 125, 104 - motion * 9, accent);
    line(buffer, 125, 104 - motion * 9, 190, 104 - motion * 9, accent);
    line(buffer, 190, 104 - motion * 9, 215, 140, accent);
    circle(buffer, 115, 92 - motion * 9, 10, ink);
  } else if (type === 'bird-dog') {
    line(buffer, 110, 115, 190, 105, accent);
    line(buffer, 110, 115, 90, 145, ink);
    line(buffer, 190, 105, 210, 145, ink);
    line(buffer, 145, 110, 90 - motion * 18, 82, accent);
    line(buffer, 160, 110, 225 + motion * 18, 80, accent);
    circle(buffer, 102, 91, 10, ink);
  } else if (type === 'bridge') {
    line(buffer, 80, 140, 120, 140, ink);
    line(buffer, 120, 140, 155, 105 - motion * 15, accent);
    line(buffer, 155, 105 - motion * 15, 195, 140, accent);
    line(buffer, 195, 140, 240, 140, ink);
    circle(buffer, 75, 132, 10, ink);
  } else if (type === 'plank') {
    line(buffer, 75, 125, 220, 125 - motion * 4, accent);
    line(buffer, 220, 125 - motion * 4, 250, 140, ink);
    line(buffer, 105, 125, 95, 145, ink);
    line(buffer, 150, 125, 145, 145, ink);
    circle(buffer, 63, 119, 10, ink);
  } else if (type === 'spinal-twist') {
    line(buffer, 140, 82, 140, 125, accent);
    line(buffer, 140, 125, 105 + motion * 20, 145, accent);
    line(buffer, 140, 125, 175 - motion * 20, 145, accent);
    line(buffer, 140, 95, 95 + motion * 22, 105, ink);
    line(buffer, 140, 95, 185 - motion * 22, 105, ink);
    circle(buffer, 140, 70, 10, ink);
  } else {
    line(buffer, 145, 88, 145, 125, accent);
    line(buffer, 145, 95, 95 - motion * 12, 105, ink);
    line(buffer, 145, 95, 195 + motion * 12, 105, ink);
    line(buffer, 145, 125, 120, 145, ink);
    line(buffer, 145, 125, 170, 145, ink);
    circle(buffer, 145, 73, 10, ink);
  }
}

mkdirSync(outputDir, { recursive: true });
for (const exercise of exercises) {
  const gif = GIFEncoder();
  for (let frame = 0; frame < frames; frame += 1) {
    const pixels = new Uint8Array(width * height * 4);
    pixels.fill(255);
    drawFigure(pixels, exercise, frame / frames);
    const palette = quantize(pixels, 64);
    const indexed = applyPalette(pixels, palette);
    gif.writeFrame(indexed, width, height, { palette, delay: 180 });
  }
  gif.finish();
  const output = Buffer.from(gif.bytes());
  await import('node:fs').then(({ writeFileSync }) => writeFileSync(`${outputDir}/${exercise}.gif`, output));
}
