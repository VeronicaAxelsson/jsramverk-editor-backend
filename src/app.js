const express = require('express');
const routes = require('./routes/routes.js');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 1337;

const basePath = '/';

app.use(cors());

app.use(basePath, routes);

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        errors: [
            {
                status: err.status,
                title: err.message,
                detail: err.message
            }
        ]
    });
});

// Start up server
app.listen(port, () => console.log(`Example API listening on port ${port}!`));
