const express = require("express");
const si = require("systeminformation");

const router = express.Router();

let lastNet = null;
let lastNetTs = 0;

router.get("/stats", async (req, res) => {
  try {
    const [cpuLoad, mem, fs, iface] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      si.networkInterfaceDefault(),
    ]);
    const netArr = await si.networkStats(iface);

    const net0 = netArr?.[0] || {};
    const totalBytes = mem.total;
    const usedBytes =
      mem.active && mem.active > 0
        ? mem.active
        : mem.used && mem.used > 0
        ? mem.used
        : mem.total - (mem.available ?? mem.free ?? 0);

    let rxBps = Number(net0.rx_sec) || 0;
    let txBps = Number(net0.tx_sec) || 0;

    if (!rxBps && !txBps && lastNet) {
      const now = Date.now();
      const dt = Math.max(0.5, (now - lastNetTs) / 1000);
      rxBps = Math.max(0, (net0.rx_bytes - lastNet.rx_bytes) / dt);
      txBps = Math.max(0, (net0.tx_bytes - lastNet.tx_bytes) / dt);
      lastNetTs = now;
      lastNet = net0;
    } else {
      lastNetTs = Date.now();
      lastNet = net0;
    }

    res.json({
      cpu: Number(cpuLoad.currentLoad.toFixed(2)),
      ram: Number(((usedBytes / totalBytes) * 100).toFixed(2)),
      ramBytes: { used: usedBytes, total: totalBytes },
      disk: fs?.[0]?.use ?? 0,
      net: {
        rx_mbps: rxBps / 1024 ** 2,
        tx_mbps: txBps / 1024 ** 2,
        rx_bps: rxBps,
        tx_bps: txBps,
        rx_bytes: net0.rx_bytes ?? 0,
        tx_bytes: net0.tx_bytes ?? 0,
        iface: net0.iface || iface,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
