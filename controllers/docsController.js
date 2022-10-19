const ObjectId = require('mongodb').ObjectId;
let Document = require('../models/document');
let User = require('../models/user');
let mongoose = require('mongoose');

require('dotenv').config();

let dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@jsramverk.gbjc7zt.mongodb.net/texteditor?retryWrites=true&w=majority`;

if (process.env.NODE_ENV === 'test') {
    dsn = `mongodb://localhost:27017/test`;
}

exports.getAllDocs = async (owner, allowed_editor) => {
    try {
        await mongoose.connect(dsn)
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
    } finally {
        await mongoose.connection.close();
    }
};

exports.getOneDoc = async (documentId) => {
    try {
        await mongoose.connect(dsn);

        const document = await Document.findById(documentId).exec();

        return document;
    } finally {
        await mongoose.connection.close();
    }
};

exports.createDoc = async (data) => {
    try {
        await mongoose.connect(dsn);
        const document = await Document.create(data);

        return document;
    } finally {
        await mongoose.connection.close();
    }
};

exports.updateDoc = async (documentId, data) => {

    try {
        await mongoose.connect(dsn);
        const document = await Document.findById(documentId).exec();
    
        const dataWithDate = {
            updatedAt: new Date(),
            ...data
        };
    
        await document.updateOne(dataWithDate);
    
        const newDocument = await Document.findById(documentId).exec();
        return newDocument;
    } finally {
        await mongoose.connection.close();
    }
};

exports.deleteDoc = async (documentId) => {
    try {
        await mongoose.connect(dsn);
        const filter = { _id: documentId };

        const result = await Document.deleteOne(filter);
        return result;
    } finally {
        await mongoose.connection.close();
    }
};

// exports.addEditorWithEmailLink = async (req, res) => {
//     try {
//         await mongoose.connect(dsn);
//         const { documentId, editorEmail } = req.params;
//         const filter = { _id: documentId };

//         //Check if user exists
//         const user = await User.findOne({ email: editorEmail }).exec();

//         if (!user) {
//             return res.status(500).json({message: 'User does not exist'});
//         }

//         // Check if user allready is editor
//         const document = await Document.findById(documentId).exec();
//         if (document && document.allowed_editors.includes(editorEmail)) {
//             return res.status(500).json({
//                 errors: {
//                     status: 500,
//                     message: 'User allready an editor.'
//                 }
//             });
//         }

//         const updateDocument = {
//             $push: { allowed_editors: editorEmail }
//         };

//         await Document.updateOne(filter, updateDocument);

//         return res.redirect('https://www.student.bth.se/~veax20/editor/');
//     } catch (e) {
//         return res.status(500).json({
//             errors: {
//                 status: 500,
//                 source: '/',
//                 title: 'Database error',
//                 detail: e.message
//             }
//         });
//     } finally {
//         await mongoose.connection.close();
//     }
// };

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
