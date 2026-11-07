"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { playSound } from "@/lib/sound";

type ToolTab = "resize" | "convert" | "filters" | "ascii";

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

export default function ImageToolsPage() {
  const [activeTab, setActiveTab] = useState<ToolTab>("convert");
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  // Resize settings
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [keepAspect, setKeepAspect] = useState<boolean>(true);
  const [pixelatedScale, setPixelatedScale] = useState<boolean>(false);

  // Convert & Compress settings
  const [targetFormat, setTargetFormat] = useState<string>("image/webp");
  const [quality, setQuality] = useState<number>(85);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);

  // Filters
  const [pixelateSize, setPixelateSize] = useState<number>(0);
  const [grayscale, setGrayscale] = useState<boolean>(false);
  const [invert, setInvert] = useState<boolean>(false);
  const [catppuccinRemap, setCatppuccinRemap] = useState<boolean>(false);

  // ASCII Generator
  const [asciiWidth, setAsciiWidth] = useState<number>(64);
  const [asciiCharsType, setAsciiCharsType] = useState<"standard" | "blocks" | "minimal">("standard");
  const [asciiResult, setAsciiResult] = useState<string>("");
  const [copiedAscii, setCopiedAscii] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
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
        setOriginalDimensions({ w: img.width, h: img.height });
        setTargetWidth(img.width);
        setTargetHeight(img.height);
        setImageLoaded(true);
        playSound("success");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Update canvas output whenever parameters change
  useEffect(() => {
    if (!imageLoaded || !sourceImageRef.current || !canvasRef.current) return;
    const img = sourceImageRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = targetWidth || img.width;
    const h = targetHeight || img.height;
    canvas.width = w;
    canvas.height = h;

    ctx.imageSmoothingEnabled = !pixelatedScale;
    ctx.drawImage(img, 0, 0, w, h);

    // Apply pixelate if enabled
    if (pixelateSize > 1) {
      const smallW = Math.max(1, Math.floor(w / pixelateSize));
      const smallH = Math.max(1, Math.floor(h / pixelateSize));
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = smallW;
      tempCanvas.height = smallH;
      const tCtx = tempCanvas.getContext("2d");
      if (tCtx) {
        tCtx.drawImage(canvas, 0, 0, smallW, smallH);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tempCanvas, 0, 0, smallW, smallH, 0, 0, w, h);
      }
    }

    // Pixel processing for Grayscale / Invert / Catppuccin remap
    if (grayscale || invert || catppuccinRemap) {
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        if (grayscale) {
          const avg = 0.299 * r + 0.587 * g + 0.114 * b;
          r = avg;
          g = avg;
          b = avg;
        }

        if (invert) {
          r = 255 - r;
          g = 255 - g;
          b = 255 - b;
        }

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

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
      }
      ctx.putImageData(imgData, 0, 0);
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

    // Generate ASCII if on ascii tab
    if (activeTab === "ascii") {
      generateAscii(canvas);
    }
  }, [
    imageLoaded,
    targetWidth,
    targetHeight,
    pixelatedScale,
    pixelateSize,
    grayscale,
    invert,
    catppuccinRemap,
    targetFormat,
    quality,
    activeTab,
    asciiWidth,
    asciiCharsType,
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
    const aHeight = Math.floor(aWidth * aspectRatio * 0.45); // Font line-height compensation

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
        const brightness = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
        const charIdx = Math.floor((1 - brightness) * (chars.length - 1));
        line += chars[charIdx] || " ";
      }
      ascii += line + "\n";
    }
    setAsciiResult(ascii);
  };

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (keepAspect && originalDimensions.w > 0) {
      const ratio = originalDimensions.h / originalDimensions.w;
      setTargetHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (keepAspect && originalDimensions.h > 0) {
      const ratio = originalDimensions.w / originalDimensions.h;
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* --------------------------------------------------------------------
          Header
          -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 font-mono text-xs text-ctp-subtext0">
          <Link href="/tools" className="text-ctp-mauve hover:underline">
            ← ~/верстак
          </Link>
          <span className="text-ctp-overlay0">//</span>
          <span className="tui-chip aug-br text-ctp-peach">[ IMAGE_LAB // EZGIF_STYLE ]</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-ctp-text">
              Мастерская изображений
            </h1>
            <p className="text-base text-ctp-subtext0 mt-2 max-w-2xl leading-relaxed">
              Инструменты обработки медиа в духе Ezgif прямо в браузере: сжатие WebP/AVIF, 
              пикселизация, масштабирование, Catppuccin-фильтры и генерация ASCII-арта.
            </p>
          </div>

          <div className="font-mono text-xs text-ctp-overlay1">
            <span>CLIENT_SIDE // PRIVACY_FIRST</span>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Main Workspace
          -------------------------------------------------------------------- */}
      <section className="grid lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="panel-card aug-br p-6 space-y-6 lg:col-span-1">
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

          {/* Module Tabs */}
          <div className="grid grid-cols-2 gap-1.5 font-mono text-xs border-b border-[var(--border-subtle)] pb-4">
            {[
              { id: "convert", label: "Конвертер / Сжатие" },
              { id: "resize", label: "Размер / Скейл" },
              { id: "filters", label: "Фильтры / Ретро" },
              { id: "ascii", label: "ASCII Арт" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as ToolTab);
                  playSound("hover");
                }}
                className={`p-2 text-center border transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "border-ctp-mauve bg-ctp-mauve/10 text-ctp-mauve font-semibold"
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
                  <option value="image/png">PNG (Без потерь)</option>
                  <option value="image/jpeg">JPEG (Фото)</option>
                  <option value="image/avif">AVIF (Максимальное сжатие)</option>
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
                    className="w-full accent-ctp-mauve"
                  />
                </div>
              )}

              {/* Compression stats box */}
              {originalFile && compressedSize && (
                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2 aug-br">
                  <div className="text-[11px] text-ctp-overlay0">// РЕЗУЛЬТАТ СЖАТИЯ:</div>
                  <div className="flex justify-between">
                    <span className="text-ctp-subtext0">Исходный вес:</span>
                    <span className="text-ctp-text">{formatSize(originalFile.size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ctp-subtext0">Новый вес:</span>
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

          {/* Tab 2: Resize & Scale */}
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
                {[0.5, 0.75, 1, 2].map((factor) => (
                  <button
                    key={factor}
                    onClick={() => {
                      handleWidthChange(Math.round(originalDimensions.w * factor));
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

          {/* Tab 3: Filters & Retro */}
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
                  max={32}
                  value={pixelateSize}
                  onChange={(e) => setPixelateSize(Number(e.target.value))}
                  className="w-full accent-ctp-peach"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => setCatppuccinRemap(!catppuccinRemap)}
                  className={`w-full p-2 text-left border aug-br transition-colors ${
                    catppuccinRemap
                      ? "border-ctp-mauve bg-ctp-mauve/15 text-ctp-mauve font-semibold"
                      : "border-[var(--border)] bg-[var(--bg-secondary)] text-ctp-subtext0"
                  }`}
                >
                  {catppuccinRemap ? "✓" : "○"} Catppuccin Mocha Palette Remap
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

          {/* Tab 4: ASCII Generator */}
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
                  max={120}
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

              {asciiResult && (
                <button
                  onClick={copyAscii}
                  className="w-full py-2 aug-br bg-ctp-teal text-ctp-base font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {copiedAscii ? "✓ ASCII скопирован!" : "[ Скопировать ASCII текст ]"}
                </button>
              )}
            </div>
          )}

          {/* Download Output */}
          {imageLoaded && (
            <div className="pt-2">
              <button
                onClick={handleDownload}
                className="w-full py-3 aug-br font-mono text-xs font-semibold bg-ctp-teal text-ctp-base hover:opacity-90 transition-opacity cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <span>💾 Скачать результат ({targetFormat.replace("image/", "").toUpperCase()})</span>
              </button>
            </div>
          )}
        </div>

        {/* Viewport Column */}
        <div className="panel-sharp aug-br p-6 space-y-4 lg:col-span-2 flex flex-col justify-between bg-[var(--bg-secondary)]">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)] font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-ctp-peach font-bold">&gt;_</span>
              <span>ПРЕВЬЮ ХОЛСТА</span>
              {originalDimensions.w > 0 && (
                <span className="text-ctp-overlay0">
                  [{originalDimensions.w}×{originalDimensions.h} → {targetWidth}×{targetHeight}]
                </span>
              )}
            </div>

            {compressedSize && (
              <span className="text-ctp-green font-mono font-semibold">
                Размер: {formatSize(compressedSize)}
              </span>
            )}
          </div>

          {/* Viewport */}
          <div className="flex-1 min-h-[350px] flex items-center justify-center bg-black/40 border border-[var(--border)] p-4 overflow-auto">
            {!imageLoaded ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="text-center font-mono text-xs text-ctp-overlay0 space-y-3 cursor-pointer p-8 border border-dashed border-[var(--border)] hover:border-ctp-peach transition-colors"
              >
                <div className="text-3xl">🖼️</div>
                <div>Перетащите картинку сюда для обработки</div>
                <div className="text-[11px] text-ctp-overlay1">
                  Сжатие, конвертация и эффекты происходят локально в вашем браузере
                </div>
              </div>
            ) : activeTab === "ascii" && asciiResult ? (
              <pre className="font-mono text-[9px] leading-[8px] tracking-tighter text-ctp-text whitespace-pre overflow-auto max-h-[500px] max-w-full select-all">
                {asciiResult}
              </pre>
            ) : (
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-[500px] shadow-md border border-[var(--border-subtle)]"
              />
            )}
          </div>

          <div className="text-[11px] font-mono text-ctp-overlay1 pt-1 flex items-center justify-between">
            <span>// МЕДИА-ЛАБОРАТОРИЯ VOKIRY.TECH</span>
            <span>100% CLIENT-SIDE PROCESSING</span>
          </div>
        </div>
      </section>
    </div>
  );
}
