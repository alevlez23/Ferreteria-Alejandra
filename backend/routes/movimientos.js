const express = require("express");
const router = express.Router();
const Movimiento = require("../models/Movimiento");

router.get("/", async (req, res) => {
  try {
    const movimientos = await Movimiento.find()
      .populate("producto", "nombre")
      .sort({ fecha: -1 });

    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener movimientos", error });
  }
});

module.exports = router;
