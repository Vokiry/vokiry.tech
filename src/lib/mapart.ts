import { createSchematicNBT, gzipCompress } from "./nbt";

export interface MinecraftBlock {
  id: string;
  legacyId: number;
  legacyData: number;
  name: string;
  rgb: [number, number, number]; // Base RGB
  category: "survival" | "wool" | "concrete" | "terracotta" | "nether" | "special";
}

export type DitherAlgorithm =
  | "none"
  | "floyd-steinberg"
  | "atkinson"
  | "bayer2x2"
  | "bayer4x4"
  | "bayer8x8"
  | "burkes"
  | "stucki"
  | "sierra-lite";

export type MapMode = "2d-flat" | "3d-staircased";
export type ColorMetric = "perceptual-lab" | "euclidean-rgb";
export type CropMode = "cover" | "contain" | "stretch";

export const MINECRAFT_BLOCKS: MinecraftBlock[] = [
  // Survival & Basic
  { id: "minecraft:cobblestone", legacyId: 4, legacyData: 0, name: "Булыжник", rgb: [112, 112, 112], category: "survival" },
  { id: "minecraft:stone", legacyId: 1, legacyData: 0, name: "Камень", rgb: [125, 125, 125], category: "survival" },
  { id: "minecraft:dirt", legacyId: 3, legacyData: 0, name: "Земля", rgb: [151, 109, 77], category: "survival" },
  { id: "minecraft:sand", legacyId: 12, legacyData: 0, name: "Песок", rgb: [219, 211, 160], category: "survival" },
  { id: "minecraft:gravel", legacyId: 13, legacyData: 0, name: "Гравий", rgb: [136, 134, 134], category: "survival" },
  { id: "minecraft:oak_planks", legacyId: 5, legacyData: 0, name: "Дубовые доски", rgb: [162, 130, 78], category: "survival" },
  { id: "minecraft:birch_planks", legacyId: 5, legacyData: 2, name: "Берёзовые доски", rgb: [196, 179, 123], category: "survival" },
  { id: "minecraft:snow_block", legacyId: 80, legacyData: 0, name: "Снег", rgb: [249, 254, 254], category: "survival" },
  { id: "minecraft:obsidian", legacyId: 49, legacyData: 0, name: "Обсидиан", rgb: [20, 18, 29], category: "survival" },

  // Nether & End
  { id: "minecraft:netherrack", legacyId: 87, legacyData: 0, name: "Незерак", rgb: [111, 40, 42], category: "nether" },
  { id: "minecraft:end_stone", legacyId: 121, legacyData: 0, name: "Эндерняк", rgb: [221, 223, 165], category: "nether" },
  { id: "minecraft:blackstone", legacyId: 49, legacyData: 0, name: "Чернит", rgb: [42, 38, 46], category: "nether" },
  { id: "minecraft:soul_sand", legacyId: 88, legacyData: 0, name: "Песок душ", rgb: [81, 62, 50], category: "nether" },
  { id: "minecraft:warped_planks", legacyId: 5, legacyData: 5, name: "Искажённые доски", rgb: [43, 104, 99], category: "nether" },
  { id: "minecraft:crimson_planks", legacyId: 5, legacyData: 4, name: "Багровые доски", rgb: [101, 48, 70], category: "nether" },

  // Wool (16 colors)
  { id: "minecraft:white_wool", legacyId: 35, legacyData: 0, name: "Белая шерсть", rgb: [233, 236, 236], category: "wool" },
  { id: "minecraft:orange_wool", legacyId: 35, legacyData: 1, name: "Оранжевая шерсть", rgb: [240, 118, 19], category: "wool" },
  { id: "minecraft:magenta_wool", legacyId: 35, legacyData: 2, name: "Пурпурная шерсть", rgb: [189, 68, 179], category: "wool" },
  { id: "minecraft:light_blue_wool", legacyId: 35, legacyData: 3, name: "Голубая шерсть", rgb: [58, 175, 217], category: "wool" },
  { id: "minecraft:yellow_wool", legacyId: 35, legacyData: 4, name: "Жёлтая шерсть", rgb: [248, 197, 39], category: "wool" },
  { id: "minecraft:lime_wool", legacyId: 35, legacyData: 5, name: "Лаймовая шерсть", rgb: [112, 185, 25], category: "wool" },
  { id: "minecraft:pink_wool", legacyId: 35, legacyData: 6, name: "Розовая шерсть", rgb: [237, 141, 172], category: "wool" },
  { id: "minecraft:gray_wool", legacyId: 35, legacyData: 7, name: "Серая шерсть", rgb: [62, 68, 71], category: "wool" },
  { id: "minecraft:light_gray_wool", legacyId: 35, legacyData: 8, name: "Светло-серая шерсть", rgb: [142, 142, 134], category: "wool" },
  { id: "minecraft:cyan_wool", legacyId: 35, legacyData: 9, name: "Бирюзовая шерсть", rgb: [21, 137, 145], category: "wool" },
  { id: "minecraft:purple_wool", legacyId: 35, legacyData: 10, name: "Фиолетовая шерсть", rgb: [121, 42, 172], category: "wool" },
  { id: "minecraft:blue_wool", legacyId: 35, legacyData: 11, name: "Синяя шерсть", rgb: [53, 57, 157], category: "wool" },
  { id: "minecraft:brown_wool", legacyId: 35, legacyData: 12, name: "Коричневая шерсть", rgb: [114, 71, 40], category: "wool" },
  { id: "minecraft:green_wool", legacyId: 35, legacyData: 13, name: "Зелёная шерсть", rgb: [84, 109, 27], category: "wool" },
  { id: "minecraft:red_wool", legacyId: 35, legacyData: 14, name: "Красная шерсть", rgb: [160, 39, 34], category: "wool" },
  { id: "minecraft:black_wool", legacyId: 35, legacyData: 15, name: "Чёрная шерсть", rgb: [20, 21, 25], category: "wool" },

  // Concrete (16 colors)
  { id: "minecraft:white_concrete", legacyId: 251, legacyData: 0, name: "Белый бетон", rgb: [207, 213, 214], category: "concrete" },
  { id: "minecraft:orange_concrete", legacyId: 251, legacyData: 1, name: "Оранжевый бетон", rgb: [224, 97, 0], category: "concrete" },
  { id: "minecraft:magenta_concrete", legacyId: 251, legacyData: 2, name: "Пурпурный бетон", rgb: [169, 48, 159], category: "concrete" },
  { id: "minecraft:light_blue_concrete", legacyId: 251, legacyData: 3, name: "Голубой бетон", rgb: [35, 137, 199], category: "concrete" },
  { id: "minecraft:yellow_concrete", legacyId: 251, legacyData: 4, name: "Жёлтый бетон", rgb: [241, 175, 21], category: "concrete" },
  { id: "minecraft:lime_concrete", legacyId: 251, legacyData: 5, name: "Лаймовый бетон", rgb: [94, 169, 24], category: "concrete" },
  { id: "minecraft:pink_concrete", legacyId: 251, legacyData: 6, name: "Розовый бетон", rgb: [214, 101, 143], category: "concrete" },
  { id: "minecraft:gray_concrete", legacyId: 251, legacyData: 7, name: "Серый бетон", rgb: [54, 57, 61], category: "concrete" },
  { id: "minecraft:light_gray_concrete", legacyId: 251, legacyData: 8, name: "Светло-серый бетон", rgb: [125, 125, 115], category: "concrete" },
  { id: "minecraft:cyan_concrete", legacyId: 251, legacyData: 9, name: "Бирюзовый бетон", rgb: [21, 119, 136], category: "concrete" },
  { id: "minecraft:purple_concrete", legacyId: 251, legacyData: 10, name: "Фиолетовый бетон", rgb: [100, 31, 156], category: "concrete" },
  { id: "minecraft:blue_concrete", legacyId: 251, legacyData: 11, name: "Синий бетон", rgb: [44, 46, 143], category: "concrete" },
  { id: "minecraft:brown_concrete", legacyId: 251, legacyData: 12, name: "Коричневый бетон", rgb: [96, 59, 31], category: "concrete" },
  { id: "minecraft:green_concrete", legacyId: 251, legacyData: 13, name: "Зелёный бетон", rgb: [73, 91, 36], category: "concrete" },
  { id: "minecraft:red_concrete", legacyId: 251, legacyData: 14, name: "Красный бетон", rgb: [142, 32, 32], category: "concrete" },
  { id: "minecraft:black_concrete", legacyId: 251, legacyData: 15, name: "Чёрный бетон", rgb: [8, 10, 15], category: "concrete" },

  // Terracotta (16 colors)
  { id: "minecraft:terracotta", legacyId: 159, legacyData: 0, name: "Терракота", rgb: [152, 94, 67], category: "terracotta" },
  { id: "minecraft:white_terracotta", legacyId: 159, legacyData: 0, name: "Белая терракота", rgb: [209, 178, 161], category: "terracotta" },
  { id: "minecraft:orange_terracotta", legacyId: 159, legacyData: 1, name: "Оранжевая терракота", rgb: [161, 83, 37], category: "terracotta" },
  { id: "minecraft:yellow_terracotta", legacyId: 159, legacyData: 4, name: "Жёлтая терракота", rgb: [186, 133, 35], category: "terracotta" },
  { id: "minecraft:light_blue_terracotta", legacyId: 159, legacyData: 3, name: "Голубая терракота", rgb: [113, 108, 138], category: "terracotta" },
  { id: "minecraft:lime_terracotta", legacyId: 159, legacyData: 5, name: "Лаймовая терракота", rgb: [103, 117, 52], category: "terracotta" },
  { id: "minecraft:cyan_terracotta", legacyId: 159, legacyData: 9, name: "Бирюзовая терракота", rgb: [86, 91, 91], category: "terracotta" },
  { id: "minecraft:blue_terracotta", legacyId: 159, legacyData: 11, name: "Синяя терракота", rgb: [74, 59, 91], category: "terracotta" },
  { id: "minecraft:red_terracotta", legacyId: 159, legacyData: 14, name: "Красная терракота", rgb: [143, 61, 46], category: "terracotta" },

  // Special Accents
  { id: "minecraft:gold_block", legacyId: 41, legacyData: 0, name: "Золотой блок", rgb: [245, 206, 56], category: "special" },
  { id: "minecraft:diamond_block", legacyId: 57, legacyData: 0, name: "Алмазный блок", rgb: [92, 219, 213], category: "special" },
  { id: "minecraft:lapis_block", legacyId: 22, legacyData: 0, name: "Лазуритовый блок", rgb: [30, 67, 140], category: "special" },
  { id: "minecraft:emerald_block", legacyId: 133, legacyData: 0, name: "Изумрудный блок", rgb: [42, 203, 88], category: "special" },
  { id: "minecraft:amethyst_block", legacyId: 35, legacyData: 10, name: "Аметистовый блок", rgb: [133, 98, 168], category: "special" },
  { id: "minecraft:sculk", legacyId: 49, legacyData: 0, name: "Скальк", rgb: [11, 32, 39], category: "special" },
];

