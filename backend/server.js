require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const conectarDB = require("./config/db");

const app = express();

/* ===== CONEXIÓN A BASE DE DATOS ===== */
conectarDB();

/* ===== MIDDLEWARE ===== */
app.use(cors());
app.use(express.json());

/* ===== RUTAS API ===== */
app.use("/api/productos", require("./routes/productos"));
app.use("/api/movimientos", require("./routes/movimientos"));
app.use("/api/auth", require("./routes/auth"));

/* ===== SERVIR FRONTEND (VITE DIST) ===== */
// Como server.js está en /backend, subimos un nivel antes de ir al dist
const frontendPath = path.join(__dirname, "..", "frontend", "dist");

// Archivos estáticos del frontend
app.use(express.static(frontendPath));

// Si no está en /api, devolvemos index.html (para React Router / Vite)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ===== PUERTO SERVIDOR ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
