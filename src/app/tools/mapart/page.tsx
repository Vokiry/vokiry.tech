"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MINECRAFT_BLOCKS,
  processMapartAdvanced,
  exportToSchematic,
  type MinecraftBlock,
  type ShadedBlock,
  type DitherAlgorithm,
  type MapMode,
  type ColorMetric,
  type CropMode,
  type MapartResult,
} from "@/lib/mapart";
import { playSound } from "@/lib/sound";

export default function MapartPage() {
  // Dimensions
  const [mapsX, setMapsX] = useState<number>(1);
  const [mapsY, setMapsY] = useState<number>(1);

  // Modes & Algorithms
  const [mapMode, setMapMode] = useState<MapMode>("2d-flat");
  const [dither, setDither] = useState<DitherAlgorithm>("floyd-steinberg");
  const [ditherStrength, setDitherStrength] = useState<number>(100);
  const [colorMetric, setColorMetric] = useState<ColorMetric>("perceptual-lab");
  const [cropMode, setCropMode] = useState<CropMode>("cover");

  // Pre-processing
  const [brightness, setBrightness] = useState<number>(0);
  const [contrast, setContrast] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(0);

  // Palette filtering
  const [enabledCategories, setEnabledCategories] = useState<Record<string, boolean>>({
    survival: true,
    wool: true,
    concrete: true,
    terracotta: true,
    nether: true,
    special: false,
  });
  const [blockSearch, setBlockSearch] = useState<string>("");
  const [disabledBlockIds, setDisabledBlockIds] = useState<Set<string>>(new Set());

  // Image & Canvas state
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<MapartResult | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [hoveredBlock, setHoveredBlock] = useState<{
    x: number;
    y: number;
    sb: ShadedBlock;
    elevation: number;
  } | null>(null);
  const [selectedLayer, setSelectedLayer] = useState<number>(-1); // -1 = show all
  const [copiedMaterials, setCopiedMaterials] = useState(false);
  const [downloadingSchematic, setDownloadingSchematic] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sourceImageRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Active blocks filtered by category and individual disabled set
  const filteredBlocks = MINECRAFT_BLOCKS.filter(
    (b) => enabledCategories[b.category] && !disabledBlockIds.has(b.id)
  );

  const toggleCategory = (cat: string) => {
    setEnabledCategories((prev) => {
      const updated = { ...prev, [cat]: !prev[cat] };
      if (!Object.values(updated).some(Boolean)) return prev;
      return updated;
    });
  };

  const toggleBlockDisabled = (id: string) => {
    setDisabledBlockIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
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

    setTimeout(() => {
      try {
        const targetW = mapsX * 128;
        const targetH = mapsY * 128;

        const res = processMapartAdvanced(img, {
          width: targetW,
          height: targetH,
          palette: filteredBlocks.length > 0 ? filteredBlocks : MINECRAFT_BLOCKS,
          mode: mapMode,
          dither,
          ditherStrength: ditherStrength / 100,
          colorMetric,
          cropMode,
          brightness,
          contrast,
          saturation,
        });

        setResult(res);
        playSound("success");
      } catch (err) {
        console.error("Mapart processing error:", err);
      } finally {
        setProcessing(false);
      }
    }, 40);
  };

  // Render to canvas with optional grid lines and layer slicing
  useEffect(() => {
    if (!result || !previewCanvasRef.current) return;
    const canvas = previewCanvasRef.current;
    canvas.width = result.width;
    canvas.height = result.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (selectedLayer === -1) {
      ctx.putImageData(result.imageData, 0, 0);
    } else {
      // Highlight only the selected elevation layer
      const layerImg = ctx.createImageData(result.width, result.height);
      const d = layerImg.data;
      const orig = result.imageData.data;

      for (let y = 0; y < result.height; y++) {
        for (let x = 0; x < result.width; x++) {
          const idx = (y * result.width + x) * 4;
          const elev = result.heightMap[y][x];

          if (elev === selectedLayer) {
            d[idx] = orig[idx];
            d[idx + 1] = orig[idx + 1];
            d[idx + 2] = orig[idx + 2];
            d[idx + 3] = 255;
          } else {
            // Dim other layers
            d[idx] = Math.round(orig[idx] * 0.15);
            d[idx + 1] = Math.round(orig[idx + 1] * 0.15);
            d[idx + 2] = Math.round(orig[idx + 2] * 0.15);
            d[idx + 3] = 255;
          }
        }
      }
      ctx.putImageData(layerImg, 0, 0);
    }

    // Draw 128x128 map grid boundaries
    if (showGrid && (mapsX > 1 || mapsY > 1)) {
      ctx.strokeStyle = "rgba(203, 166, 247, 0.75)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);

      for (let x = 128; x < result.width; x += 128) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, result.height);
        ctx.stroke();
      }
      for (let y = 128; y < result.height; y += 128) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(result.width, y);
        ctx.stroke();
      }
    }
  }, [result, showGrid, selectedLayer, mapsX, mapsY]);

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!result || !previewCanvasRef.current) return;
    const rect = previewCanvasRef.current.getBoundingClientRect();
    const scaleX = result.width / rect.width;
    const scaleY = result.height / rect.height;

    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    if (x >= 0 && x < result.width && y >= 0 && y < result.height) {
      const sb = result.grid[y]?.[x];
      const elevation = result.heightMap[y]?.[x] || 0;
      if (sb) {
        setHoveredBlock({ x, y, sb, elevation });
      }
    }
  };

  const handleDownloadSchematic = async () => {
    if (!result) return;
    setDownloadingSchematic(true);
    try {
      const gzipped = await exportToSchematic(result);
      const blob = new Blob([gzipped as unknown as BlobPart], { type: "application/gzip" });
      const a = document.createElement("a");
      a.download = `mapart_${result.width}x${result.height}_${mapMode}.schematic`;
      a.href = URL.createObjectURL(blob);
      a.click();
      playSound("success");
    } catch (err) {
      console.error("Schematic export error:", err);
    } finally {
      setDownloadingSchematic(false);
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
    playSound("click");
  };

  const copyMaterialsList = () => {
    if (!result) return;
    const text = [
      `=== СПИСОК МАТЕРИАЛОВ ДЛЯ МАПАРТА (${result.width}x${result.height} блоков) ===`,
      `Режим: ${result.mode === "3d-staircased" ? "3D Staircased (Лестничный)" : "2D Flat (Плоский)"}`,
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

  // Find max layer in 3D mode
  const maxLayer = result
    ? result.heightMap.reduce((m, row) => Math.max(m, ...row), 0)
    : 0;

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
          <span className="tui-chip aug-br text-ctp-teal">[ MAPART_CRAFT_V3 // FULL_SUITE ]</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold font-display tracking-tight text-ctp-text">
              Minecraft MapartCraft Studio
            </h1>
            <p className="text-base text-ctp-subtext0 mt-2 max-w-2xl leading-relaxed">
              Полнофункциональный генератор мапартов: 2D плоский и 3D лестничный режимы (staircased с 3x палитрой), 
              перцептивный подбор цвета CIE L*a*b*, экспорт в <strong>.schematic</strong> (WorldEdit/Litematica) 
              и послойный гид для выживания.
            </p>
          </div>

          <div className="font-mono text-xs text-ctp-overlay1">
            <span>AVAILABLE_BLOCKS: {filteredBlocks.length}/{MINECRAFT_BLOCKS.length}</span>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Workspace Layout (Sidebar Controls + Canvas)
          -------------------------------------------------------------------- */}
      <section className="grid lg:grid-cols-12 gap-6">
        {/* Controls Panel (4 cols) */}
        <div className="panel-card aug-br p-6 space-y-6 lg:col-span-4 max-h-[85vh] overflow-y-auto">
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

          {/* Section 1: Geometry & Mode */}
          <div className="space-y-3 font-mono text-xs pb-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-ctp-mauve font-bold">
              <span>// РЕЖИМ &amp; РАЗМЕР КАРТЫ</span>
              <span>[01]</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMapMode("2d-flat");
                  setTimeout(() => runConversion(), 0);
                }}
                className={`p-2 text-center border aug-br transition-all cursor-pointer ${
                  mapMode === "2d-flat"
                    ? "border-ctp-teal bg-ctp-teal/15 text-ctp-teal font-semibold"
                    : "border-[var(--border)] text-ctp-subtext0 hover:text-ctp-text"
                }`}
              >
                2D Плоский
                <div className="text-[10px] text-ctp-overlay0 mt-0.5">В 1 слой (дешёвый)</div>
              </button>

              <button
                onClick={() => {
                  setMapMode("3d-staircased");
                  setTimeout(() => runConversion(), 0);
                }}
                className={`p-2 text-center border aug-br transition-all cursor-pointer ${
                  mapMode === "3d-staircased"
                    ? "border-ctp-peach bg-ctp-peach/15 text-ctp-peach font-semibold"
                    : "border-[var(--border)] text-ctp-subtext0 hover:text-ctp-text"
                }`}
              >
                3D Лестничный
                <div className="text-[10px] text-ctp-overlay0 mt-0.5">3x палитра оттенков</div>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-[10px] text-ctp-overlay0">Карт по ширине (X):</span>
                <select
                  value={mapsX}
                  onChange={(e) => {
                    setMapsX(Number(e.target.value));
                    setTimeout(() => runConversion(), 0);
                  }}
                  className="w-full mt-1 p-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-ctp-text font-mono text-xs"
                >
                  <option value={1}>1 (128 px)</option>
                  <option value={2}>2 (256 px)</option>
                  <option value={3}>3 (384 px)</option>
                  <option value={4}>4 (512 px)</option>
                </select>
              </div>
              <div>
                <span className="text-[10px] text-ctp-overlay0">Карт по высоте (Y):</span>
                <select
                  value={mapsY}
                  onChange={(e) => {
                    setMapsY(Number(e.target.value));
                    setTimeout(() => runConversion(), 0);
                  }}
                  className="w-full mt-1 p-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-ctp-text font-mono text-xs"
                >
                  <option value={1}>1 (128 px)</option>
                  <option value={2}>2 (256 px)</option>
                  <option value={3}>3 (384 px)</option>
                  <option value={4}>4 (512 px)</option>
                </select>
              </div>
            </div>
            <div className="text-[11px] text-ctp-overlay1">
              Разрешение: {mapsX * 128}×{mapsY * 128} = {(mapsX * 128 * mapsY * 128).toLocaleString("ru-RU")} блоков
            </div>
          </div>

          {/* Section 2: Dithering & Color Science */}
          <div className="space-y-3 font-mono text-xs pb-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-ctp-teal font-bold">
              <span>// ДИЗЕРИНГ &amp; ЦВЕТОПЕРЕДАЧА</span>
              <span>[02]</span>
            </div>

            <div className="space-y-1">
              <label className="text-ctp-subtext0">Алгоритм сглаживания:</label>
              <select
                value={dither}
                onChange={(e) => {
                  setDither(e.target.value as DitherAlgorithm);
                  setTimeout(() => runConversion(), 0);
                }}
                className="w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-ctp-text font-mono text-xs"
              >
                <option value="floyd-steinberg">Floyd-Steinberg (Классический диффузный)</option>
                <option value="atkinson">Atkinson (Контрастный)</option>
                <option value="bayer4x4">Bayer 4×4 (Матричный ретро)</option>
                <option value="bayer8x8">Bayer 8×8 (Мягкий матричный)</option>
                <option value="burkes">Burkes (Сглаженный)</option>
                <option value="stucki">Stucki (Высокая детализация)</option>
                <option value="sierra-lite">Sierra-Lite (Быстрый)</option>
                <option value="none">Без дизеринга (Строгий)</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-ctp-subtext0">Сила дизеринга:</span>
                <span className="text-ctp-teal font-bold">{ditherStrength}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={ditherStrength}
                onChange={(e) => {
                  setDitherStrength(Number(e.target.value));
                  setTimeout(() => runConversion(), 0);
                }}
                className="w-full accent-ctp-teal"
              />
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-ctp-subtext0">Цветовое пространство подбора:</label>
              <select
                value={colorMetric}
                onChange={(e) => {
                  setColorMetric(e.target.value as ColorMetric);
                  setTimeout(() => runConversion(), 0);
                }}
                className="w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-ctp-text font-mono text-xs"
              >
                <option value="perceptual-lab">CIE L*a*b* (Перцептивное, как в MapartCraft)</option>
                <option value="euclidean-rgb">Евклидово RGB (Техническое)</option>
              </select>
            </div>
          </div>

          {/* Section 3: Preprocessing & Crop */}
          <div className="space-y-3 font-mono text-xs pb-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center justify-between text-ctp-peach font-bold">
              <span>// ПОДГОТОВКА ИЗОБРАЖЕНИЯ</span>
              <span>[03]</span>
            </div>

            <div className="space-y-1">
              <label className="text-ctp-subtext0">Кадрирование (Crop Mode):</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "cover", label: "Заполнить" },
                  { id: "contain", label: "Вписать" },
                  { id: "stretch", label: "Растянуть" },
                ].map((cm) => (
                  <button
                    key={cm.id}
                    onClick={() => {
                      setCropMode(cm.id as CropMode);
                      setTimeout(() => runConversion(), 0);
                    }}
                    className={`py-1 text-[11px] border transition-colors cursor-pointer ${
                      cropMode === cm.id
                        ? "border-ctp-peach bg-ctp-peach/15 text-ctp-peach font-semibold"
                        : "border-[var(--border)] text-ctp-subtext0"
                    }`}
                  >
                    {cm.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between">
                <span className="text-[11px] text-ctp-subtext0">Яркость:</span>
                <span className="text-ctp-peach">{brightness > 0 ? `+${brightness}` : brightness}</span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                value={brightness}
                onChange={(e) => {
                  setBrightness(Number(e.target.value));
                  setTimeout(() => runConversion(), 0);
                }}
                className="w-full accent-ctp-peach"
              />

              <div className="flex justify-between">
                <span className="text-[11px] text-ctp-subtext0">Контраст:</span>
                <span className="text-ctp-peach">{contrast > 0 ? `+${contrast}` : contrast}</span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                value={contrast}
                onChange={(e) => {
                  setContrast(Number(e.target.value));
                  setTimeout(() => runConversion(), 0);
                }}
                className="w-full accent-ctp-peach"
              />
            </div>
          </div>

          {/* Section 4: Palette & Block Manager */}
          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-ctp-sapphire font-bold">
              <span>// ПАЛИТРА БЛОКОВ</span>
              <span>[04]</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
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
                      ? "border-ctp-sapphire bg-ctp-sapphire/10 text-ctp-sapphire font-semibold"
                      : "border-[var(--border)] bg-[var(--bg-secondary)] text-ctp-overlay0"
                  }`}
                >
                  {enabledCategories[cat.id] ? "✓" : "○"} {cat.name}
                </button>
              ))}
            </div>

            {/* Block search & individual disable */}
            <div className="space-y-1.5 pt-2">
              <input
                type="text"
                value={blockSearch}
                onChange={(e) => setBlockSearch(e.target.value)}
                placeholder="Поиск конкретного блока..."
                className="w-full p-2 bg-[var(--bg-secondary)] border border-[var(--border)] text-ctp-text font-mono text-xs"
              />

              {blockSearch && (
                <div className="max-h-36 overflow-y-auto border border-[var(--border)] p-2 space-y-1 bg-[var(--bg-secondary)]">
                  {MINECRAFT_BLOCKS.filter(
                    (b) =>
                      b.name.toLowerCase().includes(blockSearch.toLowerCase()) ||
                      b.id.toLowerCase().includes(blockSearch.toLowerCase())
                  ).map((b) => (
                    <label
                      key={b.id}
                      className="flex items-center justify-between p-1 hover:bg-ctp-surface0 cursor-pointer text-[11px]"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className="w-3 h-3 inline-block border border-black/30"
                          style={{ backgroundColor: `rgb(${b.rgb.join(",")})` }}
                        />
                        <span className="truncate">{b.name}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={!disabledBlockIds.has(b.id)}
                        onChange={() => {
                          toggleBlockDisabled(b.id);
                          setTimeout(() => runConversion(), 0);
                        }}
                        className="accent-ctp-mauve"
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {imageLoaded && (
            <button
              onClick={() => runConversion()}
              disabled={processing}
              className="w-full py-2.5 px-3 aug-br font-mono text-xs font-semibold bg-ctp-teal text-ctp-base hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer shadow-xs"
            >
              {processing ? "Рендеринг блоков..." : "↻ Пересчитать мапарт"}
            </button>
          )}
        </div>

        {/* Viewport & Inspection Panel (8 cols) */}
        <div className="panel-sharp aug-br p-6 space-y-4 lg:col-span-8 flex flex-col justify-between bg-[var(--bg-secondary)]">
          {/* Top Canvas Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)] font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-ctp-teal font-bold">&gt;_</span>
              <span>ПРЕВЬЮ ХОЛСТА</span>
              {result && (
                <span className="text-ctp-overlay0">
                  [{result.width}×{result.height} px]
                </span>
              )}
            </div>

            {/* Zoom & Grid toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`px-2 py-0.5 border aug-br transition-colors cursor-pointer ${
                  showGrid ? "border-ctp-mauve text-ctp-mauve" : "border-[var(--border)] text-ctp-overlay0"
                }`}
                title="Переключить сетку карт 128x128"
              >
                Сетка 128px: {showGrid ? "ВКЛ" : "ВЫКЛ"}
              </button>

              <div className="flex items-center gap-1 border border-[var(--border)] px-1 bg-ctp-surface0">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                  className="px-1 text-ctp-subtext0 hover:text-ctp-text"
                >
                  -
                </button>
                <span className="text-[11px] text-ctp-text font-bold px-1">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(4, z + 0.25))}
                  className="px-1 text-ctp-subtext0 hover:text-ctp-text"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Canvas Viewport */}
          <div className="flex-1 min-h-[420px] max-h-[620px] flex items-center justify-center bg-black/50 border border-[var(--border)] p-4 overflow-auto relative">
            {!imageLoaded ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="text-center font-mono text-xs text-ctp-overlay0 space-y-3 cursor-pointer p-10 border border-dashed border-[var(--border)] hover:border-ctp-mauve transition-colors"
              >
                <div className="text-4xl">🗺️</div>
                <div className="text-sm font-semibold text-ctp-text">Перетащите картинку сюда для генерации мапарта</div>
                <div className="text-[11px] text-ctp-overlay1">
                  Поддерживаются форматы PNG, JPG, WebP любого разрешения
                </div>
              </div>
            ) : (
              <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center center" }}>
                <canvas
                  ref={previewCanvasRef}
                  onMouseMove={handleCanvasMouseMove}
                  className="image-render-pixel border border-ctp-overlay0 shadow-lg cursor-crosshair"
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            )}
          </div>

          {/* Real-time Block Hover Inspector */}
          {hoveredBlock && (
            <div className="p-3 bg-ctp-surface0 border border-[var(--border-subtle)] aug-br flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="flex items-center gap-3">
                <span
                  className="w-4 h-4 border border-black/40 shrink-0"
                  style={{ backgroundColor: `rgb(${hoveredBlock.sb.rgb.join(",")})` }}
                />
                <div>
                  <span className="text-ctp-text font-bold">{hoveredBlock.sb.block.name}</span>
                  <span className="text-ctp-overlay0 text-[11px] ml-2 font-mono">
                    ({hoveredBlock.sb.block.id})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-ctp-subtext0 text-[11px]">
                <span>
                  Оттенок:{" "}
                  <strong className={hoveredBlock.sb.shade === 2 ? "text-ctp-green" : hoveredBlock.sb.shade === 0 ? "text-ctp-peach" : "text-ctp-mauve"}>
                    {hoveredBlock.sb.shade === 2 ? "Светлый (выше)" : hoveredBlock.sb.shade === 0 ? "Тёмный (ниже)" : "Обычный"}
                  </strong>
                </span>

                {mapMode === "3d-staircased" && (
                  <span>
                    Высота Y: <strong className="text-ctp-teal">{hoveredBlock.elevation}</strong>
                  </span>
                )}

                <span className="text-ctp-overlay1">
                  [X: <strong>{hoveredBlock.x}</strong>, Z: <strong>{hoveredBlock.y}</strong>]
                </span>
              </div>
            </div>
          )}

          {/* Survival Layer Slicer (for 3D Staircasing) */}
          {mapMode === "3d-staircased" && result && maxLayer > 0 && (
            <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] aug-br space-y-1.5 font-mono text-xs">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-ctp-peach font-bold">// ПОСЛОЙНЫЙ СРЕЗ (СЛОЙ ВЫЖИВАНИЯ):</span>
                <span>
                  {selectedLayer === -1 ? "Все слои" : `Слой Y: ${selectedLayer} из ${maxLayer}`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedLayer(-1)}
                  className={`px-2 py-0.5 border text-[10px] ${
                    selectedLayer === -1 ? "border-ctp-peach bg-ctp-peach/10 text-ctp-peach font-bold" : "border-[var(--border)] text-ctp-overlay0"
                  }`}
                >
                  Все слои
                </button>
                <input
                  type="range"
                  min={0}
                  max={maxLayer}
                  value={selectedLayer === -1 ? 0 : selectedLayer}
                  onChange={(e) => setSelectedLayer(Number(e.target.value))}
                  className="flex-1 accent-ctp-peach"
                />
              </div>
            </div>
          )}

          {/* Action & Export Bar */}
          {result && (
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
              <div className="text-ctp-subtext0">
                Всего блоков: <strong className="text-ctp-text">{result.totalBlocks.toLocaleString("ru-RU")}</strong>
                ({result.materials.length} уникальных видов)
              </div>

              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={() => handleDownloadImage(1)}
                  className="px-3 py-1.5 aug-br border border-[var(--border)] bg-ctp-surface0 text-ctp-text hover:border-ctp-mauve hover:text-ctp-mauve transition-colors cursor-pointer"
                >
                  PNG (1x)
                </button>
                <button
                  onClick={() => handleDownloadImage(4)}
                  className="px-3 py-1.5 aug-br border border-[var(--border)] bg-ctp-surface0 text-ctp-text hover:border-ctp-teal hover:text-ctp-teal transition-colors cursor-pointer"
                >
                  PNG (4x)
                </button>
                <button
                  onClick={handleDownloadSchematic}
                  disabled={downloadingSchematic}
                  className="px-4 py-1.5 aug-br bg-ctp-mauve text-ctp-base font-semibold hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer shadow-xs hover:shadow-[0_0_12px_rgba(203,166,247,0.35)]"
                >
                  {downloadingSchematic ? "Упаковка в NBT..." : "⬇ Скачать .schematic"}
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
