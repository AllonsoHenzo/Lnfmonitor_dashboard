const express = require("express");
const cors = require("cors");
const statsRoute = require("./routes/stats");
const processesRoute = require("./routes/processes");
const tempsRoute = require("./routes/temps");
const storageRoute = require("./routes/storage");
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use("/api", tempsRoute);
app.use("/api", storageRoute);
app.use("/api", statsRoute);
app.use("/api", processesRoute);

// endpoint de health
app.get('/api/health', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({
    ok: true,
    service: 'LnfDash',
    time: new Date().toISOString(),
    uptime: process.uptime(),
    routes: ['/api/temps','/api/storage','/api/stats','/api/processes'],
  });
});

app.head('/api/health', (req, res) => res.sendStatus(200));


app.listen(PORT, () => {
  console.log(`LnfDash backend rodando em http://localhost:${PORT}`);
});
