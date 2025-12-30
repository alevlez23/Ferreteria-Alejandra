const mongoose = require("mongoose");

const MovimientoSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
  tipo: { type: String, enum: ["entrada", "salida"], required: true },
  cantidad: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Movimiento", MovimientoSchema);
