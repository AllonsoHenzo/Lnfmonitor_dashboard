const express = require("express");
const cors = require("cors");
const statsRoute = require("./routes/stats");

const app = express();
const PORT = 4000;

app.use(cors());
app.use("/api", statsRoute);

app.listen(PORT, () => {
  console.log(`LnfDash backend rodando em http://localhost:${PORT}`);
});
