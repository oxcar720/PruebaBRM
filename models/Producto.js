//models/Producto.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Producto = sequelize.define('Producto', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_lote:{
    type: DataTypes.STRING(40),
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  precio: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  cantidad_disponible:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha_ingreso:{
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'Productos',
  timestamps: false
});

module.exports = Producto;