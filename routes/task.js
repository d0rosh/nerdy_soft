const express = require('express');
const router = express.Router();
const passport = require('passport');
const TaskController = require('../controllers/task');

router.post('/set_task', passport.authenticate('jwt', {session: false}), TaskController.setTask);
router.post('/share_task', passport.authenticate('jwt', {session: false}), TaskController.shareTask);
router.put('/edit_task', passport.authenticate('jwt', {session: false}), TaskController.editTask);
router.delete('/delete_task/:id', passport.authenticate('jwt', {session: false}), TaskController.deleteTask);
router.get('/get_tasks', passport.authenticate('jwt', {session: false}), TaskController.getTasks);

module.exports = router;