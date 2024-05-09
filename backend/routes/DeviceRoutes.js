const router = require('express').Router();

const DeviceController = require('../controllers/DeviceController')

router.get('/getall', DeviceController.getDevices)
router.post('/getdevicebyid', DeviceController.getDeviceById)
router.post('/register', DeviceController.register)
router.patch('/editdevicebyid', DeviceController.editDeviceById)
router.delete('/deletedevicebyid', DeviceController.deleteDeviceById)

module.exports = router;