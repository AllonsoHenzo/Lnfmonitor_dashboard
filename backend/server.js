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

app.listen(PORT, () => {
  console.log(`LnfDash backend rodando em http://localhost:${PORT}`);
});
