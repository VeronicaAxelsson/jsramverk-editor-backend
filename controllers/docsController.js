const ObjectId = require('mongodb').ObjectId;
let Document = require('../models/document');
let mongoose = require('mongoose');

require('dotenv').config();

let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@jsramverk.gbjc7zt.mongodb.net/texteditor?retryWrites=true&w=majority`;

if (process.env.NODE_ENV === 'test') {
    dsn = `mongodb://localhost:27017/test`;
}

exports.getAllDocs = async (req, res) => {
    try {
        await mongoose.connect(dsn);

        const owner = req.query.owner;
        const allowed_editor = req.query.allowed_editor;
        let document = [];

        if (owner) {
            document = await Document.find({ owner: owner });
        }

        if (allowed_editor) {
            document = await Document.find({ allowed_editors: allowed_editor });
        }

        if (!owner && !allowed_editor) {
            document = await Document.find({});
        }
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
};

exports.getOneDoc = async (req, res) => {
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
};

exports.createDoc = async (req, res) => {
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
};

exports.saveDocToDb = async (documentId, data) => {
    await mongoose.connect(dsn);
    const document = await Document.findById(documentId).exec();

    const dataWithDate = {
        updatedAt: new Date(),
        ...data
    };

    await document.updateOne(dataWithDate);

    const newDocument = await Document.findById(documentId).exec();

    await mongoose.connection.close();

    return newDocument;
};

exports.updateDoc = async (req, res) => {
    try {
        const { documentId } = req.params;
        const data = req.body;

        const response = await this.saveDocToDb(documentId, data);

        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            errors: {
                status: 500,
                source: '/',
                title: 'Database error',
                detail: e.message
            }
        });
    }
};

exports.deleteDoc = async (req, res) => {
    try {
        await mongoose.connect(dsn);
        const { documentId } = req.params;
        const oId = new ObjectId(documentId);
        const filter = { _id: oId };

        const result = await Document.deleteOne(filter);

        if (result.deletedCount === 1) {
            return res.status(200).json({ message: 'Successfully deleted one document.' });
        } else {
            return res.status(200).json({
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
};

exports.addEditor = async (req, res) => {
    try {
        await mongoose.connect(dsn);
        const { documentId, editorEmail } = req.body;
        const filter = { _id: documentId };

        // Check if user allready is editor
        const document = await Document.findById(documentId).exec();
        if (document && document.allowed_editors.includes(editorEmail)) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    message: 'User allready an editor.'
                }
            });
        }

        const updateDocument = {
            $push: { allowed_editors: editorEmail }
        };

        const result = await Document.updateOne(filter, updateDocument);

        return res.status(200).json(result);
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
};

exports.removeEditor = async (req, res) => {
    try {
        await mongoose.connect(dsn);
        const { documentId, editorEmail } = req.body;
        const filter = { _id: documentId };

        console.log('försöker ta bort');

        const updateDocument = {
            $pull: { allowed_editors: editorEmail }
        };

        const result = await Document.updateOne(filter, updateDocument);

        return res.status(200).json(result);
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
};
