const express = require("express");
const router = express.Router();
const Producto = require("../models/Producto");
const Movimiento = require("../models/Movimiento");

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener productos" });
  }
});

// Crear producto y registrar movimiento
router.post("/", async (req, res) => {
  try {
    const { nombre, categoria, precio, stock } = req.body;

    if (!nombre || !categoria || precio == null || stock == null) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const nuevoProducto = new Producto({ nombre, categoria, precio, stock });
    const productoGuardado = await nuevoProducto.save();

    const movimiento = new Movimiento({
      producto: productoGuardado._id,
      tipo: "entrada",
      cantidad: stock,
      fecha: new Date(),
    });

    await movimiento.save();

    res.status(201).json(productoGuardado);
  } catch (error) {
    res.status(500).json({ msg: "Error al crear producto" });
  }
});

// Actualizar producto
router.put("/:id", async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    const stockAnterior = producto.stock;

    producto.nombre = req.body.nombre ?? producto.nombre;
    producto.categoria = req.body.categoria ?? producto.categoria;
    producto.precio = req.body.precio ?? producto.precio;
    producto.stock = req.body.stock ?? producto.stock;

    const actualizado = await producto.save();

    if (actualizado.stock !== stockAnterior) {
      const tipo = actualizado.stock > stockAnterior ? "entrada" : "salida";
      const cantidad = Math.abs(actualizado.stock - stockAnterior);

      await new Movimiento({
        producto: actualizado._id,
        tipo,
        cantidad,
        fecha: new Date(),
      }).save();
    }

    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar producto" });
  }
});

// Eliminar producto
router.delete("/:id", async (req, res) => {
  try {
    const eliminado = await Producto.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }
    res.json({ msg: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar producto" });
  }
});

module.exports = router;
