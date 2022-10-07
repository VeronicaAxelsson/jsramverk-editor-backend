const express = require('express');
const userController = require('../controllers/userController');

var authRouter = express.Router();

authRouter.post('/register', express.json(), userController.createUser);

authRouter.post('/login', express.json(), userController.loginUser);

module.exports = authRouter;
