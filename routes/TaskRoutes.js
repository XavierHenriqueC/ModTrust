const router = require('express').Router();

const TaskController = require('../controllers/TaskController')

//router.get('/getall', TaskController.getClients)
//router.post('/getTaskbyid', TaskController.getTaskById)
router.post('/register', TaskController.register)
//router.patch('/editTaskbyid', TaskController.editTaskById)
//router.delete('/deleteTaskbyid', TaskController.deleteTaskById)

module.exports = router;