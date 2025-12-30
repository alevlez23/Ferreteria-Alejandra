require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const conectarDB = require("./config/db");

const app = express();

// Conectar MongoDB
conectarDB();

/* ===== MIDDLEWARE ===== */
app.use(cors({
  origin: "*",   // permite solicitudes desde cualquier origen
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

/* ===== RUTAS ===== */
app.use("/api/productos", require("./routes/productos"));
app.use("/api/movimientos", require("./routes/movimientos"));
app.use("/api/auth", require("./routes/auth"));

/* ===== SERVIR FRONTEND REACT ===== */
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

/* ===== SERVIDOR ESCUCHANDO EN TODAS LAS IPs ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});