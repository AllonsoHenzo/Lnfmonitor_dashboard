import { useEffect, useRef, useState } from "react";
import { API_BASE, clamp } from "../utils/format";

const len = (n, v = 0) => Array.from({ length: n }, () => v);
const pushFixed = (arr, v) => [...arr.slice(1), v];

// hook de métricas do sistema
export default function useSysMetrics(pollMs = 2000, cpuWindow = 40, netWindow = 20) {
  const [stats, setStats] = useState({ cpu: 0, ram: 0, disk: 0, net: { rx: 0, tx: 0, upBps: 0, downBps: 0 } });
  const [cpuSeries, setCpu] = useState(len(cpuWindow));
  const [ramSeries, setRam] = useState(len(cpuWindow));
  const [ramGBSeries, setRamGB] = useState(len(cpuWindow));
  const [upSeriesMBs, setUp] = useState(len(netWindow));
  const [downSeriesMBs, setDown] = useState(len(netWindow));
  const lastNet = useRef({ rx: 0, tx: 0, ts: Date.now() });

  useEffect(() => {
    let mounted = true;
    const tick = async () => {
      try {
        // chama API
        const res = await fetch(`${API_BASE}/stats`, { cache: "no-store" });
        const j = await res.json();
        if (!mounted) return;

        // normaliza métricas
        const cpu = clamp(j.cpu);
        const ram = clamp(j.ram);
        const disk = clamp(j.disk);
        const usedGB = (j?.ramBytes?.used || 0) / (1024 ** 3);
        const totalGB = (j?.ramBytes?.total || 0) / (1024 ** 3);
        const rx = Number(j?.net?.rx || 0);
        const tx = Number(j?.net?.tx || 0);

        // calcula tráfego
        const ts = Date.now();
        const dt = Math.max(1, (ts - lastNet.current.ts) / 1000);
        const downBps = Math.max(0, (rx - lastNet.current.rx) / dt);
        const upBps = Math.max(0, (tx - lastNet.current.tx) / dt);
        lastNet.current = { rx, tx, ts };

        // atualiza estados
        setStats({ cpu, ram, disk, net: { rx, tx, upBps, downBps }, memGB: { used: usedGB, total: totalGB } });
        setCpu(s => pushFixed(s, cpu));
        setRam(s => pushFixed(s, ram));
        setRamGB(s => pushFixed(s, usedGB));
        setUp(s => pushFixed(s, upBps / 1024 ** 2));    // MB/s
        setDown(s => pushFixed(s, downBps / 1024 ** 2)); // MB/s
      } catch (e) {
        // fallback mock
        setStats(prev => {
          const j = () => (Math.random() - 0.5) * 6;
          const cpu = clamp((prev.cpu || 30) + j());
          const ram = clamp((prev.ram || 55) + j());
          const disk = clamp((prev.disk || 70) + (Math.random() - 0.5) * 2);
          const upBps = Math.abs((prev.net.upBps || 250_000) + (Math.random() - 0.5) * 120_000);
          const downBps = Math.abs((prev.net.downBps || 800_000) + (Math.random() - 0.5) * 250_000);
          setCpu(s => pushFixed(s, cpu));
          setRam(s => pushFixed(s, ram));
          setUp(s => pushFixed(s, upBps / 1024 ** 2));
          setDown(s => pushFixed(s, downBps / 1024 ** 2));
          return { cpu, ram, disk, net: { rx: 0, tx: 0, upBps, downBps } };
        });
      }
    };

    tick();
    const id = setInterval(tick, pollMs);
    return () => { mounted = false; clearInterval(id); };
  }, [pollMs, cpuWindow, netWindow]);

  // retorno
  return { stats, cpuSeries, ramSeries, ramGBSeries, upSeriesMBs, downSeriesMBs };
}
