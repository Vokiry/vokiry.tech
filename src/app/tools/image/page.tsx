"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { playSound } from "@/lib/sound";

type ToolTab = "crop" | "resize" | "convert" | "meme" | "filters" | "ascii" | "animator";

const CATPPUCCIN_PALETTE = [
  [30, 30, 46],     // Base
  [49, 50, 68],     // Surface0
  [108, 112, 134],  // Overlay0
  [205, 214, 244],  // Text
  [203, 166, 247],  // Mauve
  [243, 139, 168],  // Red
  [250, 179, 135],  // Peach
  [249, 226, 175],  // Yellow
  [166, 227, 161],  // Green
  [148, 226, 213],  // Teal
  [116, 199, 236],  // Sapphire
];

const GAMEBOY_PALETTE = [
  [15, 56, 15],
  [48, 98, 48],
  [139, 172, 15],
  [155, 188, 15],
];

export default function ImageToolsPage() {
  const [activeTab, setActiveTab] = useState<ToolTab>("convert");
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [canvasDimensions, setCanvasDimensions] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  // Rotate & Flip
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // Resize settings
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [keepAspect, setKeepAspect] = useState<boolean>(true);
  const [pixelatedScale, setPixelatedScale] = useState<boolean>(false);

  // Crop settings
  const [cropAspect, setCropAspect] = useState<string>("free"); // free, 1:1, 16:9, 4:3, 9:16
  const [cropBox, setCropBox] = useState<{ x: number; y: number; w: number; h: number }>({ x: 0, y: 0, w: 0, h: 0 });

  // Convert & Compress settings
  const [targetFormat, setTargetFormat] = useState<string>("image/webp");
  const [quality, setQuality] = useState<number>(85);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);

  // Meme / Text Overlay
  const [topText, setTopText] = useState<string>("");
  const [bottomText, setBottomText] = useState<string>("");
  const [watermarkText, setWatermarkText] = useState<string>("");
  const [memeFontSize, setMemeFontSize] = useState<number>(36);
  const [memeFontFamily, setMemeFontFamily] = useState<string>("Impact");

  // Filters & Retro FX
  const [pixelateSize, setPixelateSize] = useState<number>(0);
  const [grayscale, setGrayscale] = useState<boolean>(false);
  const [invert, setInvert] = useState<boolean>(false);
  const [catppuccinRemap, setCatppuccinRemap] = useState<boolean>(false);
  const [gameboyRemap, setGameboyRemap] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);

  // ASCII Generator
  const [asciiWidth, setAsciiWidth] = useState<number>(64);
  const [asciiCharsType, setAsciiCharsType] = useState<"standard" | "blocks" | "minimal">("standard");
  const [asciiInvert, setAsciiInvert] = useState<boolean>(false);
  const [asciiResult, setAsciiResult] = useState<string>("");
  const [copiedAscii, setCopiedAscii] = useState<boolean>(false);

  // Multi-frame Animator
  const [animFrames, setAnimFrames] = useState<HTMLImageElement[]>([]);
  const [animDelay, setAnimDelay] = useState<number>(150); // ms per frame
  const [animPlaying, setAnimPlaying] = useState<boolean>(false);
  const [currentFrameIdx, setCurrentFrameIdx] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        sourceImageRef.current = img;
        setCanvasDimensions({ w: img.width, h: img.height });
        setTargetWidth(img.width);
        setTargetHeight(img.height);
        setCropBox({ x: 0, y: 0, w: img.width, h: img.height });
        setImageLoaded(true);
        playSound("success");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleMultiFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const loadedImgs: HTMLImageElement[] = [];
    let count = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          loadedImgs.push(img);
          count++;
          if (count === files.length) {
            setAnimFrames(loadedImgs);
            setAnimPlaying(true);
            playSound("success");
          }
        };
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Animator loop
  useEffect(() => {
    if (!animPlaying || animFrames.length < 2) return;
    const interval = setInterval(() => {
      setCurrentFrameIdx((idx) => (idx + 1) % animFrames.length);
    }, animDelay);
    return () => clearInterval(interval);
  }, [animPlaying, animFrames, animDelay]);

  // Main Render Pipeline
  useEffect(() => {
    if (!imageLoaded || !sourceImageRef.current || !canvasRef.current) return;
    const img = sourceImageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Dimensions
    const w = targetWidth || img.width;
    const h = targetHeight || img.height;

    // Account for 90 or 270 deg rotation
    const isSideways = rotation === 90 || rotation === 270;
    canvas.width = isSideways ? h : w;
    canvas.height = isSideways ? w : h;

    ctx.save();
    ctx.imageSmoothingEnabled = !pixelatedScale;

    // Apply rotation & flip
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.restore();

    // Pixelate Filter
    if (pixelateSize > 1) {
      const pW = canvas.width;
      const pH = canvas.height;
      const smallW = Math.max(1, Math.floor(pW / pixelateSize));
      const smallH = Math.max(1, Math.floor(pH / pixelateSize));
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = smallW;
      tempCanvas.height = smallH;
      const tCtx = tempCanvas.getContext("2d");
      if (tCtx) {
        tCtx.drawImage(canvas, 0, 0, smallW, smallH);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tempCanvas, 0, 0, smallW, smallH, 0, 0, pW, pH);
      }
    }

    // Color adjustments & Palettes
    if (grayscale || invert || catppuccinRemap || gameboyRemap || brightness !== 0 || contrast !== 0) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      const cFactor = Math.tan(((contrast + 100) * Math.PI) / 400);
      const bOffset = (brightness / 100) * 128;

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Brightness & Contrast
        if (brightness !== 0 || contrast !== 0) {
          r = (r - 128) * cFactor + 128 + bOffset;
          g = (g - 128) * cFactor + 128 + bOffset;
          b = (b - 128) * cFactor + 128 + bOffset;
        }

        // Grayscale
        if (grayscale) {
          const avg = 0.299 * r + 0.587 * g + 0.114 * b;
          r = avg;
          g = avg;
          b = avg;
        }

        // Invert
        if (invert) {
          r = 255 - r;
          g = 255 - g;
          b = 255 - b;
        }

        // Catppuccin Remap
        if (catppuccinRemap) {
          let minD = Infinity;
          let best = CATPPUCCIN_PALETTE[0];
          for (let p = 0; p < CATPPUCCIN_PALETTE.length; p++) {
            const c = CATPPUCCIN_PALETTE[p];
            const d = (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
            if (d < minD) {
              minD = d;
              best = c;
            }
          }
          r = best[0];
          g = best[1];
          b = best[2];
        }

        // GameBoy 4-color Remap
        if (gameboyRemap) {
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          const idx = Math.min(3, Math.floor(lum / 64));
          const c = GAMEBOY_PALETTE[idx];
          r = c[0];
          g = c[1];
          b = c[2];
        }

        data[i] = Math.max(0, Math.min(255, r));
        data[i + 1] = Math.max(0, Math.min(255, g));
        data[i + 2] = Math.max(0, Math.min(255, b));
      }
      ctx.putImageData(imgData, 0, 0);
    }

    // Meme / Watermark Text Overlay
    if (topText || bottomText || watermarkText) {
      ctx.save();
      ctx.font = `900 ${memeFontSize}px ${memeFontFamily}, sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = Math.max(2, Math.floor(memeFontSize / 8));
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (topText) {
        ctx.strokeText(topText.toUpperCase(), canvas.width / 2, memeFontSize + 10);
        ctx.fillText(topText.toUpperCase(), canvas.width / 2, memeFontSize + 10);
      }

      if (bottomText) {
        ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - memeFontSize - 10);
        ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - memeFontSize - 10);
      }

      if (watermarkText) {
        ctx.font = `600 14px monospace`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
        ctx.lineWidth = 2;
        ctx.textAlign = "right";
        ctx.strokeText(watermarkText, canvas.width - 15, canvas.height - 15);
        ctx.fillText(watermarkText, canvas.width - 15, canvas.height - 15);
      }
      ctx.restore();
    }

    // Convert to target format blob for compression stats
    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCompressedSize(blob.size);
          const url = URL.createObjectURL(blob);
          setCompressedUrl(url);
        }
      },
      targetFormat,
      quality / 100
    );

    // ASCII generation
    if (activeTab === "ascii") {
      generateAscii(canvas);
    }
  }, [
    imageLoaded,
    targetWidth,
    targetHeight,
    rotation,
    flipH,
    flipV,
    pixelatedScale,
    pixelateSize,
    grayscale,
    invert,
    catppuccinRemap,
    gameboyRemap,
    brightness,
    contrast,
    topText,
    bottomText,
    watermarkText,
    memeFontSize,
    memeFontFamily,
    targetFormat,
    quality,
    activeTab,
    asciiWidth,
    asciiCharsType,
    asciiInvert,
  ]);

  const generateAscii = (canvas: HTMLCanvasElement) => {
    const charSets = {
      standard: "@%#*+=-:. ",
      blocks: "██▓▓▒▒░░  ",
      minimal: "##++..  ",
    };
    const chars = charSets[asciiCharsType];

    const aspectRatio = canvas.height / canvas.width;
    const aWidth = asciiWidth;
    const aHeight = Math.floor(aWidth * aspectRatio * 0.45);

    const off = document.createElement("canvas");
    off.width = aWidth;
    off.height = aHeight;
    const ctx = off.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(canvas, 0, 0, aWidth, aHeight);
    const data = ctx.getImageData(0, 0, aWidth, aHeight).data;

    let ascii = "";
    for (let y = 0; y < aHeight; y++) {
      let line = "";
      for (let x = 0; x < aWidth; x++) {
        const i = (y * aWidth + x) * 4;
        let brightnessVal = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
        if (asciiInvert) brightnessVal = 1 - brightnessVal;
        const charIdx = Math.floor((1 - brightnessVal) * (chars.length - 1));
        line += chars[charIdx] || " ";
      }
      ascii += line + "\n";
    }
    setAsciiResult(ascii);
  };

  const applyCrop = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y, w, h } = cropBox;
    if (w <= 0 || h <= 0) return;

    const croppedData = ctx.getImageData(x, y, w, h);
    canvas.width = w;
    canvas.height = h;
    ctx.putImageData(croppedData, 0, 0);

    // Save as new source image
    const newImg = new Image();
    newImg.onload = () => {
      sourceImageRef.current = newImg;
      setTargetWidth(w);
      setTargetHeight(h);
      setCropBox({ x: 0, y: 0, w, h });
      playSound("success");
    };
    newImg.src = canvas.toDataURL();
  };

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (keepAspect && canvasDimensions.w > 0) {
      const ratio = canvasDimensions.h / canvasDimensions.w;
      setTargetHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (keepAspect && canvasDimensions.h > 0) {
      const ratio = canvasDimensions.w / canvasDimensions.h;
      setTargetWidth(Math.round(val * ratio));
    }
  };

  const handleDownload = () => {
    if (!compressedUrl) return;
    const ext = targetFormat.replace("image/", "");
    const a = document.createElement("a");
    a.download = `vokiry_processed.${ext === "jpeg" ? "jpg" : ext}`;
    a.href = compressedUrl;
    a.click();
    playSound("click");
  };

  const copyAscii = () => {
    navigator.clipboard.writeText(asciiResult);
    setCopiedAscii(true);
    playSound("click");
    setTimeout(() => setCopiedAscii(false), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* --------------------------------------------------------------------
          Header
          -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 font-mono text-xs text-ctp-subtext0">
          <Link href="/tools" className="text-ctp-mauve hover:underline">
            ← ~/верстак
          </Link>
          <span className="text-ctp-overlay0">//</span>
          <span className="tui-chip aug-br text-ctp-peach">[ IMAGE_LAB // FULL_SUITE ]</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-ctp-text">
              Мастерская изображений (Ezgif Suite)
            </h1>
            <p className="text-base text-ctp-subtext0 mt-2 max-w-2xl leading-relaxed">
              Комплексный веб-комбайн для медиа: умное сжатие WebP/AVIF, кадрирование и поворот, 
              пикселизация 8-бит, палитра Catppuccin, создание мемов и анимаций из кадров.
            </p>
          </div>

          <div className="font-mono text-xs text-ctp-overlay1">
            <span>CLIENT_SIDE_ONLY // ZERO_DATA_LEAK</span>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Main Layout
          -------------------------------------------------------------------- */}
      <section className="grid lg:grid-cols-12 gap-6">
        {/* Controls Column (5 cols) */}
        <div className="panel-card aug-br p-6 space-y-6 lg:col-span-5 max-h-[85vh] overflow-y-auto">
          {/* Upload Button */}
          <div className="space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 aug-br font-mono text-xs font-semibold bg-ctp-mauve text-ctp-base hover:opacity-90 transition-opacity cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              <span>📁 {imageLoaded ? "Загрузить другое фото" : "Выбрать изображение"}</span>
            </button>
          </div>

          {/* Module Tabs (Ezgif tools) */}
          <div className="grid grid-cols-3 gap-1.5 font-mono text-xs border-b border-[var(--border-subtle)] pb-4">
            {[
              { id: "convert", label: "Сжатие/Формат" },
              { id: "crop", label: "Кадрировать" },
              { id: "resize", label: "Размер/Скейл" },
              { id: "meme", label: "Мем / Текст" },
              { id: "filters", label: "Ретро / Фильтры" },
              { id: "ascii", label: "ASCII Арт" },
              { id: "animator", label: "GIF Аниматор" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as ToolTab);
                  playSound("hover");
                }}
                className={`p-2 text-center border transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "border-ctp-peach bg-ctp-peach/15 text-ctp-peach font-semibold"
                    : "border-[var(--border)] bg-[var(--bg-secondary)] text-ctp-subtext0 hover:text-ctp-text"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Convert & Compress */}
          {activeTab === "convert" && (
            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-ctp-subtext0">Формат экспорта:</label>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value)}
                  className="w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-ctp-text font-mono text-xs"
                >
                  <option value="image/webp">WebP (Рекомендуемый, малый вес)</option>
                  <option value="image/avif">AVIF (Максимальное сжатие нового поколения)</option>
                  <option value="image/png">PNG (Без потерь)</option>
                  <option value="image/jpeg">JPEG (Фото)</option>
                </select>
              </div>

              {targetFormat !== "image/png" && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-ctp-subtext0">Качество сжатия:</span>
                    <span className="text-ctp-teal font-bold">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-ctp-teal"
                  />
                </div>
              )}

              {/* Compression stats box */}
              {originalFile && compressedSize && (
                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 aug-br">
                  <div className="text-[11px] text-ctp-overlay0">// РЕЗУЛЬТАТ ОПТИМИЗАЦИИ:</div>
                  <div className="flex justify-between">
                    <span className="text-ctp-subtext0">Исходный вес:</span>
                    <span className="text-ctp-text">{formatSize(originalFile.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ctp-subtext0">Сжатый вес:</span>
                    <span className="text-ctp-green font-bold">{formatSize(compressedSize)}</span>
                  </div>
                  {compressedSize < originalFile.size && (
                    <div className="text-[11px] text-ctp-teal">
                      Экономия: {(100 - (compressedSize / originalFile.size) * 100).toFixed(1)}% трафика!
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Crop & Rotate */}
          {activeTab === "crop" && (
            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-2">
                <label className="text-ctp-subtext0">Поворот и отражение:</label>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="p-2 border border-[var(--border)] bg-ctp-surface0 hover:border-ctp-mauve"
                  >
                    ↷ +90°
                  </button>
                  <button
                    onClick={() => setRotation((r) => (r + 270) % 360)}
                    className="p-2 border border-[var(--border)] bg-ctp-surface0 hover:border-ctp-mauve"
                  >
                    ↶ -90°
                  </button>
                  <button
                    onClick={() => setFlipH(!flipH)}
                    className={`p-2 border ${flipH ? "border-ctp-mauve bg-ctp-mauve/15" : "border-[var(--border)]"}`}
                  >
                    ⇄ По X
                  </button>
                  <button
                    onClick={() => setFlipV(!flipV)}
                    className={`p-2 border ${flipV ? "border-ctp-mauve bg-ctp-mauve/15" : "border-[var(--border)]"}`}
                  >
                    ⇅ По Y
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                <label className="text-ctp-subtext0">Кадрирование (Crop):</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-ctp-overlay0">X отступ:</span>
                    <input
                      type="number"
                      value={cropBox.x}
                      onChange={(e) => setCropBox({ ...cropBox, x: Math.max(0, Number(e.target.value)) })}
                      className="w-full p-1.5 bg-[var(--bg-secondary)] border border-[var(--border)] text-xs mt-1"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-ctp-overlay0">Y отступ:</span>
                    <input
                      type="number"
                      value={cropBox.y}
                      onChange={(e) => setCropBox({ ...cropBox, y: Math.max(0, Number(e.target.value)) })}
                      className="w-full p-1.5 bg-[var(--bg-secondary)] border border-[var(--border)] text-xs mt-1"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-ctp-overlay0">Ширина обрезки:</span>
                    <input
                      type="number"
                      value={cropBox.w}
                      onChange={(e) => setCropBox({ ...cropBox, w: Math.max(10, Number(e.target.value)) })}
                      className="w-full p-1.5 bg-[var(--bg-secondary)] border border-[var(--border)] text-xs mt-1"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-ctp-overlay0">Высота обрезки:</span>
                    <input
                      type="number"
                      value={cropBox.h}
                      onChange={(e) => setCropBox({ ...cropBox, h: Math.max(10, Number(e.target.value)) })}
                      className="w-full p-1.5 bg-[var(--bg-secondary)] border border-[var(--border)] text-xs mt-1"
                    />
                  </div>
                </div>

                <button
                  onClick={applyCrop}
                  className="w-full py-2 aug-br font-mono text-xs font-semibold bg-ctp-peach text-ctp-base hover:opacity-90 transition-opacity cursor-pointer mt-2"
                >
                  ✂ Применить кадрирование
                </button>
              </div>
            </div>
          )}

          {/* Tab 3: Resize & Scale */}
          {activeTab === "resize" && (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-ctp-subtext0">Ширина (px):</label>
                  <input
                    type="number"
                    value={targetWidth}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-ctp-text font-mono text-xs mt-1"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-ctp-subtext0">Высота (px):</label>
                  <input
                    type="number"
                    value={targetHeight}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-ctp-text font-mono text-xs mt-1"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keepAspect}
                    onChange={(e) => setKeepAspect(e.target.checked)}
                    className="accent-ctp-mauve"
                  />
                  <span>Сохранять пропорции (Aspect ratio)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pixelatedScale}
                    onChange={(e) => setPixelatedScale(e.target.checked)}
                    className="accent-ctp-mauve"
                  />
                  <span>Пиксельный скейл (Nearest-Neighbor)</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                {[0.25, 0.5, 0.75, 1, 2].map((factor) => (
                  <button
                    key={factor}
                    onClick={() => {
                      handleWidthChange(Math.round(canvasDimensions.w * factor));
                      playSound("click");
                    }}
                    className="flex-1 py-1 text-[11px] border border-[var(--border)] bg-ctp-surface0 hover:border-ctp-mauve transition-colors"
                  >
                    {factor * 100}%
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Meme & Text Overlay */}
          {activeTab === "meme" && (
            <div className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-ctp-subtext0">Верхний текст:</label>
                <input
                  type="text"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                  placeholder="КОГДА ЗАПУСТИЛ КОД В ПРОД..."
                  className="w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-ctp-text text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ctp-subtext0">Нижний текст:</label>
                <input
                  type="text"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                  placeholder="И ОНО ЗАРАБОТАЛО"
                  className="w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-ctp-text text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-ctp-subtext0">Водяной знак / подпись:</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="vokiry.tech"
                  className="w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-ctp-text text-xs"
                />
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex justify-between">
                  <span className="text-ctp-subtext0">Размер шрифта:</span>
                  <span className="text-ctp-peach font-bold">{memeFontSize}px</span>
                </div>
                <input
                  type="range"
                  min={16}
                  max={72}
                  value={memeFontSize}
                  onChange={(e) => setMemeFontSize(Number(e.target.value))}
                  className="w-full accent-ctp-peach"
                />
              </div>
            </div>
          )}

          {/* Tab 5: Retro Filters & Palettes */}
          {activeTab === "filters" && (
            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-ctp-subtext0">Пикселизация (8-бит):</span>
                  <span className="text-ctp-peach font-bold">{pixelateSize} px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={pixelateSize}
                  onChange={(e) => setPixelateSize(Number(e.target.value))}
                  className="w-full accent-ctp-peach"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => {
                    setCatppuccinRemap(!catppuccinRemap);
                    if (!catppuccinRemap) setGameboyRemap(false);
                  }}
                  className={`w-full p-2 text-left border aug-br transition-colors ${
                    catppuccinRemap
                      ? "border-ctp-mauve bg-ctp-mauve/15 text-ctp-mauve font-semibold"
                      : "border-[var(--border)] bg-[var(--bg-secondary)] text-ctp-subtext0"
                  }`}
                >
                  {catppuccinRemap ? "✓" : "○"} Catppuccin Mocha Palette Remap
                </button>

                <button
                  onClick={() => {
                    setGameboyRemap(!gameboyRemap);
                    if (!gameboyRemap) setCatppuccinRemap(false);
                  }}
                  className={`w-full p-2 text-left border aug-br transition-colors ${
                    gameboyRemap
                      ? "border-ctp-green bg-ctp-green/15 text-ctp-green font-semibold"
                      : "border-[var(--border)] bg-[var(--bg-secondary)] text-ctp-subtext0"
                  }`}
                >
                  {gameboyRemap ? "✓" : "○"} Ретро GameBoy (4 оттенка зелёного)
                </button>

                <button
                  onClick={() => setGrayscale(!grayscale)}
                  className={`w-full p-2 text-left border aug-br transition-colors ${
                    grayscale
                      ? "border-ctp-teal bg-ctp-teal/15 text-ctp-teal font-semibold"
                      : "border-[var(--border)] bg-[var(--bg-secondary)] text-ctp-subtext0"
                  }`}
                >
                  {grayscale ? "✓" : "○"} Монохром (Grayscale)
                </button>

                <button
                  onClick={() => setInvert(!invert)}
                  className={`w-full p-2 text-left border aug-br transition-colors ${
                    invert
                      ? "border-ctp-red bg-ctp-red/15 text-ctp-red font-semibold"
                      : "border-[var(--border)] bg-[var(--bg-secondary)] text-ctp-subtext0"
                  }`}
                >
                  {invert ? "✓" : "○"} Инверсия цветов (Negative)
                </button>
              </div>
            </div>
          )}

          {/* Tab 6: ASCII Art Generator */}
          {activeTab === "ascii" && (
            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-ctp-subtext0">Ширина ASCII (символов):</span>
                  <span className="text-ctp-teal font-bold">{asciiWidth}</span>
                </div>
                <input
                  type="range"
                  min={32}
                  max={140}
                  step={4}
                  value={asciiWidth}
                  onChange={(e) => setAsciiWidth(Number(e.target.value))}
                  className="w-full accent-ctp-teal"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-ctp-subtext0">Набор символов:</label>
                <select
                  value={asciiCharsType}
                  onChange={(e) => setAsciiCharsType(e.target.value as any)}
                  className="w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-ctp-text font-mono text-xs"
                >
                  <option value="standard">Стандартный (@%#*+=-:. )</option>
                  <option value="blocks">Блочный (██▓▓▒▒░░ )</option>
                  <option value="minimal">Минималистичный (##++.. )</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={asciiInvert}
                  onChange={(e) => setAsciiInvert(e.target.checked)}
                  className="accent-ctp-teal"
                />
                <span>Инвертировать контраст</span>
              </label>

              {asciiResult && (
                <button
                  onClick={copyAscii}
                  className="w-full py-2 aug-br bg-ctp-teal text-ctp-base font-semibold hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                >
                  {copiedAscii ? "✓ ASCII скопирован!" : "[ Скопировать ASCII текст ]"}
                </button>
              )}
            </div>
          )}

          {/* Tab 7: Multi-frame Animator */}
          {activeTab === "animator" && (
            <div className="space-y-4 font-mono text-xs">
              <input
                type="file"
                ref={multiFileInputRef}
                onChange={handleMultiFilesChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              <button
                onClick={() => multiFileInputRef.current?.click()}
                className="w-full py-2.5 px-3 aug-br border border-ctp-peach text-ctp-peach hover:bg-ctp-peach/10 font-semibold cursor-pointer"
              >
                🎬 Загрузить пачку кадров ({animFrames.length} загружено)
              </button>

              {animFrames.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <span>Скорость (задержка кадра):</span>
                    <span className="text-ctp-peach font-bold">{animDelay} мс</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={500}
                    step={10}
                    value={animDelay}
                    onChange={(e) => setAnimDelay(Number(e.target.value))}
                    className="w-full accent-ctp-peach"
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAnimPlaying(!animPlaying)}
                      className="flex-1 py-1.5 aug-br bg-ctp-surface1 border border-[var(--border)]"
                    >
                      {animPlaying ? "⏸ Пауза" : "▶ Воспроизведение"}
                    </button>
                    <span className="text-ctp-overlay1">
                      Кадр {currentFrameIdx + 1} / {animFrames.length}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Download Output */}
          {imageLoaded && (
            <div className="pt-2">
              <button
                onClick={handleDownload}
                className="w-full py-3 aug-br font-mono text-xs font-semibold bg-ctp-teal text-ctp-base hover:opacity-90 transition-opacity cursor-pointer shadow-xs flex items-center justify-center gap-2 hover:shadow-[0_0_12px_rgba(148,226,213,0.35)]"
              >
                <span>💾 Скачать результат ({targetFormat.replace("image/", "").toUpperCase()})</span>
              </button>
            </div>
          )}
        </div>

        {/* Viewport Column (7 cols) */}
        <div className="panel-sharp aug-br p-6 space-y-4 lg:col-span-7 flex flex-col justify-between bg-[var(--bg-secondary)]">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)] font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-ctp-peach font-bold">&gt;_</span>
              <span>ПРЕВЬЮ ХОЛСТА</span>
              {canvasDimensions.w > 0 && (
                <span className="text-ctp-overlay0">
                  [{canvasDimensions.w}×{canvasDimensions.h} → {targetWidth}×{targetHeight}]
                </span>
              )}
            </div>

            {compressedSize && (
              <span className="text-ctp-green font-mono font-semibold">
                Размер: {formatSize(compressedSize)}
              </span>
            )}
          </div>

          {/* Viewport Canvas */}
          <div className="flex-1 min-h-[420px] max-h-[620px] flex items-center justify-center bg-black/50 border border-[var(--border)] p-4 overflow-auto">
            {!imageLoaded && animFrames.length === 0 ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="text-center font-mono text-xs text-ctp-overlay0 space-y-3 cursor-pointer p-10 border border-dashed border-[var(--border)] hover:border-ctp-peach transition-colors"
              >
                <div className="text-4xl">🎨</div>
                <div className="text-sm font-semibold text-ctp-text">Перетащите картинку сюда для обработки</div>
                <div className="text-[11px] text-ctp-overlay1">
                  Сжатие, фильтры, мемы и генерация ASCII происходят локально в браузере
                </div>
              </div>
            ) : activeTab === "animator" && animFrames.length > 0 ? (
              <img
                src={animFrames[currentFrameIdx]?.src}
                alt="Animation Frame"
                className="max-w-full max-h-[500px] shadow-lg border border-[var(--border-subtle)] object-contain"
              />
            ) : activeTab === "ascii" && asciiResult ? (
              <pre className="font-mono text-[9px] leading-[8px] tracking-tighter text-ctp-text whitespace-pre overflow-auto max-h-[520px] max-w-full select-all">
                {asciiResult}
              </pre>
            ) : (
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[520px] shadow-lg border border-[var(--border-subtle)]"
              />
            )}
          </div>

          <div className="text-[11px] font-mono text-ctp-overlay1 pt-1 flex items-center justify-between">
            <span>// МЕДИА-ЛАБОРАТОРИЯ VOKIRY.TECH</span>
            <span>HIGH-PERFORMANCE CLIENT CANVAS</span>
          </div>
        </div>
      </section>
    </div>
  );
}
