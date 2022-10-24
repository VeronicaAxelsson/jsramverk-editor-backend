const express = require('express');
const routes = require('./routes/routes.js');
const cors = require('cors');
const morgan = require('morgan');
let mongoose = require('mongoose');

require('dotenv').config();
const docsController = require('./controllers/docsController');

const app = express();
const httpServer = require('http').createServer(app);

const port = process.env.PORT || 1337;

const basePath = '/';

let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@jsramverk.gbjc7zt.mongodb.net/texteditor?retryWrites=true&w=majority`;

if (process.env.NODE_ENV === 'test') {
    dsn = `mongodb://localhost:27017/test`;
}

mongoose.connect(dsn);
mongoose.connection.on('error', (err) => {
    console.log('err', err);
});
mongoose.connection.on('connected', () => {
    console.log('mongoose is connected');
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected on app termination');
        process.exit(0);
    });
});

app.use(cors());

app.use(basePath, routes);

app.disable('x-powered-by');

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

const io = require('socket.io')(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

let throttleTimer;

io.sockets.on('connection', (socket) => {
    console.log(`id: ${socket.id}`); // Nått lång och slumpat

    socket.on('disconnect', () => {
        console.log('disconnected');
    });

    socket.on('create', (room) => {
        socket.join(room);
    });

    socket.on('docsData', (data) => {
        socket.to(data.documentId).emit('docsData', data);

        clearTimeout(throttleTimer);
        throttleTimer = setTimeout(async () => {
            const { content } = data;

            if (data.documentId !== 1) {
                await docsController.updateDoc(data.documentId, { content: content });
            }
        }, 2000);
    });
});
// Start up server
httpServer.listen(port, () => console.log(`Example API listening on port ${port}!`));
module.exports = app;
