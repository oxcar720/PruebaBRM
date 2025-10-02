// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Solo admins (rolId = 1) pueden crear usuarios
router.post('/create_user', authMiddleware([1]), userController .createUser);
router.get('/users', authMiddleware([1]), userController.getAllUsers);
router.put('/user/:id', authMiddleware([1]), userController.updateUser);
router.delete('/user/:id', authMiddleware([1]), userController.deleteUser);

module.exports = router;
