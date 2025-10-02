// controllers/userController.js
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

const createUser = async (req, res) => {
  try {
    const { nombre_login, password, nombre, correo, telefono, rol_id } = req.body;

    tituloError="Error al crear usuario: ";
    if (!nombre_login) {
      return res.status(400).json({ error: tituloError+"no se ingresó nombre_login" });
    }
    if (!password) {
      return res.status(400).json({ error: tituloError+"no se ingresó password" });
    }
    if (!rol_id) {
      return res.status(400).json({ error: tituloError+"no se ingresó rol_id" });
    }

    const existente = await Usuario.findOne({ where: { nombre_login } });
    if (existente) {
      return res.status(400).json({ error: tituloError+"nombre_login ya existe" });
    }

    const saltRounds = 10;

    await Usuario.create({
      nombre_login,
      password: await bcrypt.hash(password, saltRounds),
      nombre,
      correo,
      telefono,
      rol_id: rol_id
    });

    res.json({ mensaje: "Creación de usuario exitosa" });

  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: `Error al crear usuario: ${error.message}` });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] }, // no exponer passwords
      include: [{ association: 'rolUsuario', attributes: ['nombre'] }]
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_login, password, nombre, correo, telefono, rol_id } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    let hashedPassword = usuario.password;
    if (password) {
      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);
    }

    await usuario.update({
      nombre_login: nombre_login || usuario.nombre_login,
      password: hashedPassword,
      nombre: nombre || usuario.nombre,
      correo: correo || usuario.correo,
      telefono: telefono || usuario.telefono,
      rol_id: rol_id || usuario.rol_id
    });

    res.json({ mensaje: "Usuario actualizado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    await usuario.destroy();
    res.json({ mensaje: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser
};
