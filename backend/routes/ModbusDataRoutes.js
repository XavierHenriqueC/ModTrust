const router = require('express').Router();

const ModbusDataController = require('../controllers/ModbusDataController')

router.get('/getall', ModbusDataController.getData)

module.exports = router;