export interface ShadedBlock {
  block: MinecraftBlock;
  shade: 0 | 1 | 2; // 0 = dark (180/255), 1 = normal (220/255), 2 = bright (255/255)
  rgb: [number, number, number];
}

// Generate palette with 3D staircase shade multipliers
export function buildShadedPalette(basePalette: MinecraftBlock[], mode: MapMode): ShadedBlock[] {
  const result: ShadedBlock[] = [];

  for (const block of basePalette) {
    if (mode === "2d-flat") {
      // Single height layer: multiplier is 220/255
      const mult = 220 / 255;
      result.push({
        block,
        shade: 1,
        rgb: [
          Math.round(block.rgb[0] * mult),
          Math.round(block.rgb[1] * mult),
          Math.round(block.rgb[2] * mult),
        ],
      });
    } else {
      // 3D Staircase: Dark (180/255), Normal (220/255), Bright (255/255)
      const shades: Array<{ shade: 0 | 1 | 2; mult: number }> = [
        { shade: 0, mult: 180 / 255 },
        { shade: 1, mult: 220 / 255 },
        { shade: 2, mult: 255 / 255 },
      ];
      for (const s of shades) {
        result.push({
          block,
          shade: s.shade,
          rgb: [
            Math.min(255, Math.round(block.rgb[0] * s.mult)),
            Math.min(255, Math.round(block.rgb[1] * s.mult)),
            Math.min(255, Math.round(block.rgb[2] * s.mult)),
          ],
        });
      }
    }
  }

  return result;
}

