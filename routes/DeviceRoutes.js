const router = require('express').Router();

const DeviceController = require('../controllers/DeviceController')

//router.get('/getall', DeviceController.getClients)
//router.post('/getDevicebyid', DeviceController.getDeviceById)
router.post('/register', DeviceController.register)
//router.patch('/editDevicebyid', DeviceController.editDeviceById)
//router.delete('/deleteDevicebyid', DeviceController.deleteDeviceById)

module.exports = router;