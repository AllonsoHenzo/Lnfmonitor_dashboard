import { useEffect, useState } from "react";
import { API_BASE } from "../utils/format";

export default function useProcesses({ by = "cpu", limit = 10, pollMs = 5000 } = {}) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ total: 0, running: 0, loading: true });

  useEffect(() => {
    let mounted = true;
    const pull = async () => {
      try {
        const r = await fetch(`${API_BASE}/processes/top?by=${by}&limit=${limit}`, { cache: "no-store" });
        const j = await r.json();
        if (!mounted) return;
        setRows(j.list || []);
        setMeta({ total: j.total || 0, running: j.running || 0, loading: false });
      } catch {
        if (!mounted) return;
        setMeta(m => ({ ...m, loading: false }));
      }
    };
    pull();
    const id = setInterval(pull, pollMs);
    return () => { mounted = false; clearInterval(id); };
  }, [by, limit, pollMs]);

  return { rows, meta };
}
