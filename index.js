// index.js

const express = require('express');
require('dotenv').config();
const app = express();
const sequelize = require('./config/db');
const initDB = require('./config/initDB');
const logMiddleware = require('./middlewares/logMiddleware');
const loginRutas = require("./routes/loginRoutes");
const userRutas = require("./routes/userRoutes");
const productRutas = require("./routes/productoRoutes");
const compraRutas = require("./routes/compraRoutes");
const frontTestRutas = require("./frontTest/frontRoutes");
const logs = require("./routes/logRoutes");

app.use((req, res, next) => {//no registrar peticiones de pruebas front
  if (req.originalUrl.startsWith('/frontTest')) {
    return next();
  }
  return logMiddleware(req, res, next);
});

//Rutas Api
app.use(express.json());
app.use('/',loginRutas);
app.use('/',userRutas);
app.use('/',productRutas);
app.use('/',compraRutas);
app.use('/',logs);
//Rutas para pruebas de consume en front
app.use('/frontTest', frontTestRutas);

async function iniciarServidor(){
  try{
    await initDB();

    await sequelize.authenticate().then(()=>console.log("Conexion a base de datos exitosa."))
    .catch(err => console.error("No se pudo conectar con la base de datos: ",err));


    app.get('/test', (req, res) => {
      res.send({ mensaje: "Servidor funcionando correctamente " });
    });

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });

  }catch(error){
    console.log("Error al iniciar Servidor: ",error)
  }
}

iniciarServidor();
