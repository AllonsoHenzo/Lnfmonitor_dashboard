import { useEffect, useRef, useState } from "react";
import { API_BASE, clamp } from "../utils/format";

const len = (n, v = 0) => Array.from({ length: n }, () => v);
const pushFixed = (arr, v) => [...arr.slice(1), v];

export default function useSysMetrics(
  pollMs = 2000,
  cpuWindow = 40,
  netWindow = 20
) {
  const [stats, setStats] = useState({
    cpu: 0,
    ram: 0,
    disk: 0,
    net: { upMBs: 0, downMBs: 0 },
  });
  const [cpuSeries, setCpu] = useState(len(cpuWindow));
  const [ramSeries, setRam] = useState(len(cpuWindow));
  const [ramGBSeries, setRamGB] = useState(len(cpuWindow));
  const [upSeriesMBs, setUp] = useState(len(netWindow));
  const [downSeriesMBs, setDown] = useState(len(netWindow));

  const lastNet = useRef({ rxBytes: 0, txBytes: 0, ts: 0 });

  useEffect(() => {
    let mounted = true;

    const tick = async () => {
      try {
        const res = await fetch(`${API_BASE}/stats`, { cache: "no-store" });
        const j = await res.json();
        if (!mounted) return;

        // básicos
        const cpu = clamp(j.cpu);
        const ram = clamp(j.ram);
        const disk = clamp(j.disk);

        // RAM em GB
        const usedGB = (j?.ramBytes?.used || 0) / 1024 ** 3;
        const totalGB = (j?.ramBytes?.total || 0) / 1024 ** 3;

        // velocidades
        let upMBs = Number(j?.net?.tx_mbps ?? 0);
        let downMBs = Number(j?.net?.rx_mbps ?? 0);

        // fallback
        if (!upMBs && !downMBs && j?.net?.rx != null && j?.net?.tx != null) {
          const now = Date.now();
          const dt = Math.max(0.5, (now - (lastNet.current.ts || now)) / 1000);
          const downBps = Math.max(
            0,
            (j.net.rx - (lastNet.current.rxBytes || 0)) / dt
          );
          const upBps = Math.max(
            0,
            (j.net.tx - (lastNet.current.txBytes || 0)) / dt
          );
          lastNet.current = { rxBytes: j.net.rx, txBytes: j.net.tx, ts: now };
          upMBs = upBps / 1024 ** 2;
          downMBs = downBps / 1024 ** 2;
        } else {
          if (j?.net?.rx != null && j?.net?.tx != null) {
            lastNet.current = {
              rxBytes: j.net.rx,
              txBytes: j.net.tx,
              ts: Date.now(),
            };
          }
        }
        setStats({
          cpu,
          ram,
          disk,
          memGB: { used: usedGB, total: totalGB },
          net: { upMBs, downMBs },
        });
        setCpu((s) => pushFixed(s, cpu));
        setRam((s) => pushFixed(s, ram));
        setRamGB((s) => pushFixed(s, usedGB));
        setUp((s) => pushFixed(s, upMBs));
        setDown((s) => pushFixed(s, downMBs));
      } catch {
        // fallback mock
        setStats((prev) => {
          const j = () => (Math.random() - 0.5) * 6;
          const cpu = clamp((prev.cpu || 30) + j());
          const ram = clamp((prev.ram || 55) + j());
          const disk = clamp((prev.disk || 70) + (Math.random() - 0.5) * 2);
          const upMBs = Math.abs(
            (prev.net?.upMBs || 0.25) + (Math.random() - 0.5) * 0.12
          );
          const downMBs = Math.abs(
            (prev.net?.downMBs || 0.8) + (Math.random() - 0.5) * 0.25
          );
          setCpu((s) => pushFixed(s, cpu));
          setRam((s) => pushFixed(s, ram));
          setUp((s) => pushFixed(s, upMBs));
          setDown((s) => pushFixed(s, downMBs));
          return { cpu, ram, disk, net: { upMBs, downMBs } };
        });
      }
    };

    tick();
    const id = setInterval(tick, pollMs);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [pollMs, cpuWindow, netWindow]);

  return {
    stats,
    cpuSeries,
    ramSeries,
    ramGBSeries,
    upSeriesMBs,
    downSeriesMBs,
  };
}
