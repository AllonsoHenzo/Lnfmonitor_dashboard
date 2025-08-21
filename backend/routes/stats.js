const express = require("express");
const si = require("systeminformation");

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const cpu = await si.currentLoad();
    const mem = await si.mem(); 
    const disk = await si.fsSize();
    const net = await si.networkStats();
    const totalBytes = mem.total;
    const usedBytes  = mem.active || mem.used;

    res.json({
      cpu: Number(cpu.currentLoad.toFixed(2)),  
      ram: Number(((usedBytes / totalBytes) * 100).toFixed(2)),
      ramBytes: { used: usedBytes, total: totalBytes },
      disk: disk?.[0]?.use ?? 0,                              
      net: { rx: net?.[0]?.rx_bytes ?? 0, tx: net?.[0]?.tx_bytes ?? 0 }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TOP processes (by cpu|mem). Ex.: /api/processes/top?by=cpu&limit=10
router.get("/processes/top", async (req, res) => {
  try {
    const by = (req.query.by || "cpu").toLowerCase();   // "cpu" | "mem"
    const limit = Math.min(parseInt(req.query.limit || "10", 10), 50);

    const [procs, mem] = await Promise.all([si.processes(), si.mem()]);
    const totalMem = mem.total || 0;

    const rows = (procs.list || []).map(p => {
      // cpu (%) e mem (%). Alguns SOs trazem memRss em bytes; se não, aproxima por %
      const cpu = Number((p.cpu || 0).toFixed(1));
      const memPct = Number((p.mem || 0).toFixed(1));
      const rssBytes = p.memRss || p.mem_rss || Math.round((memPct / 100) * totalMem);
      return {
        pid: p.pid,
        name: p.name || p.command || "—",
        cpu,
        memPct,
        memBytes: rssBytes
      };
    });

    rows.sort((a, b) => {
      if (by === "mem") return (b.memBytes || 0) - (a.memBytes || 0);
      return (b.cpu || 0) - (a.cpu || 0);
    });

    res.json({
      total: procs.all,
      running: procs.running,
      list: rows.slice(0, limit)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


module.exports = router;
