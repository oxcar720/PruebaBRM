//controllers/logController.js
const Registro = require('../models/Registro');

exports.getLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const { rows, count } = await Registro.findAndCountAll({
      order: [['fecha_registro', 'DESC']],
      limit,
      offset
    });

    res.json({
      logs: rows,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error obteniendo logs" });
  }
};
