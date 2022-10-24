let Document = require('../models/document');

require('dotenv').config();

exports.getAllDocs = async (owner, allowed_editor) => {
    let documents = [];

    if (owner) {
        documents = await Document.find({ owner: owner });
    }

    if (allowed_editor) {
        documents = await Document.find({ allowed_editors: allowed_editor });
    }

    if (!owner && !allowed_editor) {
        documents = await Document.find({});
    }

    return documents;
};

exports.getOneDoc = async (documentId) => {
    const document = await Document.findById(documentId).exec();

    return document;
};

exports.createDoc = async (data) => {
    const document = await Document.create(data);

    return document;
};

exports.updateDoc = async (documentId, data) => {
    const document = await Document.findById(documentId).exec();

    const dataWithDate = {
        updatedAt: new Date(),
        ...data
    };

    await document.updateOne(dataWithDate);

    const newDocument = await Document.findById(documentId).exec();

    return newDocument;
};

exports.deleteDoc = async (documentId) => {
    const filter = { _id: documentId };
    const result = await Document.deleteOne(filter);

    return result;
};

exports.addEditor = async (documentId, editorEmail) => {
    const filter = { _id: documentId };

    // Check if user allready is editor
    const document = await Document.findById(documentId).exec();

    if (document && document.allowed_editors.includes(editorEmail)) {
        throw new Error('User allready an editor.');
    }

    const updateDocument = {
        $push: { allowed_editors: editorEmail }
    };

    const result = await Document.updateOne(filter, updateDocument);

    return result;
};

exports.removeEditor = async (documentId, editorEmail) => {
    const filter = { _id: documentId };

    const updateDocument = {
        $pull: { allowed_editors: editorEmail }
    };

    const result = await Document.updateOne(filter, updateDocument);

    return result;
};
