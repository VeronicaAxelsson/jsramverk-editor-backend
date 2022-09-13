const express = require('express');
const ObjectId = require('mongodb').ObjectId;
let Document = require('../models/document');
let mongoose = require('mongoose');

require('dotenv').config();

var docsRouter = express.Router();

let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@jsramverk.gbjc7zt.mongodb.net/texteditor?retryWrites=true&w=majority`;

if (process.env.NODE_ENV === 'test') {
    dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@jsramverk.gbjc7zt.mongodb.net/test?retryWrites=true&w=majority`;
}

docsRouter.get('/', async (req, res) => {
    try {
        await mongoose.connect(dsn);

        const document = await Document.find({});

        return res.status(200).json(document);
    } catch (e) {
        return res.status(500).json({
            errors: {
                status: 500,
                source: '/',
                title: 'Database error',
                detail: e.message
            }
        });
    } finally {
        await mongoose.connection.close();
    }
});

docsRouter.post('/', express.json(), async (req, res) => {
    try {
        await mongoose.connect(dsn);
        const data = req.body;
        const document = await Document.create(data);

        return res.status(201).json(document);
    } catch (e) {
        return res.status(500).json({
            errors: {
                status: 500,
                source: '/',
                title: 'Database error',
                detail: e.message
            }
        });
    } finally {
        await mongoose.connection.close();
    }
});

docsRouter.get('/:documentId', async (req, res) => {
    try {
        await mongoose.connect(dsn);
        const { documentId } = req.params;

        const document = await Document.findById(documentId).exec();

        return res.status(200).json(document);
    } catch (e) {
        return res.status(500).json({
            errors: {
                status: 500,
                source: '/',
                title: 'Database error',
                detail: e.message
            }
        });
    } finally {
        await mongoose.connection.close();
    }
});

docsRouter.put('/:documentId', express.json(), async (req, res) => {
    try {
        await mongoose.connect(dsn);
        const { documentId } = req.params;
        const document = await Document.findById(documentId).exec();

        const data = req.body;
        const dataWithDate = {
            updatedAt: new Date(),
            ...data
        };

        await document.updateOne(dataWithDate);

        res.status(204).json(document);
    } catch (e) {
        return res.status(500).json({
            errors: {
                status: 500,
                source: '/',
                title: 'Database error',
                detail: e.message
            }
        });
    } finally {
        await mongoose.connection.close();
    }
});

docsRouter.delete('/:documentId', async (req, res) => {
    try {
        await mongoose.connect(dsn);
        const { documentId } = req.params;
        const oId = new ObjectId(documentId);
        const filter = { _id: oId };

        const result = await Document.deleteOne(filter);

        if (result.deletedCount === 1) {
            res.status(204).json({ message: 'Successfully deleted one document.' });
        } else {
            res.status(204).json({
                message: 'No documents matched the query. Deleted 0 documents.'
            });
        }
    } catch (e) {
        return res.status(500).json({
            errors: {
                status: 500,
                source: '/',
                title: 'Database error',
                detail: e.message
            }
        });
    } finally {
        await mongoose.connection.close();
    }
});

module.exports = docsRouter;
