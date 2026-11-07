"use client";

import { useState } from "react";

const tools = [
  { id: "json", name: "JSON Formatter", code: "01", desc: "Форматирование и валидация JSON" },
  { id: "base64", name: "Base64", code: "02", desc: "Кодирование и декодирование Base64" },
  { id: "url", name: "URL Encode", code: "03", desc: "Кодирование спецсимволов URL" },
  { id: "hash", name: "Hash Generator", code: "04", desc: "MD5, SHA-1, SHA-256, SHA-512" },
  { id: "color", name: "Color Converter", code: "05", desc: "Конвертация HEX, RGB, HSL" },
  { id: "timestamp", name: "Timestamp", code: "06", desc: "Unix timestamp и время ISO" },
  { id: "cron", name: "Cron Parser", code: "07", desc: "Парсер расписания cron-выражений" },
  { id: "sql", name: "SQL Formatter", code: "08", desc: "Форматирование SQL-запросов" },
];

interface ColorOutput {
  hex: string;
  rgb: string;
  hsl: string;
}

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState("json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [colorOutput, setColorOutput] = useState<ColorOutput | null>(null);
  const [copied, setCopied] = useState(false);

  const processInput = (value: string, tool: string, currentMode: "encode" | "decode") => {
    setInput(value);
    setColorOutput(null);

    if (!value.trim()) {
      setOutput("");
      return;
    }

    try {
      switch (tool) {
        case "json": {
          const parsed = JSON.parse(value);
          setOutput(JSON.stringify(parsed, null, 2));
          break;
        }
        case "base64":
          if (currentMode === "encode") {
            setOutput(btoa(unescape(encodeURIComponent(value))));
          } else {
            setOutput(decodeURIComponent(escape(atob(value))));
          }
          break;
        case "url":
          if (currentMode === "encode") {
            setOutput(encodeURIComponent(value));
          } else {
            setOutput(decodeURIComponent(value));
          }
          break;
        case "hash":
          setOutput("Вычисление хешей...");
          computeHashes(value).then(setOutput);
          break;
        case "timestamp": {
          const ts = parseInt(value, 10);
          if (!isNaN(ts)) {
            const date = new Date(value.length === 10 ? ts * 1000 : ts);
            setOutput(
              `ISO 8601: ${date.toISOString()}\nЛокальное: ${date.toLocaleString("ru-RU")}\nUTC:       ${date.toUTCString()}`
            );
          } else {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              setOutput(`Unix Seconds:      ${Math.floor(date.getTime() / 1000)}\nUnix Milliseconds: ${date.getTime()}`);
            } else {
              setOutput("Некорректный timestamp или дата");
            }
          }
          break;
        }
        case "color": {
          const color = parseColor(value);
          if (color) {
            setColorOutput(color);
          } else {
            setOutput("Не удалось распознать формат цвета (HEX, RGB или HSL)");
          }
          break;
        }
        case "cron":
          setOutput(parseCron(value));
          break;
        case "sql":
          setOutput(formatSql(value));
          break;
        default:
          setOutput("");
      }
    } catch (e) {
      setOutput("Ошибка обработки: " + (e as Error).message);
    }
  };

  const copyToClipboard = (text?: string) => {
    const textToCopy = text || output;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* --------------------------------------------------------------------
          Header
          -------------------------------------------------------------------- */}
      <section className="space-y-4">
        <div className="flex items-center gap-3 font-mono text-xs text-ctp-subtext0">
          <span className="tui-chip aug-br text-ctp-green">[ 07 // ВЕРСТАК ]</span>
          <span className="text-ctp-overlay0">//</span>
          <span>POCKET WORKBENCH &amp; CONVERTERS</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="text-4xl sm:text-6xl font-bold font-display tracking-tight text-ctp-text">
              ~/верстак
            </h1>
            <p className="text-base text-ctp-subtext0 mt-2 max-w-xl leading-relaxed">
              Карманные инструменты вайбкодера: быстрые конвертеры и валидаторы прямо в браузере. 
              Никаких кук, рекламы и отправки данных на сторонние серверы.
            </p>
          </div>

          <div className="font-mono text-xs text-ctp-overlay1">
            <span>TOOLS: 8 MODULES // CLIENT_SIDE</span>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          Tool Selector Grid
          -------------------------------------------------------------------- */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => {
              setActiveTool(tool.id);
              processInput(input, tool.id, mode);
            }}
            className={`panel-sharp aug-br p-3.5 text-left transition-all cursor-pointer ${
              activeTool === tool.id
                ? "bg-ctp-surface1 border-ctp-mauve shadow-xs"
                : "bg-[var(--bg-secondary)] hover:border-ctp-subtext0"
            }`}
          >
            <div className="flex items-center justify-between font-mono text-[11px] mb-1">
              <span className="text-ctp-overlay0">[{tool.code}]</span>
              {activeTool === tool.id && (
                <span className="text-ctp-mauve font-bold">● ACTIVE</span>
              )}
            </div>
            <div className="font-bold font-display text-sm text-ctp-text">
              {tool.name}
            </div>
            <div className="text-[11px] text-ctp-overlay1 truncate mt-0.5">
              {tool.desc}
            </div>
          </button>
        ))}
      </section>

      {/* --------------------------------------------------------------------
          Interactive Workspace
          -------------------------------------------------------------------- */}
      <section className="panel-card aug-br p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)] font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-ctp-mauve font-bold">&gt;_</span>
            <span className="text-ctp-text font-semibold">
              {tools.find((t) => t.id === activeTool)?.name}
            </span>
          </div>

          {(activeTool === "base64" || activeTool === "url") && (
            <div className="flex items-center gap-1 bg-ctp-surface0 p-0.5 border border-[var(--border)]">
              <button
                onClick={() => {
                  setMode("encode");
                  processInput(input, activeTool, "encode");
                }}
                className={`px-3 py-1 text-xs cursor-pointer ${
                  mode === "encode" ? "bg-ctp-mauve text-ctp-base font-semibold" : "text-ctp-subtext0"
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => {
                  setMode("decode");
                  processInput(input, activeTool, "decode");
                }}
                className={`px-3 py-1 text-xs cursor-pointer ${
                  mode === "decode" ? "bg-ctp-mauve text-ctp-base font-semibold" : "text-ctp-subtext0"
                }`}
              >
                Decode
              </button>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-mono text-ctp-subtext0">
            Входные данные:
          </label>
          <textarea
            value={input}
            onChange={(e) => processInput(e.target.value, activeTool, mode)}
            className="w-full h-32 p-3 font-mono text-xs bg-[var(--bg-secondary)] border border-[var(--border)] text-ctp-text focus:border-ctp-mauve focus:outline-none transition-colors resize-y"
            placeholder={getPlaceholder(activeTool)}
          />
        </div>

        {/* Output */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <label className="text-ctp-subtext0">Результат:</label>
            {(output || colorOutput) && (
              <button
                onClick={() => copyToClipboard()}
                className="text-ctp-mauve hover:underline cursor-pointer"
              >
                {copied ? "✓ Скопировано!" : "[ Скопировать результат ]"}
              </button>
            )}
          </div>

          {activeTool === "color" && colorOutput ? (
            <div className="space-y-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border)] aug-br">
              <div
                className="h-16 w-full border border-[var(--border)] aug-br"
                style={{ backgroundColor: colorOutput.hex }}
              />
              <div className="grid sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 bg-ctp-surface0 border border-[var(--border-subtle)] space-y-1">
                  <div className="text-ctp-overlay0 text-[10px]">HEX</div>
                  <div className="text-ctp-text font-bold select-all">{colorOutput.hex}</div>
                </div>
                <div className="p-3 bg-ctp-surface0 border border-[var(--border-subtle)] space-y-1">
                  <div className="text-ctp-overlay0 text-[10px]">RGB</div>
                  <div className="text-ctp-text font-bold select-all">{colorOutput.rgb}</div>
                </div>
                <div className="p-3 bg-ctp-surface0 border border-[var(--border-subtle)] space-y-1">
                  <div className="text-ctp-overlay0 text-[10px]">HSL</div>
                  <div className="text-ctp-text font-bold select-all">{colorOutput.hsl}</div>
                </div>
              </div>
            </div>
          ) : (
            <pre className="w-full min-h-[8rem] max-h-96 p-3.5 bg-[var(--bg-secondary)] border border-[var(--border)] text-ctp-text font-mono text-xs overflow-auto whitespace-pre-wrap">
              {output || "Ожидание ввода данных..."}
            </pre>
          )}
        </div>
      </section>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Tool Processing Utilities
   -------------------------------------------------------------------------- */
async function sha(algo: "SHA-1" | "SHA-256" | "SHA-512", text: string): Promise<string> {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function md5(input: string): string {
  function rh(n: number) {
    let s = "";
    for (let j = 0; j <= 3; j++)
      s += ((n >> (j * 8 + 4)) & 15).toString(16) + ((n >> (j * 8)) & 15).toString(16);
    return s;
  }
  function ad(x: number, y: number) {
    const l = (x & 0xffff) + (y & 0xffff);
    return (((x >> 16) + (y >> 16) + (l >> 16)) << 16) | (l & 0xffff);
  }
  function rl(n: number, c: number) {
    return (n << c) | (n >>> (32 - c));
  }
  function cm(q: number, a: number, b: number, x: number, s: number, t: number) {
    return ad(rl(ad(ad(a, q), ad(x, t)), s), b);
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cm((b & c) | (~b & d), a, b, x, s, t);
  }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cm((b & d) | (c & ~d), a, b, x, s, t);
  }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cm(b ^ c ^ d, a, b, x, s, t);
  }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
    return cm(c ^ (b | ~d), a, b, x, s, t);
  }
  function cb(s: string) {
    const n = ((s.length + 8) >> 6) + 1;
    const b = new Array(n * 16).fill(0);
    let i;
    for (i = 0; i < s.length; i++) b[i >> 2] |= s.charCodeAt(i) << ((i % 4) * 8);
    b[i >> 2] |= 0x80 << ((i % 4) * 8);
    b[n * 16 - 2] = s.length * 8;
    return b;
  }
  const utf8 = unescape(encodeURIComponent(input));
  const x = cb(utf8);
  let a = 1732584193,
    b = -271733879,
    c = -1732584194,
    d = 271733878;
  for (let i = 0; i < x.length; i += 16) {
    const oa = a,
      ob = b,
      oc = c,
      od = d;
    a = ff(a, b, c, d, x[i + 0], 7, -680876936);
    d = ff(d, a, b, c, x[i + 1], 12, -389564586);
    c = ff(c, d, a, b, x[i + 2], 17, 606105819);
    b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i + 4], 7, -176418897);
    d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
    c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
    b = ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
    d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
    c = ff(c, d, a, b, x[i + 10], 17, -42063);
    b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
    d = ff(d, a, b, c, x[i + 13], 12, -40341101);
    c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
    b = ff(b, c, d, a, x[i + 15], 22, 1236535329);

    a = gg(a, b, c, d, x[i + 1], 5, -165796510);
    d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
    c = gg(c, d, a, b, x[i + 11], 14, 643717713);
    b = gg(b, c, d, a, x[i + 0], 20, -373897302);
    a = gg(a, b, c, d, x[i + 5], 5, -701558691);
    d = gg(d, a, b, c, x[i + 10], 9, 38016083);
    c = gg(c, d, a, b, x[i + 15], 14, -660478335);
    b = gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = gg(a, b, c, d, x[i + 9], 5, 568446438);
    d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
    c = gg(c, d, a, b, x[i + 3], 14, -187363961);
    b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
    d = gg(d, a, b, c, x[i + 2], 9, -51403784);
    c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
    b = gg(b, c, d, a, x[i + 12], 20, -1926607734);

    a = hh(a, b, c, d, x[i + 5], 4, -378558);
    d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
    c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
    b = hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
    d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
    c = hh(c, d, a, b, x[i + 7], 16, -155497632);
    b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = hh(a, b, c, d, x[i + 13], 4, 681279174);
    d = hh(d, a, b, c, x[i + 0], 11, -358537222);
    c = hh(c, d, a, b, x[i + 3], 16, -722521979);
    b = hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = hh(a, b, c, d, x[i + 9], 4, -640364487);
    d = hh(d, a, b, c, x[i + 12], 11, -421815835);
    c = hh(c, d, a, b, x[i + 15], 16, 530742520);
    b = hh(b, c, d, a, x[i + 2], 23, -995338651);

    a = ii(a, b, c, d, x[i + 0], 6, -198630844);
    d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
    c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
    b = ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
    d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
    c = ii(c, d, a, b, x[i + 10], 15, -1051523);
    b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
    d = ii(d, a, b, c, x[i + 15], 10, -30611744);
    c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
    b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = ii(a, b, c, d, x[i + 4], 6, -145523070);
    d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
    c = ii(c, d, a, b, x[i + 2], 15, 718787259);
    b = ii(b, c, d, a, x[i + 9], 21, -343485551);

    a = ad(a, oa);
    b = ad(b, ob);
    c = ad(c, oc);
    d = ad(d, od);
  }
  return rh(a) + rh(b) + rh(c) + rh(d);
}

async function computeHashes(text: string): Promise<string> {
  const [s1, s256, s512] = await Promise.all([
    sha("SHA-1", text),
    sha("SHA-256", text),
    sha("SHA-512", text),
  ]);
  return `MD5:     ${md5(text)}\nSHA-1:   ${s1}\nSHA-256: ${s256}\nSHA-512: ${s512}`;
}

function getPlaceholder(tool: string): string {
  const placeholders: Record<string, string> = {
    json: '{"title": "vokiry", "status": "operational", "tags": ["tui", "stream"]}',
    base64: "Введите текст для кодирования или строку base64...",
    url: "https://vokiry.tech/live?category=software&lang=ru",
    hash: "Любая строка для расчета хеш-сумм...",
    color: "#cba6f7 или rgb(203, 166, 247) или hsl(267, 84%, 81%)",
    timestamp: "1704067200 или 2026-03-28T12:00:00Z",
    cron: "*/15 * * * *",
    sql: "SELECT id, title, author FROM posts WHERE published = 1 ORDER BY created_at DESC",
  };
  return placeholders[tool] || "Введите данные...";
}

function parseColor(input: string): ColorOutput | null {
  const trimmed = input.trim();
  let r = 0,
    g = 0,
    b = 0;

  if (trimmed.startsWith("#")) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    } else {
      return null;
    }
  } else if (trimmed.startsWith("rgb")) {
    const m = trimmed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (m) {
      r = parseInt(m[1], 10);
      g = parseInt(m[2], 10);
      b = parseInt(m[3], 10);
    } else {
      return null;
    }
  } else {
    return null;
  }

  const hexVal =
    "#" +
    [r, g, b]
      .map((x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, "0"))
      .join("");
  const rgbVal = `rgb(${r}, ${g}, ${b})`;

  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      case bn:
        h = (rn - gn) / d + 4;
        break;
    }
    h /= 6;
  }

  const hslVal = `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

  return { hex: hexVal, rgb: rgbVal, hsl: hslVal };
}

function parseCron(expression: string): string {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return "Ошибка: cron должен содержать ровно 5 полей: [минута] [час] [день] [месяц] [день_недели]";
  }

  const [min, hour, day, month, dow] = parts;
  return `Разбор выражения:
  Минуты:       ${min}
  Часы:         ${hour}
  День месяца:  ${day}
  Месяц:        ${month}
  День недели:  ${dow}

Примерные интервалы:
${explainCronPart(min, hour, day, month, dow)}`;
}

function explainCronPart(min: string, hour: string, day: string, month: string, dow: string): string {
  if (min.startsWith("*/")) {
    return `→ Выполняется каждые ${min.replace("*/", "")} минут`;
  }
  if (min === "*" && hour === "*") {
    return "→ Выполняется каждую минуту";
  }
  if (min === "0" && hour.startsWith("*/")) {
    return `→ Выполняется каждые ${hour.replace("*/", "")} часов`;
  }
  if (min === "0" && hour === "0") {
    return "→ Выполняется раз в сутки в полночь";
  }
  return `→ Запуск в ${hour}:${min.padStart(2, "0")} (дней: ${day}, месяцев: ${month}, день недели: ${dow})`;
}

function formatSql(query: string): string {
  const keywords = [
    "SELECT", "FROM", "WHERE", "AND", "OR", "GROUP BY", "ORDER BY",
    "JOIN", "LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "LIMIT", "OFFSET",
    "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM", "HAVING"
  ];

  let formatted = query.trim();
  keywords.forEach((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, "gi");
    formatted = formatted.replace(regex, `\n${kw}`);
  });

  return formatted
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n  ");
}
