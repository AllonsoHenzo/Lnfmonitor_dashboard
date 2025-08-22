const express = require("express");
const si = require("systeminformation");

const router = express.Router();

router.get("/temps", async (_req, res) => {
  try {
    const [cpuTemp, gfx] = await Promise.all([
      si.cpuTemperature().catch(() => ({})),
      si.graphics().catch(() => ({ controllers: [] })),
    ]);

    // CPU
    const cpu = Number.isFinite(cpuTemp?.main) ? Number(cpuTemp.main) : null;
    const cpuMax = Number.isFinite(cpuTemp?.max) ? Number(cpuTemp.max) : null;

    // GPU + Fan (%)
    let gpu = null;
    let fanPercent = null;
    if (Array.isArray(gfx.controllers)) {
      for (const c of gfx.controllers) {
        if (gpu == null && Number.isFinite(c?.temperatureGpu))
          gpu = Number(c.temperatureGpu);
        if (fanPercent == null && Number.isFinite(c?.fanSpeed))
          fanPercent = Number(c.fanSpeed); // %
      }
    }

    res.json({ cpu, cpuMax, gpu, fanPercent, ts: Date.now() });
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) });
  }
});

module.exports = router;
