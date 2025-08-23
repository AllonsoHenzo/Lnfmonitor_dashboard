import { useEffect, useMemo, useRef, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const HEALTH_CANDIDATES = ["/health", "/api/health", "/metrics", "/"];
const DEFAULT_REFRESH_MS = Number(
  localStorage.getItem("lnf.autoRefreshMs") || "10000"
); // 10s
const DEGRADE_MS = 1200;

function urlsToPing() {
  const paths = HEALTH_CANDIDATES;
  return (API_BASE ? paths.map((p) => API_BASE + p) : paths).map((u) =>
    u
      .replace(/(?<!:)\/{2,}/g, "/")
      .replace("http:/", "http://")
      .replace("https:/", "https://")
  );
}

async function fetchOk(url, timeoutMs) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: ctrl.signal,
    });
    clearTimeout(id);
    return res.ok;
  } catch {
    clearTimeout(id);
    return false;
  }
}

function useApiHeartbeat({
  intervalMs = DEFAULT_REFRESH_MS,
  timeoutMs = 3000,
  degradeMs = DEGRADE_MS,
}) {
  const endpoints = useMemo(() => urlsToPing(), []);
  const [state, setState] = useState({
    level: "checking",
    online: null,
    latency: null,
    lastOk: null,
    endpoint: endpoints[0] || "",
  });

  useEffect(() => {
    let stopped = false;
    let t;

    const ping = async () => {
      if (stopped) return;

      if (!navigator.onLine) {
        setState((s) => ({
          ...s,
          level: "offline",
          online: false,
          latency: null,
        }));
        schedule();
        return;
      }

      const start = performance.now();
      let ok = false;
      let hit = "";
      for (const u of endpoints) {
        const res = await fetchOk(u, timeoutMs);
        if (res) {
          ok = true;
          hit = u;
          break;
        }
      }

      if (ok) {
        const ms = Math.round(performance.now() - start);
        setState({
          level: ms > degradeMs ? "degraded" : "online",
          online: true,
          latency: ms,
          lastOk: new Date(),
          endpoint: hit || endpoints[0] || "",
        });
      } else {
        setState((s) => ({
          ...s,
          level: "offline",
          online: false,
          latency: null,
        }));
      }

      schedule();
    };

    const schedule = () => {
      if (stopped) return;
      const wait = Number(
        localStorage.getItem("lnf.autoRefreshMs") || String(intervalMs)
      );
      t = setTimeout(ping, wait > 0 ? wait : 60000);
    };

    ping();

    const onOnline = () => ping();
    const onOffline = () =>
      setState((s) => ({
        ...s,
        level: "offline",
        online: false,
        latency: null,
      }));
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      stopped = true;
      clearTimeout(t);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return state;
}

function cls(...xs) {
  return xs.filter(Boolean).join(" ");
}

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 border border-white/10">
        <div className="h-2 w-2 rounded-full bg-slate-400/70" />
        <span className="text-slate-300 font-medium">
          {now.toLocaleDateString("pt-BR")}
        </span>
      </div>
      <div className="rounded-full bg-white/5 px-3 py-1.5 border border-white/10">
        <span className="text-slate-300 font-mono font-medium">
          {now.toLocaleTimeString("pt-BR")}
        </span>
      </div>
    </div>
  );
}
function SystemStatus({ refreshLabel = true }) {
  const { level, latency, lastOk } = useApiHeartbeat({});

  const styles = {
    online: {
      wrap: "bg-emerald-500/10 border-emerald-500/20",
      dot: "bg-emerald-400",
      text: "text-emerald-300",
    },
    degraded: {
      wrap: "bg-amber-400/10 border-amber-400/30",
      dot: "bg-amber-400",
      text: "text-amber-300",
    },
    offline: {
      wrap: "bg-rose-500/10 border-rose-500/30",
      dot: "bg-rose-400",
      text: "text-rose-300",
    },
    checking: {
      wrap: "bg-slate-500/10 border-slate-500/30",
      dot: "bg-slate-400",
      text: "text-slate-300",
    },
  }[level || "checking"];

  const label =
    level === "online"
      ? "ONLINE"
      : level === "degraded"
      ? "DEGRADED"
      : level === "offline"
      ? "OFFLINE"
      : "CHECKING";

  const title =
    `Status: ${label}` +
    (latency != null ? ` • ${latency} ms` : "") +
    (lastOk ? ` • Último OK: ${lastOk.toLocaleTimeString("pt-BR")}` : "");

  return (
    <div
      className={cls(
        "hidden md:flex items-center gap-2 rounded-full px-3 py-1.5 border",
        styles.wrap
      )}
      title={title}
    >
      <div
        className={cls(
          "h-2 w-2 rounded-full",
          styles.dot,
          level !== "offline" && "animate-pulse"
        )}
      />
      <span
        className={cls(
          "text-xs font-semibold uppercase tracking-wider",
          styles.text
        )}
      >
        {refreshLabel ? "Sistema " : ""}
        {label}
        {latency != null && level !== "offline" ? ` • ${latency}ms` : ""}
      </span>
    </div>
  );
}

