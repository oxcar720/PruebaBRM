// frontTest/frontRoutes.js
const express = require('express');
const path = require('path');

const router = express.Router();

const frontPath = path.join(__dirname);

router.get('/', (req, res) => {
  res.sendFile(path.join(frontPath, 'index.html'));
});
// Servir todos los archivos estáticos de /frontTest
router.use('/', express.static(path.join(__dirname)));

// Exportar el router
module.exports = router;
