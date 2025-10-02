const Producto = require('../models/Producto');

const createProducto = async (req, res) => {
  try {
    const { nombre_lote, nombre, precio, cantidad_disponible, fecha_ingreso } = req.body;

    if (!nombre_lote || !nombre || !precio || !cantidad_disponible || !fecha_ingreso) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const producto = await Producto.create({
      nombre_lote,
      nombre,
      precio,
      cantidad_disponible,
      fecha_ingreso
    });

    res.json({ mensaje: "Producto creado exitosamente", producto });
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const getProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_lote, nombre, precio, cantidad_disponible, fecha_ingreso } = req.body;

    const producto = await Producto.findByPk(id);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    await producto.update({
      nombre_lote,
      nombre,
      precio,
      cantidad_disponible,
      fecha_ingreso
    });

    res.json({ mensaje: "Producto actualizado exitosamente", producto });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    await producto.destroy();
    res.json({ mensaje: "Producto eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = {
  createProducto,
  getProductos,
  getProductoById,
  updateProducto,
  deleteProducto
};
