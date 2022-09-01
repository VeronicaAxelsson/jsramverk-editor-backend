const express = require('express');

var indexRouter = express.Router();

indexRouter.get('/', function (req, res, next) {
    const data = {
        data: {
            msg: 'Index route'
        }
    };

    res.json(data);
});

module.exports = indexRouter;
