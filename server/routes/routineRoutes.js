const express = require('express');
const routineRouter = express.Router();
const { getRoutine, createRoutine, updateRoutine, deleteRoutine } = require('../controllers/routineController');
const auth = require("../middlewares/auth");

routineRouter.get('/:_id?', auth, getRoutine)

routineRouter.post('/', auth, createRoutine)

routineRouter.put('/:_id', auth, updateRoutine)

routineRouter.delete('/:_id', auth, deleteRoutine)


module.exports = routineRouter;