// RGB to CIE L*a*b* conversion for high-fidelity perceptual matching
export function rgb2lab(r: number, g: number, b: number): [number, number, number] {
  let r1 = r / 255;
  let g1 = g / 255;
  let b1 = b / 255;

  r1 = r1 > 0.04045 ? Math.pow((r1 + 0.055) / 1.055, 2.4) : r1 / 12.92;
  g1 = g1 > 0.04045 ? Math.pow((g1 + 0.055) / 1.055, 2.4) : g1 / 12.92;
  b1 = b1 > 0.04045 ? Math.pow((b1 + 0.055) / 1.055, 2.4) : b1 / 12.92;

  const x = (r1 * 0.4124564 + g1 * 0.3575761 + b1 * 0.1804375) / 0.95047;
  const y = (r1 * 0.2126729 + g1 * 0.7151522 + b1 * 0.072175) / 1.0;
  const z = (r1 * 0.0193339 + g1 * 0.119192 + b1 * 0.9503041) / 1.08883;

  const fx = x > 0.008856 ? Math.cbrt(x) : 7.787 * x + 16 / 116;
  const fy = y > 0.008856 ? Math.cbrt(y) : 7.787 * y + 16 / 116;
  const fz = z > 0.008856 ? Math.cbrt(z) : 7.787 * z + 16 / 116;

  const L = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const bVal = 200 * (fy - fz);

  return [L, a, bVal];
}

