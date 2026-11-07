export interface MinecraftBlock {
  id: string;
  name: string;
  rgb: [number, number, number];
  category: "survival" | "wool" | "concrete" | "terracotta" | "nether" | "special";
}

export const MINECRAFT_BLOCKS: MinecraftBlock[] = [
  // Survival & Basic
  { id: "minecraft:cobblestone", name: "Булыжник", rgb: [112, 112, 112], category: "survival" },
  { id: "minecraft:stone", name: "Камень", rgb: [125, 125, 125], category: "survival" },
  { id: "minecraft:dirt", name: "Земля", rgb: [151, 109, 77], category: "survival" },
  { id: "minecraft:sand", name: "Песок", rgb: [219, 211, 160], category: "survival" },
  { id: "minecraft:gravel", name: "Гравий", rgb: [136, 134, 134], category: "survival" },
  { id: "minecraft:oak_planks", name: "Дубовые доски", rgb: [162, 130, 78], category: "survival" },
  { id: "minecraft:birch_planks", name: "Берёзовые доски", rgb: [196, 179, 123], category: "survival" },
  { id: "minecraft:snow_block", name: "Снег", rgb: [249, 254, 254], category: "survival" },
  { id: "minecraft:obsidian", name: "Обсидиан", rgb: [20, 18, 29], category: "survival" },

  // Nether & End
  { id: "minecraft:netherrack", name: "Незерак", rgb: [111, 40, 42], category: "nether" },
  { id: "minecraft:end_stone", name: "Эндерняк", rgb: [221, 223, 165], category: "nether" },
  { id: "minecraft:blackstone", name: "Чернит", rgb: [42, 38, 46], category: "nether" },
  { id: "minecraft:soul_sand", name: "Песок душ", rgb: [81, 62, 50], category: "nether" },
  { id: "minecraft:warped_planks", name: "Искажённые доски", rgb: [43, 104, 99], category: "nether" },
  { id: "minecraft:crimson_planks", name: "Багровые доски", rgb: [101, 48, 70], category: "nether" },

  // Wool (Classic)
  { id: "minecraft:white_wool", name: "Белая шерсть", rgb: [233, 236, 236], category: "wool" },
  { id: "minecraft:orange_wool", name: "Оранжевая шерсть", rgb: [240, 118, 19], category: "wool" },
  { id: "minecraft:magenta_wool", name: "Пурпурная шерсть", rgb: [189, 68, 179], category: "wool" },
  { id: "minecraft:light_blue_wool", name: "Голубая шерсть", rgb: [58, 175, 217], category: "wool" },
  { id: "minecraft:yellow_wool", name: "Жёлтая шерсть", rgb: [248, 197, 39], category: "wool" },
  { id: "minecraft:lime_wool", name: "Лаймовая шерсть", rgb: [112, 185, 25], category: "wool" },
  { id: "minecraft:pink_wool", name: "Розовая шерсть", rgb: [237, 141, 172], category: "wool" },
  { id: "minecraft:gray_wool", name: "Серая шерсть", rgb: [62, 68, 71], category: "wool" },
  { id: "minecraft:light_gray_wool", name: "Светло-серая шерсть", rgb: [142, 142, 134], category: "wool" },
  { id: "minecraft:cyan_wool", name: "Бирюзовая шерсть", rgb: [21, 137, 145], category: "wool" },
  { id: "minecraft:purple_wool", name: "Фиолетовая шерсть", rgb: [121, 42, 172], category: "wool" },
  { id: "minecraft:blue_wool", name: "Синяя шерсть", rgb: [53, 57, 157], category: "wool" },
  { id: "minecraft:brown_wool", name: "Коричневая шерсть", rgb: [114, 71, 40], category: "wool" },
  { id: "minecraft:green_wool", name: "Зелёная шерсть", rgb: [84, 109, 27], category: "wool" },
  { id: "minecraft:red_wool", name: "Красная шерсть", rgb: [160, 39, 34], category: "wool" },
  { id: "minecraft:black_wool", name: "Чёрная шерсть", rgb: [20, 21, 25], category: "wool" },

  // Concrete (Vibrant)
  { id: "minecraft:white_concrete", name: "Белый бетон", rgb: [207, 213, 214], category: "concrete" },
  { id: "minecraft:orange_concrete", name: "Оранжевый бетон", rgb: [224, 97, 0], category: "concrete" },
  { id: "minecraft:magenta_concrete", name: "Пурпурный бетон", rgb: [169, 48, 159], category: "concrete" },
  { id: "minecraft:light_blue_concrete", name: "Голубой бетон", rgb: [35, 137, 199], category: "concrete" },
  { id: "minecraft:yellow_concrete", name: "Жёлтый бетон", rgb: [241, 175, 21], category: "concrete" },
  { id: "minecraft:lime_concrete", name: "Лаймовый бетон", rgb: [94, 169, 24], category: "concrete" },
  { id: "minecraft:pink_concrete", name: "Розовый бетон", rgb: [214, 101, 143], category: "concrete" },
  { id: "minecraft:gray_concrete", name: "Серый бетон", rgb: [54, 57, 61], category: "concrete" },
  { id: "minecraft:light_gray_concrete", name: "Светло-серый бетон", rgb: [125, 125, 115], category: "concrete" },
  { id: "minecraft:cyan_concrete", name: "Бирюзовый бетон", rgb: [21, 119, 136], category: "concrete" },
  { id: "minecraft:purple_concrete", name: "Фиолетовый бетон", rgb: [100, 31, 156], category: "concrete" },
  { id: "minecraft:blue_concrete", name: "Синий бетон", rgb: [44, 46, 143], category: "concrete" },
  { id: "minecraft:brown_concrete", name: "Коричневый бетон", rgb: [96, 59, 31], category: "concrete" },
  { id: "minecraft:green_concrete", name: "Зелёный бетон", rgb: [73, 91, 36], category: "concrete" },
  { id: "minecraft:red_concrete", name: "Красный бетон", rgb: [142, 32, 32], category: "concrete" },
  { id: "minecraft:black_concrete", name: "Чёрный бетон", rgb: [8, 10, 15], category: "concrete" },

  // Terracotta (Earthy)
  { id: "minecraft:terracotta", name: "Терракота", rgb: [152, 94, 67], category: "terracotta" },
  { id: "minecraft:white_terracotta", name: "Белая терракота", rgb: [209, 178, 161], category: "terracotta" },
  { id: "minecraft:orange_terracotta", name: "Оранжевая терракота", rgb: [161, 83, 37], category: "terracotta" },
  { id: "minecraft:yellow_terracotta", name: "Жёлтая терракота", rgb: [186, 133, 35], category: "terracotta" },
  { id: "minecraft:light_blue_terracotta", name: "Голубая терракота", rgb: [113, 108, 138], category: "terracotta" },
  { id: "minecraft:lime_terracotta", name: "Лаймовая терракота", rgb: [103, 117, 52], category: "terracotta" },
  { id: "minecraft:cyan_terracotta", name: "Бирюзовая терракота", rgb: [86, 91, 91], category: "terracotta" },
  { id: "minecraft:blue_terracotta", name: "Синяя терракота", rgb: [74, 59, 91], category: "terracotta" },
  { id: "minecraft:red_terracotta", name: "Красная терракота", rgb: [143, 61, 46], category: "terracotta" },

  // Special & Vibrant Accents
  { id: "minecraft:gold_block", name: "Золотой блок", rgb: [245, 206, 56], category: "special" },
  { id: "minecraft:diamond_block", name: "Алмазный блок", rgb: [92, 219, 213], category: "special" },
  { id: "minecraft:lapis_block", name: "Лазуритовый блок", rgb: [30, 67, 140], category: "special" },
  { id: "minecraft:emerald_block", name: "Изумрудный блок", rgb: [42, 203, 88], category: "special" },
  { id: "minecraft:amethyst_block", name: "Аметистовый блок", rgb: [133, 98, 168], category: "special" },
  { id: "minecraft:sculk", name: "Скальк", rgb: [11, 32, 39], category: "special" },
];

