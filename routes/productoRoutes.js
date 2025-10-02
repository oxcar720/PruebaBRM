// routes/userRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const productoCrud = require("../controllers/productoController")

const router = express.Router();
//CRUD productos 
// Solo admins (rol_id = 1) pueden crear, actualizar y eliminar productos
router.get('/products', authMiddleware([1,2]), productoCrud.getProductos);
router.get('/product/:id', authMiddleware([1,2]), productoCrud.getProductoById);
router.post('/create_product', authMiddleware([1]), productoCrud.createProducto);
router.put('/update_product/:id', authMiddleware([1]), productoCrud.updateProducto);
router.delete('/delete_product/:id', authMiddleware([1]), productoCrud.deleteProducto);


module.exports = router;
