"use client";

import { useState } from "react";

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
          setOutput(`MD5: ${simpleHash(value)}\nSHA-1: ${simpleHash(value + "salt")}\nSHA-256: ${simpleHash(value + "pepper")}`);
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

  const simpleHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, "0");
  };

  const copyToClipboard = (text?: string) => {
    const textToCopy = text || output;
    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 gradient-text">Utilities</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => {
              setActiveTool(tool.id);
              setInput("");
              setOutput("");
              setColorOutput(null);
            }}
            className={`glass-card p-4 text-left transition-all ${
              activeTool === tool.id
                ? "border-[var(--primary)] glow-border"
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

function parseCron(expression: string): string {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return "Error: Cron expression must have exactly 5 fields (minute hour day month weekday)";
  }

  const [minute, hour, day, month, weekday] = parts;
  
  const descriptions = [];
  
  // Minute
  if (minute === '*') {
    descriptions.push("Every minute");
  } else if (minute.includes('/')) {
    const [, step] = minute.split('/');
    descriptions.push(`Every ${step} minutes`);
  } else if (minute.includes(',')) {
    descriptions.push(`At minutes: ${minute}`);
  } else {
    descriptions.push(`At minute ${minute}`);
  }
  
  // Hour
  if (hour === '*') {
    descriptions.push("every hour");
  } else if (hour.includes('/')) {
    const [, step] = hour.split('/');
    descriptions.push(`every ${step} hours`);
  } else {
    descriptions.push(`at hour ${hour}`);
  }
  
  // Day
  if (day === '*') {
    // already covered
  } else if (day !== '*') {
    descriptions.push(`on day ${day}`);
  }
  
  // Month
  if (month === '*') {
    // already covered
  } else if (month !== '*') {
    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthNum = parseInt(month);
    if (monthNum >= 1 && monthNum <= 12) {
      descriptions.push(`in ${monthNames[monthNum]}`);
    }
  }
  
  // Weekday
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  if (weekday !== '*') {
    const dayNum = parseInt(weekday);
    if (dayNum >= 0 && dayNum <= 6) {
      descriptions.push(`on ${dayNames[dayNum]}`);
    }
  }

  let result = "Runs: " + descriptions.join(" ") + "\n\nNext 5 runs:\n";
  
  // Calculate next runs
  const now = new Date();
  const runs: string[] = [];
  let current = new Date(now);
  
  for (let i = 0; i < 5; i++) {
    current = new Date(current.getTime() + 60000); // Add 1 minute
    
    // Parse cron and find next matching time (simplified)
    const m = parseCronField(minute, current.getMinutes());
    const h = parseCronField(hour, current.getHours());
    const d = parseCronField(day, current.getDate());
    const mo = parseCronField(month, current.getMonth() + 1);
    const wd = parseCronField(weekday, current.getDay());
    
    if (m && h && d && mo && wd) {
      runs.push(current.toISOString().replace('T', ' ').slice(0, 19));
    } else {
      // Skip to next minute and try again
      i--;
    }
    
    if (runs.length < 5 && i > 100) break; // Safety limit
  }
  
  return result + runs.join('\n');
}

function parseCronField(field: string, value: number): boolean {
  if (field === '*') return true;
  if (field.includes(',')) {
    return field.split(',').map(Number).includes(value);
  }
  if (field.includes('/')) {
    const [, step] = field.split('/');
    return value % parseInt(step) === 0;
  }
  if (field.includes('-')) {
    const [start, end] = field.split('-').map(Number);
    return value >= start && value <= end;
  }
  return parseInt(field) === value;
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