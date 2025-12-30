const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");

/**
 * 🔐 LOGIN
 * Ruta final:
 * POST https://ferreteria-alejandra.onrender.com/api/auth/login
 */
router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  // Validación básica
  if (!usuario || !password) {
    return res.status(400).json({
      msg: "Debe completar usuario y contraseña"
    });
  }

  try {
    // Buscar usuario en MongoDB
    const user = await Usuario.findOne({ usuario });

    if (!user) {
      return res.status(401).json({
        msg: "Usuario no existe"
      });
    }

    // Validar contraseña (texto plano, SIN tokens)
    if (user.password !== password) {
      return res.status(401).json({
        msg: "Contraseña incorrecta"
      });
    }

    // Login correcto
    return res.status(200).json({
      msg: "Login correcto",
      usuario: {
        id: user._id,
        usuario: user.usuario
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({
      msg: "Error al iniciar sesión"
    });
  }
});

module.exports = router;
