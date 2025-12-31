require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const conectarDB = require("./config/db");

const app = express();

// Conexión a BD
conectarDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas backend / API
app.use("/api/productos", require("./routes/productos"));
app.use("/api/movimientos", require("./routes/movimientos"));
app.use("/api/auth", require("./routes/auth"));

// ===== SERVIR FRONTEND (VITE DIST) =====
const frontendPath = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