function colorDistance(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number,
  metric: ColorMetric
): number {
  if (metric === "perceptual-lab") {
    const [l1, a1, b_1] = rgb2lab(r1, g1, b1);
    const [l2, a2, b_2] = rgb2lab(r2, g2, b2);
    const dl = l1 - l2;
    const da = a1 - a2;
    const db = b_1 - b_2;
    return dl * dl + da * da + db * db;
  }
  // Weighted Euclidean RGB
  const rMean = (r1 + r2) / 2;
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return (((512 + rMean) * dr * dr) >> 8) + 4 * dg * dg + (((767 - rMean) * db * db) >> 8);
}

// Bayer Matrices
const BAYER_2X2 = [
  [0, 2],
  [3, 1],
];

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const BAYER_8X8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

export interface MapartResult {
  width: number;
  height: number;
  imageData: ImageData;
  grid: ShadedBlock[][];
  heightMap: number[][]; // Y elevation (0..height) for 3D schematic build
  materials: Array<{ block: MinecraftBlock; count: number; stacks: string }>;
  totalBlocks: number;
  mode: MapMode;
}

export interface MapartProcessOptions {
  width: number;
  height: number;
  palette: MinecraftBlock[];
  mode: MapMode;
  dither: DitherAlgorithm;
  ditherStrength: number; // 0.0 to 1.0
  colorMetric: ColorMetric;
  cropMode: CropMode;
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  backgroundColor?: string;
}

