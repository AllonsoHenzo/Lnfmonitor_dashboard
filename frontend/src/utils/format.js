export const clamp = (n, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Number(n) || 0));
export const pct = (n) => `${Math.round(clamp(n))}%`;
export const bytes = (b) => {
  const x = Number(b) || 0;
  if (x < 1024) return `${x.toFixed(0)} B/s`;
  if (x < 1024 ** 2) return `${(x / 1024).toFixed(1)} KB/s`;
  if (x < 1024 ** 3) return `${(x / 1024 ** 2).toFixed(2)} MB/s`;
  return `${(x / 1024 ** 3).toFixed(2)} GB/s`;
};
export const rateMBs = (mb) => {
  if (!Number.isFinite(mb)) return "0 MB/s";
  return `${mb.toFixed(mb < 10 ? 2 : 1)} MB/s`;
};
export const prettyUptime = (s = 0) => {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
};

export const API_BASE = import.meta.env.VITE_API_URL;
