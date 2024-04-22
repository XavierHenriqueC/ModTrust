const router = require('express').Router();

const NetworkController = require('../controllers/NetworkController')

router.get('/getall', NetworkController.getNetwork)
router.patch('/editnetworkbyid', NetworkController.editDeviceById)

module.exports = router;