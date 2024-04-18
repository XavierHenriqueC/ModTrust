const router = require('express').Router();

const TaskController = require('../controllers/TaskController')

router.get('/getall', TaskController.getTasks)
router.post('/gettaskbyid', TaskController.getTaskById)
router.post('/register', TaskController.register)
router.patch('/edittaskbyid', TaskController.editTaskById)
router.delete('/deleteTaskbyid', TaskController.deleteTaskById)

module.exports = router;