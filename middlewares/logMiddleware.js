// middlewares/logMiddleware.js
const Registro = require('../models/Registro');

const logMiddleware = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (body) {
    res.locals.body = body;
    return originalSend.call(this, body);
  };

  res.on('finish', async () => {
    try {
      await Registro.create({
        tipo_peticion: req.method,
        url_peticion: req.originalUrl,
        respuesta_status: res.statusCode,
        contenido_peticion: Object.keys(req.body || {}).length ? JSON.stringify(req.body) : null,
        contenido_respuesta:
          typeof res.locals.body === 'string'
            ? res.locals.body
            : JSON.stringify(res.locals.body)
      });
    } catch (err) {
      console.error("Error guardando log:", err);
    }
  });

  next();
};

module.exports = logMiddleware;
