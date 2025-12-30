require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conectarDB = require("./config/db");

const app = express();
conectarDB();

/* ===== MIDDLEWARE ===== */
app.use(cors({
  origin: "*",   // permite celular y laptop
  methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());

/* ===== RUTAS ===== */
app.use("/api/productos", require("./routes/productos"));
app.use("/api/movimientos", require("./routes/movimientos"));
app.use("/api/auth", require("./routes/auth"));

/* ===== SERVIDOR ESCUCHANDO EN TODAS LAS IPs ===== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});