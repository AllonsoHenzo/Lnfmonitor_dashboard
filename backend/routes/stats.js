const express = require("express");
const si = require("systeminformation");

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const cpu = await si.currentLoad();
    const mem = await si.mem();
    const disk = await si.fsSize();
    const net = await si.networkStats();

    res.json({
      cpu: cpu.currentLoad.toFixed(2),
      ram: ((mem.active / mem.total) * 100).toFixed(2), 
      disk: disk[0].use,                                
      net: {
        rx: net[0].rx_bytes,   
        tx: net[0].tx_bytes   
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
