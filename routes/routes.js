const express = require('express');
const docsRouter = require('./docsRouter.js');
const userRouter = require('./userRouter.js');
const authRouter = require('./authRouter.js');
const authController = require('../controllers/authController');

const routes = express.Router();

routes.use('/docs', authController.checkToken, docsRouter);
routes.use('/user', authController.checkToken, userRouter);
routes.use('/auth', authRouter);

module.exports = routes;
