import { useEffect, useState } from "react";
import { API_BASE } from "../utils/format";

export default function useStorage(pollMs = 15000) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const pull = async () => {
      try {
        const r = await fetch(`${API_BASE}/storage`, { cache: "no-store" });
        const j = await r.json();
        if (!mounted) return;
        setRows(j.rows || []);
        setLoading(false);
      } catch {
        if (mounted) setLoading(false);
      }
    };
    pull();
    const id = setInterval(pull, pollMs);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [pollMs]);

  return { rows, loading };
}
