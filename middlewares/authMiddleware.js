// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || "mi_secreto_super_seguro";

function authMiddleware(rolesPermitidos = []) {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: "Token requerido" });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Token inválido o expirado, inicie sesión por favor" });
      }
      req.user = user;
      if (rolesPermitidos.length && !rolesPermitidos.includes(user.rol_id)) {
        return res.status(403).json({ error: "No tienes permisos suficientes"});
      }

      next();
    });
  };
}

module.exports = authMiddleware;
