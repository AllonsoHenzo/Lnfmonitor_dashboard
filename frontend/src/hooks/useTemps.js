import { useEffect, useState } from "react";
import { API_BASE } from "../utils/format";

export default function useTemps(pollMs = 4000) {
  const [data, setData] = useState({
    cpu: null,
    cpuMax: null,
    gpu: null,
    fanRpm: null,
    fanPercent: null,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;
    const pull = async () => {
      try {
        const r = await fetch(`${API_BASE}/temps`, { cache: "no-store" });
        const j = await r.json();
        if (!mounted) return;
        setData({
          cpu: j.cpu ?? null,
          cpuMax: j.cpuMax ?? null,
          gpu: j.gpu ?? null,
          fanRpm: j.fanRpm ?? null,
          fanPercent: j.fanPercent ?? null,
          loading: false,
        });
      } catch {
        if (!mounted) return;
        setData((d) => ({ ...d, loading: false }));
      }
    };
    pull();
    const id = setInterval(pull, pollMs);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [pollMs]);

  return data;
}
