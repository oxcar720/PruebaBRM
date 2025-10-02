// models/RolUsuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RolUsuario = sequelize.define('RolUsuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
}, {
  tableName: 'Rol_Usuarios',
  timestamps: false
});

module.exports = RolUsuario;
