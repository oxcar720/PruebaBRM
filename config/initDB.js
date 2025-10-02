// config/initDB.js
const mysql = require('mysql2/promise');
const sequelize = require('./db');
require('dotenv').config();

async function sincronizarDatos() {
  try {
    const host=process.env.DB_HOST
    const user=process.env.DB_USER
    const password=process.env.PASS||""
    const database=process.env.DB_NAME
    const connection = await mysql.createConnection({
        host, user, password
    });
    await connection.query("CREATE DATABASE IF NOT EXISTS "+database);
    console.log("Base de datos ",database," verificada o creada.");
    await connection.end();

    // Cargar modelos y sincronizar
    const RolUsuario = require('../models/RolUsuario');
    const Usuario = require('../models/Usuario');
    const Producto = require('../models/Producto');
    const Compra = require("../models/Compra");
    const HistorialProducto = require("../models/HistorialProducto");
    const ProcesoCompra = require("../models/ProcesoCompra");
    await sequelize.sync({alter: true});

    await Promise.all([
      RolUsuario.findOrCreate({
        where:{id:1},
        defaults:{nombre:"admin"}
      }),
      RolUsuario.findOrCreate({
        where:{id:2},
        defaults:{nombre:"cliente"}
      })
    ]);

    await Promise.all([
      Usuario.findOrCreate({
        where:{id:1},
        defaults:{
          nombre_login:process.env.USERADMIN_LOGIN,
          password:process.env.USERADMIN_PASS,
          rol_id:1
        }
      }),
      Usuario.findOrCreate({
        where:{id:2},
        defaults:{
          nombre_login: process.env.DEVCLIENT_LOGIN,
          password: process.env.USERADMIN_PASS,
          rol_id:2
        }
      }),
      Producto.findOrCreate({
        where:{id:1},
        defaults:{
          nombre_lote:"lote 90",
          nombre: "teclado mecanico (producto Prueba)",
          precio: 239000,
          cantidad_disponible: 57,
          fecha_ingreso: "2017-07-03"
        }
      }),
      Producto.findOrCreate({
        where:{id:2},
        defaults:{
          nombre_lote:"lote 240",
          nombre: "Soplador limpiado 240w (producto Prueba)",
          precio: 150000,
          cantidad_disponible: 30,
          fecha_ingreso: "2022-07-03"
        }
      })
    ]);
    
    console.log("tablas sincronizadas correctamente");
  } catch (error) {
    console.error('Error creando/verificando la base de datos:', error);
    throw error;
  }
}

module.exports = sincronizarDatos;
