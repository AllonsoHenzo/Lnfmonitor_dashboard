// card genérico
export default function Card({ title, className = "", children }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-[#0f1722]/70 p-4 shadow-xl shadow-black/30 overflow-hidden ${className}`}>
      {/* título opcional */}
      {title && <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-sky-300/90">{title}</h3>}
      {/* conteúdo */}
      {children}
    </div>
  );
}
