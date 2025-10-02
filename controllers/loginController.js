//controller/loginController.js
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const RolUsuario = require("../models/RolUsuario");

const SECRET = process.env.JWT_SECRET || "token_secreto_que_viene_por_default_en_el_codigo_xD";

const login = async (req, res) => {
  try {
    const { nombre_login, password } = req.body;

    if (!nombre_login || !password) {
      return res.status(400).json({ error: "Faltan datos: nombre_login y password" });
    }

    const usuario = await Usuario.findOne({ where: { nombre_login }, include: [{model:RolUsuario, as: "rolUsuario"}] });
    if (!usuario) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    if (!await bcrypt.compare(password, usuario.password)) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { 
        id: usuario.id, 
        nombre: usuario.nombre,
        rol_id: usuario.rol_id,
        rol_usuario: usuario.rolUsuario.nombre
      },
      SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre||usuario.nombre_login,
        rol_id: usuario.rol_id,
        rol: usuario.rolUsuario.nombre
      }
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = { login };