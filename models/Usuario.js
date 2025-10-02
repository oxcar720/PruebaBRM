// models/Usuario.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const RolUsuario = require('./RolUsuario');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre_login: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING(60)
  },
  correo: {
    type: DataTypes.STRING(90),
    validate:{
      isEmail: true
    }
  },
  telefono: {
    type: DataTypes.STRING(15)
  },
  rol_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: RolUsuario,
      key: 'id'
    }
  }
}, {
  tableName: 'Usuarios',
  timestamps: false
});

Usuario.belongsTo(RolUsuario, {
  foreignKey: 'rol_id',
  as: 'rolUsuario'
});

module.exports = Usuario;
