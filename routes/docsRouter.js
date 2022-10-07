const express = require('express');
const docsController = require('../controllers/docsController');

var docsRouter = express.Router();

docsRouter.get('/', docsController.getAllDocs);

docsRouter.post('/', express.json(), docsController.createDoc);

docsRouter.get('/:documentId', docsController.getOneDoc);

docsRouter.put('/:documentId', express.json(), docsController.updateDoc);

docsRouter.delete('/:documentId', docsController.deleteDoc);

docsRouter.post('/addEditor', express.json(), docsController.addEditor);

docsRouter.post('/removeEditor', express.json(), docsController.removeEditor);

module.exports = docsRouter;
