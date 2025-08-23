import React from "react";

export default function Card({
  title,
  children,
  className = "",
  headerActions = null,
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-slate-700/40 bg-gradient-to-br from-slate-800/30 via-slate-800/15 to-slate-900/30 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:border-slate-600/40 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_0%,rgba(255,255,255,0.02),transparent_60%)]" />
      {title && (
        <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-slate-700/20">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider group-hover:text-slate-200 transition-colors duration-300">
            {title}
          </h3>
          {headerActions && (
            <div className="flex items-center gap-2">{headerActions}</div>
          )}

          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse opacity-60" />
        </div>
      )}

      <div className={`relative z-10 ${title ? "p-4" : "p-4"}`}>{children}</div>

      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/5 group-hover:ring-white/8 transition-all duration-300" />
    </div>
  );
}
