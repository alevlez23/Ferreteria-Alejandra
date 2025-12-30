const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");

// Login
router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ msg: "Debe completar usuario y contraseña" });
  }

  try {
    // 1️⃣ Buscar usuario
    const user = await Usuario.findOne({ usuario });

    if (!user) {
      return res.status(401).json({ msg: "Usuario no existe" });
    }

    // 2️⃣ Validar contraseña
    if (user.password !== password) {
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    // 3️⃣ Login OK
    res.json({
      msg: "Login correcto",
      usuario: {
        id: user._id,
        usuario: user.usuario
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al iniciar sesión" });
  }
});

module.exports = router;
