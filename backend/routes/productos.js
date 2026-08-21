const express = require("express");
const router = express.Router();

const Producto = require("../models/Producto");
const Movimiento = require("../models/Movimiento");

// =====================================================
// OBTENER TODOS LOS PRODUCTOS
// =====================================================
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find();

    res.json(productos);
  } catch (error) {
    console.error(
      "Error al obtener productos:",
      error
    );

    res.status(500).json({
      msg: "Error al obtener productos",
    });
  }
});

// =====================================================
// CREAR PRODUCTO
// =====================================================
router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      categoria,
      precio,
      stock,
    } = req.body;

    // Validar campos obligatorios
    if (
      !nombre ||
      !categoria ||
      precio === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({
        msg: "Todos los campos son obligatorios",
      });
    }

    const nombreLimpio =
      String(nombre).trim();

    const categoriaLimpia =
      String(categoria).trim();

    const precioNumero =
      Number(precio);

    const stockNumero =
      Number(stock);

    // Validar nombre
    if (!nombreLimpio) {
      return res.status(400).json({
        msg: "El nombre es obligatorio",
      });
    }

    // Validar categoría
    if (!categoriaLimpia) {
      return res.status(400).json({
        msg: "La categoría es obligatoria",
      });
    }

    // Validar precio
    if (
      !Number.isFinite(precioNumero) ||
      precioNumero <= 0
    ) {
      return res.status(400).json({
        msg: "El precio debe ser mayor que 0",
      });
    }

    // Validar stock
    if (
      !Number.isInteger(stockNumero) ||
      stockNumero < 0
    ) {
      return res.status(400).json({
        msg:
          "El stock debe ser un número entero igual o mayor que 0",
      });
    }

    // Crear producto
    const nuevoProducto =
      new Producto({
        nombre: nombreLimpio,
        categoria: categoriaLimpia,
        precio: precioNumero,
        stock: stockNumero,
      });

    const productoGuardado =
      await nuevoProducto.save();

    // Registrar la entrada inicial únicamente
    // cuando el stock sea mayor que cero.
    if (stockNumero > 0) {
      const movimiento =
        new Movimiento({
          producto:
            productoGuardado._id,
          tipo: "entrada",
          cantidad: stockNumero,
          fecha: new Date(),
        });

      await movimiento.save();
    }

    res
      .status(201)
      .json(productoGuardado);
  } catch (error) {
    console.error(
      "Error al crear producto:",
      error
    );

    res.status(500).json({
      msg: "Error al crear producto",
    });
  }
});

// =====================================================
// ACTUALIZAR PRODUCTO
// =====================================================
router.put("/:id", async (req, res) => {
  try {
    const producto =
      await Producto.findById(
        req.params.id
      );

    if (!producto) {
      return res.status(404).json({
        msg: "Producto no encontrado",
      });
    }

    // Guardamos el stock antes de modificarlo.
    const stockAnterior =
      Number(producto.stock);

    // =================================================
    // ACTUALIZAR NOMBRE
    // =================================================
    if (req.body.nombre !== undefined) {
      const nombre =
        String(
          req.body.nombre
        ).trim();

      if (!nombre) {
        return res.status(400).json({
          msg:
            "El nombre no puede estar vacío",
        });
      }

      producto.nombre = nombre;
    }

    // =================================================
    // ACTUALIZAR CATEGORÍA
    // =================================================
    if (
      req.body.categoria !==
      undefined
    ) {
      const categoria =
        String(
          req.body.categoria
        ).trim();

      if (!categoria) {
        return res.status(400).json({
          msg:
            "La categoría no puede estar vacía",
        });
      }

      producto.categoria =
        categoria;
    }

    // =================================================
    // ACTUALIZAR PRECIO
    // =================================================
    if (
      req.body.precio !== undefined
    ) {
      const nuevoPrecio =
        Number(req.body.precio);

      if (
        !Number.isFinite(
          nuevoPrecio
        ) ||
        nuevoPrecio <= 0
      ) {
        return res.status(400).json({
          msg:
            "El precio debe ser mayor que 0",
        });
      }

      producto.precio =
        nuevoPrecio;
    }

    // =================================================
    // ACTUALIZAR STOCK
    // =================================================
    if (
      req.body.stock !== undefined
    ) {
      const nuevoStock =
        Number(req.body.stock);

      // No permitir decimales ni stock negativo
      if (
        !Number.isInteger(
          nuevoStock
        ) ||
        nuevoStock < 0
      ) {
        return res.status(400).json({
          msg:
            "El stock debe ser un número entero igual o mayor que 0",
        });
      }

      producto.stock =
        nuevoStock;
    }

    // Guardar producto actualizado
    const actualizado =
      await producto.save();

    const stockNuevo =
      Number(actualizado.stock);

    // =================================================
    // REGISTRAR ENTRADA O SALIDA
    // =================================================
    if (
      stockNuevo !==
      stockAnterior
    ) {
      const tipo =
        stockNuevo >
        stockAnterior
          ? "entrada"
          : "salida";

      const cantidad =
        Math.abs(
          stockNuevo -
            stockAnterior
        );

      const movimiento =
        new Movimiento({
          producto:
            actualizado._id,
          tipo,
          cantidad,
          fecha: new Date(),
        });

      await movimiento.save();
    }

    res.json(actualizado);
  } catch (error) {
    console.error(
      "Error al actualizar producto:",
      error
    );

    res.status(500).json({
      msg:
        "Error al actualizar producto",
    });
  }
});

// =====================================================
// ELIMINAR PRODUCTO
// =====================================================
router.delete("/:id", async (req, res) => {
  try {
    const eliminado =
      await Producto.findByIdAndDelete(
        req.params.id
      );

    if (!eliminado) {
      return res.status(404).json({
        msg: "Producto no encontrado",
      });
    }

    res.json({
      msg:
        "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error(
      "Error al eliminar producto:",
      error
    );

    res.status(500).json({
      msg:
        "Error al eliminar producto",
    });
  }
});

module.exports = router;
