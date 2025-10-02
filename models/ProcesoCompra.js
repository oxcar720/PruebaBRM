// models/ProcesoCompra.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./Usuario');
const Producto = require('./Producto');

const ProcesoCompra = sequelize.define('ProcesoCompra', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Producto,
      key: 'id'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  }
}, {
  tableName: 'Proceso_Compra',
  timestamps: false
});

ProcesoCompra.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
ProcesoCompra.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' });

Usuario.hasMany(ProcesoCompra, { foreignKey: 'id_usuario', as: 'procesosCompra' });
Producto.hasMany(ProcesoCompra, { foreignKey: 'id_producto', as: 'procesosCompra' });

module.exports = ProcesoCompra;
