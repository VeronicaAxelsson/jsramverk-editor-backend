const express = require('express');
const indexRouter = require('./indexRouter.js');
const helloWorldRouter = require('./helloWorldRouter.js');
const docsRouter = require('./docsRouter.js');

const routes = express.Router();

routes.use('/', indexRouter);
routes.use('/docs', docsRouter);
routes.use('/helloworld', helloWorldRouter);

module.exports = routes;