export function processMapartAdvanced(
  sourceImage: HTMLImageElement,
  options: MapartProcessOptions
): MapartResult {
  const {
    width: targetW,
    height: targetH,
    palette: rawPalette,
    mode,
    dither,
    ditherStrength = 1.0,
    colorMetric = "perceptual-lab",
    cropMode = "cover",
    brightness = 0,
    contrast = 0,
    saturation = 0,
    backgroundColor = "#000000",
  } = options;

  const shadedPalette = buildShadedPalette(
    rawPalette.length > 0 ? rawPalette : MINECRAFT_BLOCKS,
    mode
  );

  // Scaling & Preprocessing Canvas
  const offscreen = document.createElement("canvas");
  offscreen.width = targetW;
  offscreen.height = targetH;
  const ctx = offscreen.getContext("2d");
  if (!ctx) throw new Error("Canvas context creation failed");

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, targetW, targetH);

  // Crop / Sizing math
  const srcW = sourceImage.width;
  const srcH = sourceImage.height;

  let drawX = 0,
    drawY = 0,
    drawW = targetW,
    drawH = targetH;

  if (cropMode === "cover") {
    const scale = Math.max(targetW / srcW, targetH / srcH);
    drawW = srcW * scale;
    drawH = srcH * scale;
    drawX = (targetW - drawW) / 2;
    drawY = (targetH - drawH) / 2;
  } else if (cropMode === "contain") {
    const scale = Math.min(targetW / srcW, targetH / srcH);
    drawW = srcW * scale;
    drawH = srcH * scale;
    drawX = (targetW - drawW) / 2;
    drawY = (targetH - drawH) / 2;
  }

  // Draw with high quality smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(sourceImage, drawX, drawY, drawW, drawH);

  const imgData = ctx.getImageData(0, 0, targetW, targetH);
  const data = imgData.data;

  // Preprocessing: Brightness, Contrast, Saturation
  const bOffset = (brightness / 100) * 128;
  const cFactor = Math.tan(((contrast + 100) * Math.PI) / 400);
  const sFactor = (saturation + 100) / 100;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Brightness & Contrast
    r = (r - 128) * cFactor + 128 + bOffset;
    g = (g - 128) * cFactor + 128 + bOffset;
    b = (b - 128) * cFactor + 128 + bOffset;

    // Saturation
    if (sFactor !== 1) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray + (r - gray) * sFactor;
      g = gray + (g - gray) * sFactor;
      b = gray + (b - gray) * sFactor;
    }

    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }

  // Work arrays for error diffusion
  const rBuf = new Float32Array(targetW * targetH);
  const gBuf = new Float32Array(targetW * targetH);
  const bBuf = new Float32Array(targetW * targetH);

  for (let i = 0; i < targetW * targetH; i++) {
    const p = i * 4;
    rBuf[i] = data[p];
    gBuf[i] = data[p + 1];
    bBuf[i] = data[p + 2];
  }

  const grid: ShadedBlock[][] = Array.from({ length: targetH }, () => []);
  const heightMap: number[][] = Array.from({ length: targetH }, () => new Array(targetW).fill(0));
  const countsMap = new Map<string, number>();

  // Quantization loop
  for (let y = 0; y < targetH; y++) {
    for (let x = 0; x < targetW; x++) {
      const idx = y * targetW + x;

      let r = rBuf[idx];
      let g = gBuf[idx];
      let b = bBuf[idx];

      // Ordered Bayer dither pre-adjustment
      if (dither === "bayer2x2") {
        const threshold = (BAYER_2X2[y % 2][x % 2] / 4 - 0.5) * 36 * ditherStrength;
        r = Math.max(0, Math.min(255, r + threshold));
        g = Math.max(0, Math.min(255, g + threshold));
        b = Math.max(0, Math.min(255, b + threshold));
      } else if (dither === "bayer4x4") {
        const threshold = (BAYER_4X4[y % 4][x % 4] / 16 - 0.5) * 48 * ditherStrength;
        r = Math.max(0, Math.min(255, r + threshold));
        g = Math.max(0, Math.min(255, g + threshold));
        b = Math.max(0, Math.min(255, b + threshold));
      } else if (dither === "bayer8x8") {
        const threshold = (BAYER_8X8[y % 8][x % 8] / 64 - 0.5) * 56 * ditherStrength;
        r = Math.max(0, Math.min(255, r + threshold));
        g = Math.max(0, Math.min(255, g + threshold));
        b = Math.max(0, Math.min(255, b + threshold));
      }

      // Find nearest shaded block
      let bestBlock = shadedPalette[0];
      let minDist = Infinity;

      for (let p = 0; p < shadedPalette.length; p++) {
        const sb = shadedPalette[p];
        const dist = colorDistance(r, g, b, sb.rgb[0], sb.rgb[1], sb.rgb[2], colorMetric);
        if (dist < minDist) {
          minDist = dist;
          bestBlock = sb;
        }
      }

      grid[y][x] = bestBlock;
      countsMap.set(bestBlock.block.id, (countsMap.get(bestBlock.block.id) || 0) + 1);

      // Height map calculation for 3D staircased mode
      if (mode === "3d-staircased") {
        if (y === 0) {
          heightMap[y][x] = 1;
        } else {
          const northH = heightMap[y - 1][x];
          if (bestBlock.shade === 2) {
            // Bright: 1 block higher than north
            heightMap[y][x] = northH + 1;
          } else if (bestBlock.shade === 0) {
            // Dark: 1 block lower than north
            heightMap[y][x] = Math.max(0, northH - 1);
          } else {
            // Normal: same height
            heightMap[y][x] = northH;
          }
        }
      }

      // Output canvas pixel
      const outP = idx * 4;
      data[outP] = bestBlock.rgb[0];
      data[outP + 1] = bestBlock.rgb[1];
      data[outP + 2] = bestBlock.rgb[2];
      data[outP + 3] = 255;

      // Error diffusion
      const errR = (r - bestBlock.rgb[0]) * ditherStrength;
      const errG = (g - bestBlock.rgb[1]) * ditherStrength;
      const errB = (b - bestBlock.rgb[2]) * ditherStrength;

      if (dither === "floyd-steinberg") {
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x + 1, y, errR, errG, errB, 7 / 16);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x - 1, y + 1, errR, errG, errB, 3 / 16);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x, y + 1, errR, errG, errB, 5 / 16);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x + 1, y + 1, errR, errG, errB, 1 / 16);
      } else if (dither === "atkinson") {
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x + 1, y, errR, errG, errB, 1 / 8);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x + 2, y, errR, errG, errB, 1 / 8);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x - 1, y + 1, errR, errG, errB, 1 / 8);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x, y + 1, errR, errG, errB, 1 / 8);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x + 1, y + 1, errR, errG, errB, 1 / 8);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x, y + 2, errR, errG, errB, 1 / 8);
      } else if (dither === "burkes") {
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x + 1, y, errR, errG, errB, 8 / 32);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x + 2, y, errR, errG, errB, 4 / 32);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x - 2, y + 1, errR, errG, errB, 2 / 32);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x - 1, y + 1, errR, errG, errB, 4 / 32);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x, y + 1, errR, errG, errB, 8 / 32);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x + 1, y + 1, errR, errG, errB, 4 / 32);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x + 2, y + 1, errR, errG, errB, 2 / 32);
      } else if (dither === "stucki") {
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x + 1, y, errR, errG, errB, 8 / 42);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x + 2, y, errR, errG, errB, 4 / 42);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x - 2, y + 1, errR, errG, errB, 2 / 42);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x - 1, y + 1, errR, errG, errB, 4 / 42);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x, y + 1, errR, errG, errB, 8 / 42);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x + 1, y + 1, errR, errG, errB, 4 / 42);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x + 2, y + 1, errR, errG, errB, 2 / 42);
      } else if (dither === "sierra-lite") {
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x + 1, y, errR, errG, errB, 2 / 4);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x - 1, y + 1, errR, errG, errB, 1 / 4);
        distErr(rBuf, gBuf, bBuf, targetW, targetH, x, y + 1, errR, errG, errB, 1 / 4);
      }
    }
  }

  // Compile materials
  const materials: Array<{ block: MinecraftBlock; count: number; stacks: string }> = [];
  let totalBlocks = 0;

  for (const [id, count] of countsMap.entries()) {
    const block = rawPalette.find((b) => b.id === id) || MINECRAFT_BLOCKS.find((b) => b.id === id) || MINECRAFT_BLOCKS[0];
    totalBlocks += count;
    const fullStacks = Math.floor(count / 64);
    const rem = count % 64;
    const stackStr = fullStacks > 0 ? `${fullStacks} ст. + ${rem} шт.` : `${rem} шт.`;
    materials.push({ block, count, stacks: stackStr });
  }

  materials.sort((a, b) => b.count - a.count);

  return {
    width: targetW,
    height: targetH,
    imageData: imgData,
    grid,
    heightMap,
    materials,
    totalBlocks,
    mode,
  };
}

