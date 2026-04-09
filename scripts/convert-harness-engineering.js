import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const svg = readFileSync('diagrams/harness-engineering.svg');

await sharp(svg, { density: 200 })
  .flatten({ background: '#1C1917' })
  .png()
  .toFile('slides/images/harness-engineering.png');
