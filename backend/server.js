const express = require("express");
const cors = require("cors");

const statsRoute = require("./routes/stats");
const processesRoute = require("./routes/processes");
const tempsRoute = require("./routes/temps");
const storageRoute = require("./routes/storage");

const app = express();
const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || "127.0.0.1";

app.use(cors());
app.use(express.json());
app.use("/api", tempsRoute);
app.use("/api", storageRoute);
app.use("/api", statsRoute);
app.use("/api", processesRoute);

app.get("/api/health", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ ok: true, service: "LnfDash", time: new Date().toISOString() });
});
app.head("/api/health", (_, res) => res.sendStatus(200));

app.listen(PORT, HOST, () => {
  console.log(`LnfDash backend rodando em http://${HOST}:${PORT}`);
});
