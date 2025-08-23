const express = require("express");
const { exec } = require("child_process");
const { promisify } = require("util");

const router = express.Router();
const execAsync = promisify(exec);

router.get("/storage", async (req, res) => {
  try {
    let storageData = [];
    
    if (process.platform === "win32") {
      const { stdout } = await execAsync(
        "wmic logicaldisk get size,freespace,caption"
      );
      storageData = parseWindowsStorage(stdout);
    } else {
      const { stdout } = await execAsync("df -B1");
      storageData = parseLinuxStorage(stdout);
    }
    
    res.json({ rows: storageData });
  } catch (error) {
    console.error("Erro ao obter storage:", error);
    res.json({ rows: [] });
  }
});

function parseWindowsStorage(output) {
  const lines = output.trim().split("\n").slice(1); 
  const result = [];
  
  lines.forEach((line, index) => {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 3 && parts[0] && parts[1] && parts[2]) {
      const caption = parts[0];
      const freeSpace = parseInt(parts[1]);
      const totalSpace = parseInt(parts[2]);
      const usedSpace = totalSpace - freeSpace;
      const pct = totalSpace > 0 ? (usedSpace / totalSpace) * 100 : 0;
      
      result.push({
        id: `disk-${index}`,
        label: caption,
        totalBytes: totalSpace,
        usedBytes: usedSpace,
        freeBytes: freeSpace,
        pct: pct,
      });
    }
  });
  
  return result;
}

function parseLinuxStorage(output) {
  const lines = output.trim().split("\n").slice(1);
  const result = [];
  
  lines.forEach((line, index) => {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 6) {
      const filesystem = parts[0];
      const totalBytes = parseInt(parts[1]);
      const usedBytes = parseInt(parts[2]);
      const freeBytes = parseInt(parts[3]);
      const mountPoint = parts[5];
      const pct = totalBytes > 0 ? (usedBytes / totalBytes) * 100 : 0;
      if (filesystem.startsWith("/dev/") || mountPoint === "/") {
        result.push({
          id: `disk-${index}`,
          label: mountPoint,
          totalBytes: totalBytes,
          usedBytes: usedBytes,
          freeBytes: freeBytes,
          pct: pct,
        });
      }
    }
  });
  
  return result;
}

module.exports = router;