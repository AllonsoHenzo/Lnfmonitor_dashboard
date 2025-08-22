const express = require("express");
const si = require("systeminformation");
const router = express.Router();

let cache = { at: 0, payload: null };
const TTL_MS = 2000; // 2s

router.get("/processes", async (_req, res) => {
  try {
    const now = Date.now();
    if (cache.payload && now - cache.at < TTL_MS) {
      return res.json(cache.payload);
    }

    const procs = await si.processes();
    const rows = procs.list
      .map((p) => ({
        pid: p.pid,
        name: p.name || p.command || "unknown",
        user: p.user || "",
        cpu: Number(p.cpu || 0),
        ramMB: Number(p.memRss || 0) / 1024 / 1024,
      }))
      .sort((a, b) => b.cpu - a.cpu || b.ramMB - a.ramMB)
      .slice(0, 10);

    const payload = { updatedAt: now, rows };
    cache = { at: now, payload };
    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
