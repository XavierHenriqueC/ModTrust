const router = require('express').Router();

const ModbusDataController = require('../controllers/ModbusDataController')

router.get('/getall', ModbusDataController.getData)
router.get('/getvarstomqtt', ModbusDataController.getVarsToMqtt)
router.post('/registervartomqtt', ModbusDataController.registerVarToMqtt)
router.delete('/deletevartomqttbyname', ModbusDataController.deleteVarToMqttByName)

module.exports = router;