// controllers/compraController.js
const ProcesoCompra = require("../models/ProcesoCompra");
const Producto = require("../models/Producto");
const Compra = require("../models/Compra");
const HistorialProducto = require("../models/HistorialProducto");
const Usuario = require("../models/Usuario");
const { Sequelize } = require("sequelize");
const getCompraProcess = async (req, res) => {
  try {
    const { id:id_usuario } = req.user;

    const resumen = await ProcesoCompra.findAll({
      where: { id_usuario },
      include: [{ model: Producto, as: "producto" }]
    });

    let totalProductos = 0;
    let precioTotal = 0;

    const productos = resumen.map(item => {
      totalProductos += item.cantidad;
      precioTotal += item.cantidad * item.producto.precio;

      return {
        id: item.producto.id,
        nombre: item.producto.nombre,
        nombre_lote: item.producto.nombre_lote,
        precio: item.producto.precio,
        cantidad: item.cantidad,
        subtotal: item.cantidad * item.producto.precio
      };
    });

    res.json({
      productos,
      totalProductos,
      precioTotal
    });
  } catch (error) {
    console.error("Error en getCompraProcess:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};


const addToProcess = async (req, res) => {
  try {
    const { id:id_usuario } = req.user;
    const { id_producto } = req.body;
    let {cantidad} = req.body;

    if (!id_producto || !cantidad) {
      return res.status(400).json({ error: "Faltan parámetros requeridos (id_producto, cantidad)" });
    }

    if (cantidad <= 0) {
      return res.status(400).json({ error: "La cantidad debe ser mayor a 0" });
    }

    const producto = await Producto.findByPk(id_producto);
    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const existente = await ProcesoCompra.findOne({
      where: { id_usuario, id_producto }
    });

    if(existente){
        cantidad+=existente.cantidad;
    }

    if(cantidad > producto.cantidad_disponible){
        return res.status(400).json({
            error: "No hay suficiente stock disponible",
            stockDisponible: producto.cantidad_disponible 
        })
    }

    if(existente){
      await existente.update({cantidad});
    }else{
      await ProcesoCompra.create({
        id_usuario,
        id_producto,
        cantidad
      });
    }

    const resumen = await ProcesoCompra.findAll({
      where: { id_usuario },
      include: [{ model: Producto, as: "producto" }]
    });

    const totalProductos = resumen.reduce((acc, item) => acc + item.cantidad, 0);
    const precioTotal = resumen.reduce(
      (acc, item) => acc + item.cantidad * item.producto.precio,
      0
    );

    res.json({
      mensaje: "Producto agregado en el carrito",
      totalProductos,
      precioTotal
    });
  } catch (error) {
    console.error("Error en addToProcess:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const realizarCompra = async (req, res) => {
  const t = await ProcesoCompra.sequelize.transaction();
  try {
    const { id:id_usuario } = req.user;

    const resumen = await ProcesoCompra.findAll({
      where: { id_usuario },
      include: [{ model: Producto, as: "producto" }],
      transaction: t
    });

    if (!resumen.length) {
      await t.rollback();
      return res.status(400).json({ error: "No hay productos en el proceso de compra" });
    }

    const precioTotal = resumen.reduce((acc, item) => acc + item.cantidad * item.producto.precio,0);

    const compra = await Compra.create(
      {
        id_usuario,
        fecha_compra: new Date(),
        precio_total: precioTotal
      },
      { transaction: t }
    );
    productos_comprados=[];
    for (const item of resumen) {
      await HistorialProducto.create(
        {
          id_compra: compra.id_compra,
          id_producto_hist: item.producto.id,
          nombre_lote: item.producto.nombre_lote,
          nombre: item.producto.nombre,
          precio_hist: item.producto.precio,
          stock_hist: item.producto.cantidad_disponible,
          fecha_hist: item.producto.fecha_ingreso,
          cantidad_comprada: item.cantidad
        },
        { transaction: t }
      );

      item.producto.cantidad_disponible -= item.cantidad;
      await item.producto.save({ transaction: t });

      productos_comprados.push({
        id_producto: item.producto.id,
        nombre_lote: item.producto.nombre_lote,
        nombre: item.producto.nombre,
        precio_unitario: item.producto.precio,
        cantidad: item.cantidad,
        subtotal: item.cantidad * item.producto.precio
      });
    }

    await ProcesoCompra.destroy({ where: { id_usuario }, transaction: t });

    await t.commit();
    res.json({ mensaje: "Compra realizada con éxito", compra, productos_comprados });
  } catch (error) {
    await t.rollback();
    console.error("Error en realizarCompra:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const clearProcess = async (req, res) => {
  try {
    const { id:id_usuario } = req.user;

    await ProcesoCompra.destroy({ where: { id_usuario } });

    res.json({ mensaje: "Carrito limpiado exitosamente" });
  } catch (error) {
    console.error("Error en clearProcess:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const removeProductFromProcess = async (req, res) => {
  try {
    const { id: id_usuario } = req.user;
    const { id_producto } = req.params;
    let { cantidad } = req.body; // opcional

    const item = await ProcesoCompra.findOne({
      where: { id_usuario, id_producto }
    });

    if (!item) {
      return res.status(404).json({ error: "El producto no está en el carrito" });
    }

    if (!cantidad || cantidad >= item.cantidad) {
      await item.destroy();
      return res.json({ mensaje: "Producto eliminado del carrito" });
    } else if (cantidad > 0 && cantidad < item.cantidad) {
      await item.update({ cantidad: item.cantidad - cantidad });
      return res.json({ mensaje: `Cantidad reducida en el carrito`, cantidad: item.cantidad - cantidad });
    } else {
      return res.status(400).json({ error: "Cantidad de productos a eliminar inválida" });
    }

  } catch (error) {
    console.error("Error en removeProductFromProcess:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const getHistorialUsuario = async (req, res) => {
  try {
    const { id:id_usuario } = req.user;

    const compras = await Compra.findAll({
      where: { id_usuario },
      include: [{ model: HistorialProducto, as: 'historial_productos'}],
      order: [['fecha_compra', 'DESC']]
    });

    if (!compras.length) {
      return res.json({ mensaje: "No hay compras en el historial" });
    }

    const historial = compras.map(compra => {
      const productos_comprados = compra.historial_productos.reduce(
        (acc, p) => acc + p.cantidad_comprada, 0
      );
      return {
        id_compra: compra.id_compra,
        fecha_compra: compra.fecha_compra,
        precio_total: compra.precio_total,
        productos_comprados,
        productos: compra.historial_productos.map(p => ({
          id_producto: p.id_producto_hist,
          nombre_lote: p.nombre_lote,
          nombre: p.nombre,
          precio_unitario: p.precio_hist,
          stock_historico: p.stock_hist,
          fecha_registro: p.fecha_hist,
          cantidad: p.cantidad_comprada
        }))
      }});

    res.json({ historial });

  } catch (error) {
    console.error("Error en getHistorialUsuario:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

const getListComprasClientes = async (req, res) => {
  try {

    const compras = await Compra.findAll({
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre_login', 'nombre', 'correo', 'telefono'] },
        { model: HistorialProducto, as: 'historial_productos' }
      ],
      order: [['fecha_compra', 'DESC']]
    });

    if (!compras.length) {
      return res.json({ mensaje: "No hay compras registradas" });
    }

    const historial = compras.map(compra => {
      const cantidad_total_productos = compra.historial_productos.reduce(
        (acc, p) => acc + p.cantidad_comprada, 0
      );

      return {
        id_compra: compra.id_compra,
        fecha_compra: compra.fecha_compra,
        cliente: {
          id: compra.usuario.id,
          nombre_login: compra.usuario.nombre_login,
          nombre: compra.usuario.nombre,
          correo: compra.usuario.correo,
          telefono: compra.usuario.telefono
        },
        precio_total: compra.precio_total,
        cantidad_total_productos,
        productos: compra.historial_productos.map(p => ({
          id_producto: p.id_producto_hist,
          nombre_lote: p.nombre_lote,
          nombre: p.nombre,
          precio_unitario: p.precio_hist,
          cantidad: p.cantidad_comprada
        }))
      };
    });

    res.json({ historial });
  } catch (error) {
    console.error("Error en getComprasAdmin:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};


module.exports = {
  addToProcess,
  getCompraProcess,
  realizarCompra,
  clearProcess,
  removeProductFromProcess,
  getHistorialUsuario,
  getListComprasClientes
};
