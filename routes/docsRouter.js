const express = require('express');
const docsController = require('../controllers/docsController');

var docsRouter = express.Router();

// docsRouter.get('/', docsController.getAllDocs);

docsRouter.get('/', async (req, res) => {
    try {
        const owner = req.query.owner;
        const allowed_editor = req.query.allowed_editor;
        let documents = await docsController.getAllDocs(owner, allowed_editor);

        return res.status(200).json(documents);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errors: {
                status: 500,
                source: '/',
                title: 'Database error',
                detail: e.message
            }
        });
    }
});


docsRouter.post('/', express.json(), async (req, res) => {
    try {
        const data = req.body;

        const document = await docsController.createDoc(data);

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
    }
});

docsRouter.get('/:documentId', async (req, res) => {
    try {
        const { documentId } = req.params;

        const document = await docsController.getOneDoc(documentId);

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
    }
});

docsRouter.put('/:documentId', express.json(), async (req, res) => {
    try {
        const { documentId } = req.params;
        const data = req.body;

        const response = await docsController.updateDoc(documentId, data);

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
});

docsRouter.delete('/:documentId', async (req, res) => {
    try {
        const { documentId } = req.params;

        const result = await docsController.deleteDoc(documentId);

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
    }
});

docsRouter.post('/addEditor', express.json(), docsController.addEditor);

docsRouter.post('/removeEditor', express.json(), docsController.removeEditor);

module.exports = docsRouter;