function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(
    localStorage.getItem("lnf.compact") === "1"
  );
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("compact-ui", compact);
    localStorage.setItem("lnf.compact", compact ? "1" : "0");
  }, [compact]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement)
        await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch {}
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="hidden sm:flex items-center justify-center h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 group"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Abrir configurações"
      >
        <div className="h-4 w-4 relative">
          <div
            className="absolute inset-0 bg-slate-400 group-hover:bg-slate-300 transition-colors duration-200"
            style={{
              maskImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4'/%3E%3C/svg%3E\")",
              WebkitMaskImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4'/%3E%3C/svg%3E\")",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              maskSize: "contain",
            }}
          />
        </div>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-xl border border-white/10 bg-[#0b0f14]/95 backdrop-blur-xl shadow-xl shadow-black/30 p-2 z-50"
        >
          <div className="px-3 py-2 text-[11px] uppercase tracking-wider text-slate-400">
            Preferências
          </div>

          {/* Interface compacta */}
          <button
            role="menuitem"
            onClick={() => setCompact((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <span className="text-sm text-slate-200">Interface compacta</span>
            <span
              className={cls(
                "h-5 w-9 rounded-full p-0.5 transition",
                compact ? "bg-emerald-500/40" : "bg-white/10"
              )}
            >
              <span
                className={cls(
                  "block h-4 w-4 rounded-full bg-white transition",
                  compact ? "translate-x-4" : ""
                )}
              />
            </span>
          </button>

          <div className="my-2 border-t border-white/10" />

          {/* Tela cheia */}
          <button
            role="menuitem"
            onClick={toggleFullscreen}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <span className="text-sm text-slate-200">Alternar tela cheia</span>
            <span className="text-xs text-slate-400">F11</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const blurOn = localStorage.getItem("lnf.headerBlur") !== "0";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cls(
        "sticky top-0 z-50 transition-all duration-300 ease-in-out border-b",
        scrolled
          ? cls(
              blurOn ? "backdrop-blur-xl" : "backdrop-blur-0",
              "bg-[#0a0f16]/95 border-white/20 shadow-lg shadow-black/20"
            )
          : cls(
              blurOn ? "backdrop-blur-md" : "backdrop-blur-0",
              "bg-[#0e141b]/80 border-white/10"
            )
      )}
    >
      {/* Background decorativo com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo e título */}
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
            <div className="relative h-10 w-10 rounded-xl backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 overflow-hidden">
              <img
                src="/images/lnf_pulse_glyph_128.png"
                alt="LnfMonitor Logo"
                className="h-8 w-8 object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-300 bg-clip-text text-transparent tracking-tight">
              LnfMonitor
            </h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide">
              Dashboard de Monitoramento
            </p>
          </div>
        </div>

        {/* Seção direita com status, relógio e menu */}
        <div className="flex items-center gap-4">
          <SystemStatus />
          <Clock />
          <SettingsMenu />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
    </header>
  );
}
