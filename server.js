require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const conectarDB = require("./backend/config/db");

const app = express();

// 🔌 MongoDB
conectarDB();

/* ===== MIDDLEWARE ===== */
app.use(cors());
app.use(express.json());

/* ===== RUTAS ===== */
app.use("/api/productos", require("./backend/routes/productos"));
app.use("/api/movimientos", require("./backend/routes/movimientos"));
app.use("/api/auth", require("./backend/routes/auth"));

/* ===== FRONTEND (VITE BUILD) ===== */
const frontendPath = path.join(__dirname, "frontend", "dist");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ===== SERVER ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});
