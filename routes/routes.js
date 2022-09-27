const express = require('express');
const docsRouter = require('./docsRouter.js');

const routes = express.Router();

routes.use('/docs', docsRouter);

module.exports = routes;
