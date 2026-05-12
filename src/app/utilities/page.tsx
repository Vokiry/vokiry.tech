"use client";

import { useState } from "react";
import { TerminalWindow } from "@/components/TerminalWindow";

const tools = [
  { id: "json", name: "JSON Formatter", description: "Format and validate JSON" },
  { id: "base64", name: "Base64 Encoder/Decoder", description: "Encode and decode Base64" },
  { id: "url", name: "URL Encoder/Decoder", description: "Encode and decode URLs" },
  { id: "hash", name: "Hash Generator", description: "Generate MD5, SHA-1, SHA-256 hashes" },
  { id: "color", name: "Color Converter", description: "Convert between HEX, RGB, HSL" },
  { id: "timestamp", name: "Timestamp Converter", description: "Convert Unix timestamps" },
  { id: "cron", name: "Cron Expression Parser", description: "Parse cron and show next runs" },
  { id: "sql", name: "SQL Formatter", description: "Pretty-print SQL queries" },
];

interface ColorOutput {
  hex: string;
  rgb: string;
  hsl: string;
}

export default function UtilitiesPage() {
  const [activeTool, setActiveTool] = useState("json");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [colorOutput, setColorOutput] = useState<ColorOutput | null>(null);

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
            setOutput(btoa(value));
          } else {
            setOutput(atob(value));
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
          setOutput("Computing...");
          computeHashes(value).then(setOutput);
          break;
        case "timestamp": {
          const ts = parseInt(value);
          if (!isNaN(ts)) {
            setOutput(new Date(ts * (value.length === 10 ? 1000 : 1)).toISOString());
          }
          break;
        }
        case "color": {
          const color = parseColor(value);
          if (color) {
            setColorOutput(color);
          }
          break;
        }
        case "cron": {
          const result = parseCron(value);
          setOutput(result);
          break;
        }
        case "sql": {
          setOutput(formatSql(value));
          break;
        }
        default:
          setOutput("");
      }
    } catch (e) {
      setOutput("Error: " + (e as Error).message);
    }
  };


  const copyToClipboard = (text?: string) => {
    const textToCopy = text || output;
    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 gradient-text">/utilities</h1>

      {/* Terminal Header */}
      <div className="mb-8 animate-scale-in">
        <TerminalWindow title="~ devtools">
          <pre className="text-[var(--text-primary)] font-mono text-sm">
<span className="text-[var(--section-accent)]">$</span> ls tools/
{tools.map(t => `${t.id}  `).join('')}
<span className="text-[var(--section-accent)]">$</span> _</pre>
        </TerminalWindow>
      </div>

      {/* Tools Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 stagger-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => {
              setActiveTool(tool.id);
              setInput("");
              setOutput("");
              setColorOutput(null);
            }}
            className={`terminal-card p-4 text-left transition-all hover-lift ${
              activeTool === tool.id
                ? "border-[var(--section-accent)] glow-border"
                : "hover:border-[var(--border-hover)]"
            }`}
          >
            <h3 className="font-medium mb-1">{tool.name}</h3>
            <p className="text-sm text-[var(--text-muted)]">{tool.description}</p>
          </button>
        ))}
      </div>

      {(activeTool === "base64" || activeTool === "url") && (
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-2 rounded text-sm ${
              mode === "encode"
                ? "bg-[var(--primary)] text-[var(--bg-primary)]"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-2 rounded text-sm ${
              mode === "decode"
                ? "bg-[var(--primary)] text-[var(--bg-primary)]"
                : "bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
            }`}
          >
            Decode
          </button>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
            Input
          </label>
          <textarea
            value={input}
            onChange={(e) => processInput(e.target.value, activeTool, mode)}
            className="w-full h-40 p-4 rounded-md bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] font-mono text-sm focus:border-[var(--primary)] focus:outline-none resize-y"
            placeholder={getPlaceholder(activeTool)}
          />
        </div>

        {activeTool === "color" && colorOutput ? (
          <div className="glass-card p-6">
            <div className="flex items-center gap-6">
              <div
                className="w-24 h-24 rounded-lg border border-[var(--border)]"
                style={{ backgroundColor: colorOutput.hex }}
              />
              <div className="space-y-2 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">HEX</span>
                  <button
                    onClick={() => copyToClipboard(colorOutput.hex)}
                    className="text-[var(--primary)] hover:underline text-sm"
                  >
                    Copy
                  </button>
                </div>
                <code className="block p-2 rounded bg-[var(--bg-secondary)] text-sm">
                  {colorOutput.hex}
                </code>
                
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">RGB</span>
                  <button
                    onClick={() => copyToClipboard(colorOutput.rgb)}
                    className="text-[var(--primary)] hover:underline text-sm"
                  >
                    Copy
                  </button>
                </div>
                <code className="block p-2 rounded bg-[var(--bg-secondary)] text-sm">
                  {colorOutput.rgb}
                </code>
                
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">HSL</span>
                  <button
                    onClick={() => copyToClipboard(colorOutput.hsl)}
                    className="text-[var(--primary)] hover:underline text-sm"
                  >
                    Copy
                  </button>
                </div>
                <code className="block p-2 rounded bg-[var(--bg-secondary)] text-sm">
                  {colorOutput.hsl}
                </code>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-[var(--text-secondary)]">Output</label>
              {output && (
                <button
                  onClick={() => copyToClipboard()}
                  className="text-sm text-[var(--primary)] hover:underline"
                >
                  Copy
                </button>
              )}
            </div>
            <pre className="w-full min-h-[10rem] p-4 rounded-md bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] font-mono text-sm overflow-auto whitespace-pre-wrap">
              {output || "Output will appear here..."}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

async function sha(algo: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512", text: string): Promise<string> {
  const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function md5(input: string): string {
  function rh(n: number) { let s = "", j; for (j = 0; j <= 3; j++) s += ((n >> (j * 8 + 4)) & 15).toString(16) + ((n >> (j * 8)) & 15).toString(16); return s; }
  function ad(x: number, y: number) { const l = (x & 0xffff) + (y & 0xffff); return (((x >> 16) + (y >> 16) + (l >> 16)) << 16) | (l & 0xffff); }
  function rl(n: number, c: number) { return (n << c) | (n >>> (32 - c)); }
  function cm(q: number, a: number, b: number, x: number, s: number, t: number) { return ad(rl(ad(ad(a, q), ad(x, t)), s), b); }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm((b & c) | (~b & d), a, b, x, s, t); }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm((b & d) | (c & ~d), a, b, x, s, t); }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm(b ^ c ^ d, a, b, x, s, t); }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cm(c ^ (b | ~d), a, b, x, s, t); }
  function cb(s: string) {
    const n = ((s.length + 8) >> 6) + 1; const b = new Array(n * 16).fill(0);
    let i; for (i = 0; i < s.length; i++) b[i >> 2] |= s.charCodeAt(i) << ((i % 4) * 8);
    b[i >> 2] |= 0x80 << ((i % 4) * 8); b[n * 16 - 2] = s.length * 8; return b;
  }
  const utf8 = unescape(encodeURIComponent(input));
  const x = cb(utf8); let a = 1732584193, b = -271733879, c = -1732584194, d = 271733878;
  for (let i = 0; i < x.length; i += 16) {
    const oa = a, ob = b, oc = c, od = d;
    a = ff(a, b, c, d, x[i + 0], 7, -680876936); d = ff(d, a, b, c, x[i + 1], 12, -389564586); c = ff(c, d, a, b, x[i + 2], 17, 606105819); b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
    a = ff(a, b, c, d, x[i + 4], 7, -176418897); d = ff(d, a, b, c, x[i + 5], 12, 1200080426); c = ff(c, d, a, b, x[i + 6], 17, -1473231341); b = ff(b, c, d, a, x[i + 7], 22, -45705983);
    a = ff(a, b, c, d, x[i + 8], 7, 1770035416); d = ff(d, a, b, c, x[i + 9], 12, -1958414417); c = ff(c, d, a, b, x[i + 10], 17, -42063); b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
    a = ff(a, b, c, d, x[i + 12], 7, 1804603682); d = ff(d, a, b, c, x[i + 13], 12, -40341101); c = ff(c, d, a, b, x[i + 14], 17, -1502002290); b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
    a = gg(a, b, c, d, x[i + 1], 5, -165796510); d = gg(d, a, b, c, x[i + 6], 9, -1069501632); c = gg(c, d, a, b, x[i + 11], 14, 643717713); b = gg(b, c, d, a, x[i + 0], 20, -373897302);
    a = gg(a, b, c, d, x[i + 5], 5, -701558691); d = gg(d, a, b, c, x[i + 10], 9, 38016083); c = gg(c, d, a, b, x[i + 15], 14, -660478335); b = gg(b, c, d, a, x[i + 4], 20, -405537848);
    a = gg(a, b, c, d, x[i + 9], 5, 568446438); d = gg(d, a, b, c, x[i + 14], 9, -1019803690); c = gg(c, d, a, b, x[i + 3], 14, -187363961); b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
    a = gg(a, b, c, d, x[i + 13], 5, -1444681467); d = gg(d, a, b, c, x[i + 2], 9, -51403784); c = gg(c, d, a, b, x[i + 7], 14, 1735328473); b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
    a = hh(a, b, c, d, x[i + 5], 4, -378558); d = hh(d, a, b, c, x[i + 8], 11, -2022574463); c = hh(c, d, a, b, x[i + 11], 16, 1839030562); b = hh(b, c, d, a, x[i + 14], 23, -35309556);
    a = hh(a, b, c, d, x[i + 1], 4, -1530992060); d = hh(d, a, b, c, x[i + 4], 11, 1272893353); c = hh(c, d, a, b, x[i + 7], 16, -155497632); b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
    a = hh(a, b, c, d, x[i + 13], 4, 681279174); d = hh(d, a, b, c, x[i + 0], 11, -358537222); c = hh(c, d, a, b, x[i + 3], 16, -722521979); b = hh(b, c, d, a, x[i + 6], 23, 76029189);
    a = hh(a, b, c, d, x[i + 9], 4, -640364487); d = hh(d, a, b, c, x[i + 12], 11, -421815835); c = hh(c, d, a, b, x[i + 15], 16, 530742520); b = hh(b, c, d, a, x[i + 2], 23, -995338651);
    a = ii(a, b, c, d, x[i + 0], 6, -198630844); d = ii(d, a, b, c, x[i + 7], 10, 1126891415); c = ii(c, d, a, b, x[i + 14], 15, -1416354905); b = ii(b, c, d, a, x[i + 5], 21, -57434055);
    a = ii(a, b, c, d, x[i + 12], 6, 1700485571); d = ii(d, a, b, c, x[i + 3], 10, -1894986606); c = ii(c, d, a, b, x[i + 10], 15, -1051523); b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
    a = ii(a, b, c, d, x[i + 8], 6, 1873313359); d = ii(d, a, b, c, x[i + 15], 10, -30611744); c = ii(c, d, a, b, x[i + 6], 15, -1560198380); b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
    a = ii(a, b, c, d, x[i + 4], 6, -145523070); d = ii(d, a, b, c, x[i + 11], 10, -1120210379); c = ii(c, d, a, b, x[i + 2], 15, 718787259); b = ii(b, c, d, a, x[i + 9], 21, -343485551);
    a = ad(a, oa); b = ad(b, ob); c = ad(c, oc); d = ad(d, od);
  }
  return rh(a) + rh(b) + rh(c) + rh(d);
}

async function computeHashes(text: string): Promise<string> {
  const [s1, s256, s512] = await Promise.all([sha("SHA-1", text), sha("SHA-256", text), sha("SHA-512", text)]);
  return `MD5:     ${md5(text)}\nSHA-1:   ${s1}\nSHA-256: ${s256}\nSHA-512: ${s512}`;
}

function getPlaceholder(tool: string): string {
  const placeholders: Record<string, string> = {
    json: '{"key": "value"}',
    base64: 'Enter text to encode/decode...',
    url: 'Enter URL to encode/decode...',
    hash: 'Enter text to hash...',
    color: '#14b8a6 or rgb(20, 184, 166) or hsl(172, 82%, 40%)',
    timestamp: '1704067200',
    cron: '* * * * *',
    sql: 'SELECT * FROM users WHERE id = 1',
  };
  return placeholders[tool] || "Enter input...";
}

function parseColor(input: string): ColorOutput | null {
  const trimmed = input.trim();
  
  let r = 0, g = 0, b = 0;
  
  // HEX
  if (trimmed.startsWith('#')) {
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
  }
  // RGB
  else if (trimmed.startsWith('rgb')) {
    const match = trimmed.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (match) {
      r = parseInt(match[1]);
      g = parseInt(match[2]);
      b = parseInt(match[3]);
    } else {
      return null;
    }
  }
  // HSL
  else if (trimmed.startsWith('hsl')) {
    const match = trimmed.match(/hsla?\s*\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/);
    if (match) {
      const h = parseInt(match[1]) / 360;
      const s = parseInt(match[2]) / 100;
      const l = parseInt(match[3]) / 100;
      const rgb = hslToRgb(h, s, l);
      r = rgb.r;
      g = rgb.g;
      b = rgb.b;
    } else {
      return null;
    }
  }
  // Try as plain hex without #
  else if (/^[0-9a-fA-F]{3,6}$/.test(trimmed)) {
    const hex = trimmed;
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
  } else {
    return null;
  }

  const hsl = rgbToHsl(r, g, b);
  
  return {
    hex: `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase(),
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
  };
}

function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const CRON_RANGES: Record<string, [number, number]> = {
  minute: [0, 59],
  hour: [0, 23],
  day: [1, 31],
  month: [1, 12],
  weekday: [0, 6],
};

function validateCronField(field: string, name: keyof typeof CRON_RANGES): string | null {
  const [min, max] = CRON_RANGES[name];
  if (field === "*") return null;

  const tokens = field.split(",");
  for (const tok of tokens) {
    const [rangePart, stepPart] = tok.split("/");
    if (stepPart !== undefined) {
      const step = parseInt(stepPart);
      if (!Number.isFinite(step) || step <= 0) return `${name}: invalid step "${stepPart}"`;
    }
    if (rangePart === "*") continue;
    if (rangePart.includes("-")) {
      const [a, b] = rangePart.split("-").map(Number);
      if (!Number.isFinite(a) || !Number.isFinite(b)) return `${name}: invalid range "${rangePart}"`;
      if (a < min || b > max || a > b) return `${name}: range ${a}-${b} out of bounds (${min}-${max})`;
    } else {
      const n = parseInt(rangePart);
      if (!Number.isFinite(n)) return `${name}: not a number "${rangePart}"`;
      if (n < min || n > max) return `${name}: value ${n} out of bounds (${min}-${max})`;
    }
  }
  return null;
}

function cronFieldMatches(field: string, value: number): boolean {
  if (field === "*") return true;
  for (const tok of field.split(",")) {
    const [rangePart, stepPart] = tok.split("/");
    const step = stepPart ? parseInt(stepPart) : 1;
    if (rangePart === "*") {
      if (value % step === 0) return true;
      continue;
    }
    if (rangePart.includes("-")) {
      const [a, b] = rangePart.split("-").map(Number);
      if (value >= a && value <= b && (value - a) % step === 0) return true;
    } else {
      const n = parseInt(rangePart);
      if (stepPart) {
        if (value >= n && (value - n) % step === 0) return true;
      } else if (value === n) {
        return true;
      }
    }
  }
  return false;
}

function describeField(field: string, name: string, unit: string): string {
  if (field === "*") return `every ${unit}`;
  if (field.includes("/")) {
    const [, step] = field.split("/");
    return `every ${step} ${unit}${parseInt(step) > 1 ? "s" : ""}`;
  }
  if (field.includes(",")) return `at ${name}s ${field}`;
  if (field.includes("-")) return `${name}s ${field}`;
  return `at ${name} ${field}`;
}

function parseCron(expression: string): string {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return "Error: Cron expression must have exactly 5 fields (minute hour day month weekday)";
  }

  const [minute, hour, day, month, weekday] = parts;
  const fields: [string, keyof typeof CRON_RANGES][] = [
    [minute, "minute"], [hour, "hour"], [day, "day"], [month, "month"], [weekday, "weekday"],
  ];
  for (const [val, name] of fields) {
    const err = validateCronField(val, name);
    if (err) return `Error: ${err}`;
  }

  const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const parts2: string[] = [];
  parts2.push(describeField(minute, "minute", "minute"));
  parts2.push(describeField(hour, "hour", "hour"));
  if (day !== "*") parts2.push(`on day ${day}`);
  if (month !== "*") {
    const n = parseInt(month);
    parts2.push(`in ${monthNames[n] ?? month}`);
  }
  if (weekday !== "*") {
    const n = parseInt(weekday);
    parts2.push(`on ${dayNames[n] ?? weekday}`);
  }

  const description = "Runs: " + parts2.join(", ");

  const runs: string[] = [];
  const current = new Date();
  current.setSeconds(0, 0);
  current.setMinutes(current.getMinutes() + 1);

  const MAX_ITER = 366 * 24 * 60;
  let iter = 0;
  while (runs.length < 5 && iter < MAX_ITER) {
    iter++;
    if (
      cronFieldMatches(minute, current.getMinutes()) &&
      cronFieldMatches(hour, current.getHours()) &&
      cronFieldMatches(day, current.getDate()) &&
      cronFieldMatches(month, current.getMonth() + 1) &&
      cronFieldMatches(weekday, current.getDay())
    ) {
      runs.push(current.toISOString().replace("T", " ").slice(0, 19));
    }
    current.setMinutes(current.getMinutes() + 1);
  }

  if (runs.length === 0) {
    return description + "\n\nNo upcoming runs within the next year.";
  }
  return description + "\n\nNext " + runs.length + " runs:\n" + runs.join("\n");
}

function formatSql(sql: string): string {
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 
    'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'JOIN', 
    'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN', 'ON',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
    'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'PRIMARY KEY',
    'FOREIGN KEY', 'REFERENCES', 'INDEX', 'UNIQUE', 'NULL', 'NOT NULL'
  ];

  let result = sql;
  
  // Uppercase keywords
  keywords.forEach(kw => {
    const regex = new RegExp('\\b' + kw.replace(' ', '\\s+') + '\\b', 'gi');
    result = result.replace(regex, kw);
  });
  
  // Add newlines before major keywords
  const breakKeywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'SET', 'VALUES'];
  breakKeywords.forEach(kw => {
    const regex = new RegExp('\\s+(' + kw.replace(' ', '\\s+') + ')\\b', 'gi');
    result = result.replace(regex, '\n$1');
  });
  
  // Clean up multiple newlines
  result = result.replace(/\n{3,}/g, '\n\n');
  
  // Add proper indentation
  const lines = result.split('\n');
  let indent = 0;
  const formatted = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    
    // Decrease indent for END statements
    if (trimmed.startsWith('WHERE') || trimmed.startsWith('AND') || trimmed.startsWith('OR')) {
      return '  ' + trimmed;
    }
    
    // Increase indent after FROM, WHERE, JOIN
    if (trimmed.match(/^(FROM|JOIN|WHERE|AND|OR|ORDER BY|GROUP BY|HAVING|LIMIT)/)) {
      indent = 1;
    }
    
    const indentStr = '  '.repeat(Math.min(indent, 3));
    return indentStr + trimmed;
  });
  
  return formatted.join('\n');
}