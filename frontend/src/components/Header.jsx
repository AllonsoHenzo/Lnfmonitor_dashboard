import { useEffect, useState } from "react";

// reloginhoinho simples
function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="text-sm text-slate-400">{now.toLocaleDateString()} · {now.toLocaleTimeString()}</span>;
}

// header fixo
export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-[#0e141b]/80 backdrop-blur px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* logo + título */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/50 to-fuchsia-500/40" />
          <h1 className="text-xl font-semibold tracking-wide">LnfMonitor - System Dashboard</h1>
        </div>
        {/* reloginhoinho */}
        <Clock />
      </div>
    </header>
  );
}
