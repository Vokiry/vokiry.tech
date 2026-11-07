"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MINECRAFT_BLOCKS,
  processMapart,
  type MinecraftBlock,
  type DitherAlgorithm,
  type MapartResult,
} from "@/lib/mapart";
import { playSound } from "@/lib/sound";

export default function MapartPage() {
  const [mapsX, setMapsX] = useState<number>(1);
  const [mapsY, setMapsY] = useState<number>(1);
  const [dither, setDither] = useState<DitherAlgorithm>("floyd-steinberg");
  const [enabledCategories, setEnabledCategories] = useState<Record<string, boolean>>({
    survival: true,
    wool: true,
    concrete: true,
    terracotta: true,
    nether: true,
    special: false,
  });

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<MapartResult | null>(null);
  const [hoveredBlock, setHoveredBlock] = useState<{ x: number; y: number; block: MinecraftBlock } | null>(null);
  const [copiedMaterials, setCopiedMaterials] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Filter palette based on enabled categories
  const activePalette = MINECRAFT_BLOCKS.filter((b) => enabledCategories[b.category]);

  const toggleCategory = (cat: string) => {
    setEnabledCategories((prev) => {
      const updated = { ...prev, [cat]: !prev[cat] };
      // ensure at least one category remains active
      if (!Object.values(updated).some(Boolean)) return prev;
      return updated;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        sourceImageRef.current = img;
        setImageLoaded(true);
        runConversion(img);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const runConversion = (img = sourceImageRef.current) => {
    if (!img) return;
    setProcessing(true);

    // Give browser a frame to update UI
    setTimeout(() => {
      try {
        const sourceCanvas = document.createElement("canvas");
        sourceCanvas.width = img.width;
        sourceCanvas.height = img.height;
        const ctx = sourceCanvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);

        const targetW = mapsX * 128;
        const targetH = mapsY * 128;

        const res = processMapart(
          sourceCanvas,
          targetW,
          targetH,
          activePalette.length > 0 ? activePalette : MINECRAFT_BLOCKS,
          dither
        );
        setResult(res);
        playSound("success");
      } catch (err) {
        console.error(err);
      } finally {
        setProcessing(false);
      }
    }, 50);
  };

  // Re-render result to canvas whenever result updates
  useEffect(() => {
    if (!result || !previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;
    canvas.width = result.width;
    canvas.height = result.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.putImageData(result.imageData, 0, 0);
  }, [result]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!result || !previewCanvasRef.current) return;
    const rect = previewCanvasRef.current.getBoundingClientRect();
    const scaleX = result.width / rect.width;
    const scaleY = result.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    if (x >= 0 && x < result.width && y >= 0 && y < result.height) {
      const block = result.grid[y]?.[x];
      if (block) {
        setHoveredBlock({ x, y, block });
      }
    }
  };

  const handleDownloadImage = (scale: number = 1) => {
    if (!result || !previewCanvasRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = result.width * scale;
    canvas.height = result.height * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(previewCanvasRef.current, 0, 0, canvas.width, canvas.height);

    const a = document.createElement("a");
    a.download = `mapart_${result.width}x${result.height}.png`;
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  const copyMaterialsList = () => {
    if (!result) return;
    const text = [
      `=== СПИСОК МАТЕРИАЛОВ ДЛЯ МАПАРТА (${result.width}x${result.height} блоков) ===`,
      `Всего блоков: ${result.totalBlocks.toLocaleString("ru-RU")}`,
      `Размер в картах: ${mapsX}x${mapsY} (${mapsX * mapsY} карт)`,
      `----------------------------------------------------`,
      ...result.materials.map(
        (m, i) => `${i + 1}. ${m.block.name} (${m.block.id}): ${m.count} шт. [${m.stacks}]`
      ),
    ].join("\n");

    navigator.clipboard.writeText(text);
    setCopiedMaterials(true);
    playSound("click");
    setTimeout(() => setCopiedMaterials(false), 2000);
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
          <span className="tui-chip aug-br text-ctp-teal">[ MAPART_CRAFT // 128x128 ]</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-ctp-text">
              Minecraft Mapart Generator
            </h1>
            <p className="text-base text-ctp-subtext0 mt-2 max-w-2xl leading-relaxed">
              Генератор мапартов прямо в браузере (вдохновлён MapartCraft). Преобразует любую картинку 
              в пиксель-арт из блоков Майнкрафта с алгоритмами дизеринга и списком материалов.
            </p>
          </div>

          <div className="font-mono text-xs text-ctp-overlay1">
            <span>VANILLA_PALETTE: {MINECRAFT_BLOCKS.length} BLOCKS</span>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Settings & Upload Controls
          -------------------------------------------------------------------- */}
      <section className="grid lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="panel-card aug-br p-6 space-y-6 lg:col-span-1">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] font-mono text-xs">
            <span className="text-ctp-mauve font-bold">// НАСТРОЙКИ КАРТЫ</span>
            <span className="text-ctp-overlay0">[CONFIG]</span>
          </div>

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

          {/* Map Dimensions */}
          <div className="space-y-2 font-mono text-xs">
            <label className="text-ctp-subtext0">Размер в картах (1 карта = 128x128):</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-ctp-overlay0">Ширина (X):</span>
                <select
                  value={mapsX}
                  onChange={(e) => {
                    setMapsX(Number(e.target.value));
                    setTimeout(() => runConversion(), 0);
                  }}
                  className="w-full mt-1 p-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-ctp-text font-mono text-xs"
                >
                  <option value={1}>1 карта (128 px)</option>
                  <option value={2}>2 карты (256 px)</option>
                  <option value={3}>3 карты (384 px)</option>
                  <option value={4}>4 карты (512 px)</option>
                </select>
              </div>
              <div>
                <span className="text-[10px] text-ctp-overlay0">Высота (Y):</span>
                <select
                  value={mapsY}
                  onChange={(e) => {
                    setMapsY(Number(e.target.value));
                    setTimeout(() => runConversion(), 0);
                  }}
                  className="w-full mt-1 p-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-ctp-text font-mono text-xs"
                >
                  <option value={1}>1 карта (128 px)</option>
                  <option value={2}>2 карты (256 px)</option>
                  <option value={3}>3 карты (384 px)</option>
                  <option value={4}>4 карты (512 px)</option>
                </select>
              </div>
            </div>
            <div className="text-[11px] text-ctp-overlay1 pt-1">
              Итого: {mapsX * 128} × {mapsY * 128} = {(mapsX * 128 * mapsY * 128).toLocaleString("ru-RU")} блоков
            </div>
          </div>

          {/* Dithering Method */}
          <div className="space-y-2 font-mono text-xs">
            <label className="text-ctp-subtext0">Алгоритм сглаживания (Dithering):</label>
            <select
              value={dither}
              onChange={(e) => {
                setDither(e.target.value as DitherAlgorithm);
                setTimeout(() => runConversion(), 0);
              }}
              className="w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-ctp-text font-mono text-xs"
            >
              <option value="floyd-steinberg">Floyd-Steinberg (Мягкое диффузное)</option>
              <option value="atkinson">Atkinson (Чёткое контрастное)</option>
              <option value="bayer4x4">Bayer 4x4 (Ретро матричное)</option>
              <option value="none">Без дизеринга (Ближайший цвет)</option>
            </select>
          </div>

          {/* Palette Categories */}
          <div className="space-y-2 font-mono text-xs">
            <label className="text-ctp-subtext0">Доступные категории блоков:</label>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {[
                { id: "survival", name: "Выживание" },
                { id: "wool", name: "Шерсть" },
                { id: "concrete", name: "Бетон" },
                { id: "terracotta", name: "Терракота" },
                { id: "nether", name: "Незер / Энд" },
                { id: "special", name: "Дорогие" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    toggleCategory(cat.id);
                    setTimeout(() => runConversion(), 0);
                  }}
                  className={`p-1.5 text-left text-[11px] border transition-colors cursor-pointer ${
                    enabledCategories[cat.id]
                      ? "border-ctp-mauve bg-ctp-mauve/10 text-ctp-mauve font-semibold"
                      : "border-[var(--border)] bg-[var(--bg-secondary)] text-ctp-overlay0"
                  }`}
                >
                  {enabledCategories[cat.id] ? "✓" : "○"} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {imageLoaded && (
            <button
              onClick={() => runConversion()}
              disabled={processing}
              className="w-full py-2.5 px-3 aug-br font-mono text-xs font-semibold bg-ctp-teal text-ctp-base hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
            >
              {processing ? "Рендеринг блоков..." : "↻ Пересчитать мапарт"}
            </button>
          )}
        </div>

        {/* Canvas Preview Area */}
        <div className="panel-sharp aug-br p-6 space-y-4 lg:col-span-2 flex flex-col justify-between bg-[var(--bg-secondary)]">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)] font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-ctp-teal font-bold">&gt;_</span>
              <span>ПРЕВЬЮ МАПАРТА</span>
              {result && (
                <span className="text-ctp-overlay0">
                  [{result.width}×{result.height} px]
                </span>
              )}
            </div>

            {hoveredBlock && (
              <div className="text-xs text-ctp-subtext0 flex items-center gap-2">
                <span
                  className="w-3 h-3 inline-block border border-black/30"
                  style={{
                    backgroundColor: `rgb(${hoveredBlock.block.rgb.join(",")})`,
                  }}
                />
                <span className="text-ctp-text font-bold">{hoveredBlock.block.name}</span>
                <span className="text-ctp-overlay0">
                  [X:{hoveredBlock.x}, Z:{hoveredBlock.y}]
                </span>
              </div>
            )}
          </div>

          {/* Canvas Wrapper */}
          <div className="flex-1 min-h-[300px] flex items-center justify-center bg-black/40 border border-[var(--border)] p-4 overflow-auto">
            {!imageLoaded ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="text-center font-mono text-xs text-ctp-overlay0 space-y-3 cursor-pointer p-8 border border-dashed border-[var(--border)] hover:border-ctp-mauve transition-colors"
              >
                <div className="text-3xl">🖼️</div>
                <div>Перетащите картинку сюда или нажмите для выбора</div>
                <div className="text-[11px] text-ctp-overlay1">
                  Поддерживаются PNG, JPG, WebP любого разрешения
                </div>
              </div>
            ) : (
              <canvas
                ref={previewCanvasRef}
                onMouseMove={handleCanvasMouseMove}
                className="image-render-pixel max-w-full max-h-[500px] border border-ctp-overlay0 shadow-md cursor-crosshair"
                style={{ imageRendering: "pixelated" }}
              />
            )}
          </div>

          {/* Actions & Export */}
          {result && (
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="text-ctp-subtext0">
                Всего: <strong className="text-ctp-text">{result.totalBlocks.toLocaleString("ru-RU")}</strong> блоков
                ({result.materials.length} видов)
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadImage(1)}
                  className="px-3 py-1.5 aug-br border border-[var(--border)] bg-ctp-surface0 text-ctp-text hover:border-ctp-mauve hover:text-ctp-mauve transition-colors cursor-pointer"
                >
                  PNG (1x)
                </button>
                <button
                  onClick={() => handleDownloadImage(4)}
                  className="px-3 py-1.5 aug-br bg-ctp-mauve text-ctp-base font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Скачать превью (4x) ↗
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Materials Checklist
          -------------------------------------------------------------------- */}
      {result && (
        <section className="panel-card aug-br p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)] font-mono text-xs">
            <div>
              <span className="text-ctp-peach font-bold">// МАТЕРИАЛЫ ДЛЯ СБОРКИ</span>
              <span className="text-ctp-overlay0 ml-2">[{result.materials.length} НАИМЕНОВАНИЙ]</span>
            </div>

            <button
              onClick={copyMaterialsList}
              className="aug-br px-3 py-1 bg-ctp-surface1 border border-[var(--border)] text-ctp-text hover:border-ctp-peach hover:text-ctp-peach transition-colors cursor-pointer"
            >
              {copiedMaterials ? "✓ Список скопирован!" : "[ Скопировать список для игры ]"}
            </button>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {result.materials.map((mat, i) => (
              <div
                key={mat.block.id + i}
                className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between gap-2 font-mono text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className="w-4 h-4 shrink-0 border border-black/30"
                    style={{ backgroundColor: `rgb(${mat.block.rgb.join(",")})` }}
                  />
                  <div className="truncate">
                    <div className="text-ctp-text font-semibold truncate">{mat.block.name}</div>
                    <div className="text-[10px] text-ctp-overlay0">{mat.stacks}</div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-ctp-mauve font-bold">{mat.count.toLocaleString("ru-RU")}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
