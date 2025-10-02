// models/HistorialProducto.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Compra = require('./Compra');

const HistorialProducto = sequelize.define('HistorialProducto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_compra: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Compra,
      key: 'id_compra'
    }
  },
  id_producto_hist: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  nombre_lote: {
    type: DataTypes.STRING(40),
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  precio_hist: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  stock_hist: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_hist: {
    type: DataTypes.DATE,
    allowNull: false
  },
  cantidad_comprada: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'historial_productos',
  timestamps: false
});

Compra.hasMany(HistorialProducto, { foreignKey: 'id_compra', as: 'historial_productos'});
HistorialProducto.belongsTo(Compra, { foreignKey: 'id_compra' });

module.exports = HistorialProducto;
