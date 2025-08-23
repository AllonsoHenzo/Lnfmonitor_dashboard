const { Router } = require("express");
const { execFile } = require("child_process");
const router = Router();

router.get("/processes", (_req, res) => {
  const env = { ...process.env, LANG: "C", LC_ALL: "C" };
  execFile(
    "/usr/bin/ps",
    ["-eo", "pid,comm,pcpu,pmem,rss,user", "--no-headers", "--sort=-pcpu"],
    { env },
    (err, stdout) => {
      if (err) return res.json({ updatedAt: Date.now(), rows: [] });

      const rows = stdout
        .trim().split("\n").slice(0, 15)
        .map((line) => {
          const p = line.trim().split(/\s+/);
          if (p.length < 6) return null;
          const [pid, comm, pcpu, _pmem, rssKB, user] = p;
          const ramMB = Math.round((Number(rssKB) / 1024) * 100) / 100;
          return { pid: +pid, name: comm, cpu: +pcpu, ramMB, user };
        })
        .filter(Boolean)
        .filter(pr => !(pr.name === 'ps' || (pr.name === 'node' && pr.user === 'lnfmon')));

      res.json({ updatedAt: Date.now(), rows });
    }
  );
});
module.exports = router;
