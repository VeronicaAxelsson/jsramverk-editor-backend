const express = require('express');
const userController = require('../controllers/userController');

var userRouter = express.Router();

userRouter.get('/', userController.getAllUsers);

userRouter.get('/:userId', userController.getOneUser);

userRouter.put('/:userId', express.json(), userController.updateUser);

userRouter.delete('/:userId', userController.deleteUser);

module.exports = userRouter;
