const express = require('express');
const equipment = require('../controllers/equipmentController');
const equipmentMiddleware = require('../middlewares/equipmentMiddleware');

const router = express.Router();

router.post('/register', equipmentMiddleware, equipment.registerEquipment);

router.put('/edit', equipmentMiddleware, equipment.editEquipment);

router.delete('/delete/:id', equipmentMiddleware, equipment.deleteEquipment);

router.get('/get-all', equipment.getAll);

router.get('/get-equipment-detail/:id', equipment.getEquipmentDetail);

module.exports = router;