const express = require('express');
const database = require('../db/db');
const ObjectId = require('mongodb').ObjectId;

var docsRouter = express.Router();
let db;

//Get all Method
docsRouter.get('/', async (req, res, next) => {
    try {
        db = await database.getDb();

        const data = await db.collection.find({}).toArray();
        if (data) {
            return res.json(data);
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
        await db.client.close();
    }
});

//Post Method
docsRouter.post('/', express.json(), async (req, res) => {
    try {
        db = await database.getDb();
        const data = req.body;

        await db.collection.insertOne(data);
        return res.json(data);
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
        await db.client.close();
    }
});

//Get by ID Method
docsRouter.get('/:documentId', async (req, res) => {
    try {
        db = await database.getDb();
        const { documentId } = req.params;
        const o_id = new ObjectId(documentId);
        const filter = { _id: o_id };

        const data = await db.collection.findOne(filter);
        if (data) {
            return res.json(data);
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
        await db.client.close();
    }
});

//Update by ID Method
docsRouter.put('/:documentId', express.json(), async (req, res) => {
    try {
        db = await database.getDb();
        const { documentId } = req.params;
        const oId = new ObjectId(documentId);
        const filter = { _id: oId };

        const newContent = req.body;

        //create new doucment if none is found
        const options = { upsert: true };

        const updateDoc = {
            $set: newContent
        };

        const result = await db.collection.updateOne(filter, updateDoc, options);
        if (result.upsertedCount === 1) {
            res.send('No document matched filter, new document created.');
        } else if (result.modifiedCount === 1) {
            res.send('Successfully updated one document.');
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
        await db.client.close();
    }
});

//Delete by ID Method
docsRouter.delete('/:documentId', async (req, res) => {
    try {
        db = await database.getDb();
        const { documentId } = req.params;
        const oId = new ObjectId(documentId);
        const filter = { _id: oId };

        const result = await db.collection.deleteOne(filter);
        if (result.deletedCount === 1) {
            res.send('Successfully deleted one document.');
        } else {
            res.send('No documents matched the query. Deleted 0 documents.');
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
        await db.client.close();
    }
});

module.exports = docsRouter;
