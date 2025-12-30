require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const conectarDB = require("./config/db");

const app = express();

// 🔌 Conectar MongoDB
conectarDB();

/* ===== MIDDLEWARE ===== */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

/* ===== RUTAS API ===== */
app.use("/api/productos", require("./routes/productos"));
app.use("/api/movimientos", require("./routes/movimientos"));
app.use("/api/auth", require("./routes/auth"));

/* ===== SERVIR FRONTEND (VITE BUILD) ===== */
const frontendPath = path.join(__dirname, "../frontend/dist");

// Servir archivos estáticos (JS, CSS, assets)
app.use(express.static(frontendPath));

// Para React Router (evita pantalla blanca)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* ===== INICIAR SERVIDOR ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
