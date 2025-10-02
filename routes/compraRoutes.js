// routes/userRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const compraController = require("../controllers/compraController");

const router = express.Router();

router.get('/cart', authMiddleware([1,2]), compraController.getCompraProcess);
router.post('/cart', authMiddleware([1,2]), compraController.addToProcess);
router.delete('/cart', authMiddleware([1,2]), compraController.clearProcess);
router.delete('/cart/:id_producto', authMiddleware([1,2]), compraController.removeProductFromProcess);
router.post('/cart/buy', authMiddleware([1,2]), compraController.realizarCompra);
router.get('/buy/history', authMiddleware([1,2]), compraController.getHistorialUsuario);
router.get('/buy/list/clients', authMiddleware([1]), compraController.getListComprasClientes);

module.exports = router;
