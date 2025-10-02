// models/Registro.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Registro = sequelize.define('Registro',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha_registro:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    url_peticion:{
        type:DataTypes.STRING,
        allowNull: false
    },
    tipo_peticion:{
        type: DataTypes.STRING(10),
        allowNull: false
    },
    respuesta_status:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    contenido_peticion:{
        type: DataTypes.TEXT
    },
    contenido_respuesta:{
        type: DataTypes.TEXT
    }
},{
    tableName: "Registros",
    timestamps: false
});

module.exports = Registro;