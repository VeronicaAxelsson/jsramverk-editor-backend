const express = require('express');
const indexRouter = require('./indexRouter.js');
const docsRouter = require('./docsRouter.js');

const routes = express.Router();

routes.use('/', indexRouter);
routes.use('/docs', docsRouter);

module.exports = routes;