function distErr(
  rBuf: Float32Array,
  gBuf: Float32Array,
  bBuf: Float32Array,
  width: number,
  height: number,
  x: number,
  y: number,
  er: number,
  eg: number,
  eb: number,
  weight: number
) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const idx = y * width + x;
  rBuf[idx] += er * weight;
  gBuf[idx] += eg * weight;
  bBuf[idx] += eb * weight;
}

// Export Mapart to Gzipped .schematic file
export async function exportToSchematic(result: MapartResult): Promise<Uint8Array> {
  const { width, height, grid, heightMap, mode } = result;

  // Max elevation determines schematic Height
  let maxY = 1;
  if (mode === "3d-staircased") {
    for (let z = 0; z < height; z++) {
      for (let x = 0; x < width; x++) {
        if (heightMap[z][x] > maxY) maxY = heightMap[z][x];
      }
    }
    maxY += 2; // safety margin
  }

  const schWidth = width;
  const schHeight = maxY;
  const schLength = height;
  const totalVoxels = schWidth * schHeight * schLength;

  const blocks = new Uint8Array(totalVoxels);
  const data = new Uint8Array(totalVoxels);

  // Schematic coordinate ordering: (y * schLength + z) * schWidth + x
  for (let z = 0; z < height; z++) {
    for (let x = 0; x < width; x++) {
      const sb = grid[z][x];
      const yElev = mode === "3d-staircased" ? heightMap[z][x] : 0;
      const idx = (yElev * schLength + z) * schWidth + x;

      blocks[idx] = sb.block.legacyId;
      data[idx] = sb.block.legacyData;
    }
  }

  const rawNBT = createSchematicNBT(schWidth, schHeight, schLength, blocks, data);
  return await gzipCompress(rawNBT);
}
