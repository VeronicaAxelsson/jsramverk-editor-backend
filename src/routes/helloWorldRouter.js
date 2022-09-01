const express = require('express');

var helloWorldRouter = express.Router();

helloWorldRouter.get('/', function (req, res, next) {
    const data = {
        data: {
            msg: 'Hello World'
        }
    };

    res.json(data);
});

module.exports = helloWorldRouter;