export type DitherAlgorithm = "none" | "floyd-steinberg" | "atkinson" | "bayer4x4";

export interface MapartResult {
  width: number;
  height: number;
  imageData: ImageData;
  grid: MinecraftBlock[][];
  materials: Array<{ block: MinecraftBlock; count: number; stacks: string }>;
  totalBlocks: number;
}

// Perceptual color distance (weighted Euclidean)
function colorDistSq(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  const rMean = (r1 + r2) / 2;
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;
  return (
    (((512 + rMean) * dr * dr) >> 8) +
    4 * dg * dg +
    (((767 - rMean) * db * db) >> 8)
  );
}

function findNearestBlock(r: number, g: number, b: number, palette: MinecraftBlock[]): MinecraftBlock {
  let best = palette[0];
  let minDistance = Infinity;

  for (let i = 0; i < palette.length; i++) {
    const block = palette[i];
    const dist = colorDistSq(r, g, b, block.rgb[0], block.rgb[1], block.rgb[2]);
    if (dist < minDistance) {
      minDistance = dist;
      best = block;
    }
  }

  return best;
}

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

export function processMapart(
  sourceCanvas: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number,
  palette: MinecraftBlock[],
  dither: DitherAlgorithm
): MapartResult {
  // Offscreen canvas for scaling
  const offscreen = document.createElement("canvas");
  offscreen.width = targetWidth;
  offscreen.height = targetHeight;
  const ctx = offscreen.getContext("2d");
  if (!ctx) throw new Error("Could not create 2D canvas context");

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);

  const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const data = imgData.data;

  // Buffer for dithering (working float copies of RGB)
  const rBuf = new Float32Array(targetWidth * targetHeight);
  const gBuf = new Float32Array(targetWidth * targetHeight);
  const bBuf = new Float32Array(targetWidth * targetHeight);

  for (let i = 0; i < targetWidth * targetHeight; i++) {
    const p = i * 4;
    rBuf[i] = data[p];
    gBuf[i] = data[p + 1];
    bBuf[i] = data[p + 2];
  }

  const grid: MinecraftBlock[][] = Array.from({ length: targetHeight }, () => []);
  const countsMap = new Map<string, number>();

  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const idx = y * targetWidth + x;

      let r = rBuf[idx];
      let g = gBuf[idx];
      let b = bBuf[idx];

      // Ordered Bayer dither pre-adjustment
      if (dither === "bayer4x4") {
        const threshold = (BAYER_4X4[y % 4][x % 4] / 16 - 0.5) * 48;
        r = Math.max(0, Math.min(255, r + threshold));
        g = Math.max(0, Math.min(255, g + threshold));
        b = Math.max(0, Math.min(255, b + threshold));
      }

      // Find best matching Minecraft block
      const chosen = findNearestBlock(r, g, b, palette);
      grid[y][x] = chosen;

      // Update counts
      countsMap.set(chosen.id, (countsMap.get(chosen.id) || 0) + 1);

      // Quantization error
      const errR = r - chosen.rgb[0];
      const errG = g - chosen.rgb[1];
      const errB = b - chosen.rgb[2];

      // Output pixel
      const outP = idx * 4;
      data[outP] = chosen.rgb[0];
      data[outP + 1] = chosen.rgb[1];
      data[outP + 2] = chosen.rgb[2];
      data[outP + 3] = 255;

      // Diffuse error
      if (dither === "floyd-steinberg") {
        distributeError(rBuf, gBuf, bBuf, targetWidth, targetHeight, x + 1, y, errR, errG, errB, 7 / 16);
        distributeError(rBuf, gBuf, bBuf, targetWidth, targetHeight, x - 1, y + 1, errR, errG, errB, 3 / 16);
        distributeError(rBuf, gBuf, bBuf, targetWidth, targetHeight, x, y + 1, errR, errG, errB, 5 / 16);
        distributeError(rBuf, gBuf, bBuf, targetWidth, targetHeight, x + 1, y + 1, errR, errG, errB, 1 / 16);
      } else if (dither === "atkinson") {
        distributeError(rBuf, gBuf, bBuf, targetWidth, targetHeight, x + 1, y, errR, errG, errB, 1 / 8);
        distributeError(rBuf, gBuf, bBuf, targetWidth, targetHeight, x + 2, y, errR, errG, errB, 1 / 8);
        distributeError(rBuf, gBuf, bBuf, targetWidth, targetHeight, x - 1, y + 1, errR, errG, errB, 1 / 8);
        distributeError(rBuf, gBuf, bBuf, targetWidth, targetHeight, x, y + 1, errR, errG, errB, 1 / 8);
        distributeError(rBuf, gBuf, bBuf, targetWidth, targetHeight, x + 1, y + 1, errR, errG, errB, 1 / 8);
        distributeError(rBuf, gBuf, bBuf, targetWidth, targetHeight, x, y + 2, errR, errG, errB, 1 / 8);
      }
    }
  }

  // Compile materials breakdown
  const materials: Array<{ block: MinecraftBlock; count: number; stacks: string }> = [];
  let totalBlocks = 0;

  for (const [id, count] of countsMap.entries()) {
    const block = palette.find((b) => b.id === id) || palette[0];
    totalBlocks += count;
    const fullStacks = Math.floor(count / 64);
    const rem = count % 64;
    const stackStr = fullStacks > 0 ? `${fullStacks} ст. + ${rem} шт.` : `${rem} шт.`;
    materials.push({ block, count, stacks: stackStr });
  }

  materials.sort((a, b) => b.count - a.count);

  return {
    width: targetWidth,
    height: targetHeight,
    imageData: imgData,
    grid,
    materials,
    totalBlocks,
  };
}

function distributeError(
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
