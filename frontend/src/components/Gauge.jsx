export default function Gauge({ value = 0, color = "rgb(56 189 248)" }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="relative h-12 w-12">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(${color} ${pct * 3.6}deg,#192331 0)`,
        }}
      />
      <div className="absolute inset-1 rounded-full bg-[#0f1722]" />
      <span className="absolute inset-0 grid place-items-center text-xs font-semibold text-slate-200">
        {Math.round(pct)}%
      </span>
    </div>
  );
}
