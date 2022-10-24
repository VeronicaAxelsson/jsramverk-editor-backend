require('dotenv').config();
process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
const sinon = require('sinon');
const authController = require('../controllers/authController');
const docsController = require('../controllers/docsController');
const { expect } = chai;

sinon.stub(authController, 'checkToken').callsFake((req, res, next) => {
    return next();
});

let server = require('../app');

chai.should();
chai.use(chaiHttp);

let Document = require('../models/document');
let document;
const testData = {
    content: 'content',
    title: 'title',
    allowed_editors: ['test@test.se'],
    owner: '634e75f97bfb7f5afec8fa56'
};

chai.use(chaiHttp);
//Our parent block
describe('Documents', () => {
    beforeEach(() => {
        return new Promise(async (resolve) => {
            try {
                await Document.deleteMany({});
                document = await Document.create(testData);
            } catch (e) {
                console.error(e);
            } finally {
                resolve();
            }
        });
    });
    /*
     * Test the /GET route
     */
    describe('/GET document', () => {
        it('it should GET an array with all the documents', (done) => {
            chai.request(server)
                .get('/docs')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        it('it should GET an array with all the documents where owner is the given ownerId', (done) => {
            chai.request(server)
                .get(`/docs?owner=634e75f97bfb7f5afec8fa56`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        it('it should not GET an array with all the documents where owner is not the given ownerId', (done) => {
            chai.request(server)
                .get(`/docs?owner=634e75f97bfb7f5afec8fa57`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });

        it('it should GET an array with all the documents where the given email is editor', (done) => {
            chai.request(server)
                .get(`/docs?allowed_editor=test@test.se`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });

        it('it should not GET an array with all the documents where the given email is not editor', (done) => {
            chai.request(server)
                .get(`/docs?allowed_editor=test@test1.se`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
    /*
     * Test the /GET/:documentId route
     */
    describe('/GET specific document', () => {
        it('it should GET the document with the given id', (done) => {
            chai.request(server)
                .get(`/docs/${document._id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
    /*
     * Test the /POST route
     */
    describe('/POST document', () => {
        it('it should create a new document', (done) => {
            chai.request(server)
                .post(`/docs`)
                .send(testData)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    /*
     * Test the /PUT route
     */
    describe('/PUT document', () => {
        it('it should update the document with the given id', (done) => {
            chai.request(server)
                .put(`/docs/${document._id}`)
                .send(testData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    /*
     * Test the /DELETE route
     */
    describe('/DELETE document', () => {
        it('it should delete the document with the given id', (done) => {
            chai.request(server)
                .delete(`/docs/${document._id}`)
                .send(testData)
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body)
                        .to.be.an('object')
                        .that.has.property('message')
                        .equal('Successfully deleted one document.');
                    done();
                });
        });

        it('it should not delete the document with the given id, since it does not exist', (done) => {
            chai.request(server)
                .delete(`/docs/6356538ef9638837e25121fe`)
                .send(testData)
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body)
                        .to.be.an('object')
                        .that.has.property('message')
                        .equal('No documents matched the query. Deleted 0 documents.');
                    done();
                });
        });
    });

    /*
     * Test the /addEditor route
     */
    describe('addEditor to document', () => {
        it('it should add editor to the document with the given id', (done) => {
            chai.request(server)
                .post(`/docs/addEditor`)
                .send({ documentId: document._id, editorEmail: 'test@test1.se' })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });

        it('it should fail to add editor when editor allready added', (done) => {
            chai.request(server)
                .post(`/docs/addEditor`)
                .send({ documentId: document._id, editorEmail: 'test@test.se' })
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
    });

    /*
     * Test the /addEditor route
     */
    describe('removeEditor from document', () => {
        it('it should remove editor from the document with the given id', (done) => {
            chai.request(server)
                .post(`/docs/removeEditor`)
                .send({ documentId: document._id, editorEmail: 'test@test.se' })
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });
});

describe('Users cathes errors', () => {
    describe('/GET document', () => {
        it('it should fail to GET an array with all the documents', (done) => {
            sinon.stub(docsController, 'getAllDocs').throws(Error('db query failed'));
            chai.request(server)
                .get('/docs')
                .end((err, res) => {
                    res.should.have.status(500);
                    docsController.getAllDocs.restore();
                    done();
                });
        });
    });

    describe('/GET specific document', () => {
        it('it should fail to GET the document with the given id', (done) => {
            sinon.stub(docsController, 'getOneDoc').throws(Error('db query failed'));
            chai.request(server)
                .get(`/docs/${document._id}`)
                .end((err, res) => {
                    res.should.have.status(500);
                    docsController.getOneDoc.restore();
                    done();
                });
        });
    });

    describe('/POST document', () => {
        it('it should fail to create a document', (done) => {
            sinon.stub(docsController, 'createDoc').throws(Error('db query failed'));
            chai.request(server)
                .post(`/docs`)
                .end((err, res) => {
                    res.should.have.status(500);
                    docsController.createDoc.restore();
                    done();
                });
        });
    });

    describe('/PUT document', () => {
        it('it should fail to update the document with the given id', (done) => {
            sinon.stub(docsController, 'updateDoc').throws(Error('db query failed'));
            chai.request(server)
                .put(`/docs/${document._id}`)
                .end((err, res) => {
                    res.should.have.status(500);
                    docsController.updateDoc.restore();
                    done();
                });
        });
    });

    describe('/DELETE document', () => {
        it('it should fail to delete the document with the given id', (done) => {
            sinon.stub(docsController, 'deleteDoc').throws(Error('db query failed'));
            chai.request(server)
                .delete(`/docs/${document._id}`)
                .end((err, res) => {
                    res.should.have.status(500);
                    docsController.deleteDoc.restore();
                    done();
                });
        });
    });

    describe('/addEditor to document', () => {
        it('it should fail to add editor to a document', (done) => {
            sinon.stub(docsController, 'addEditor').throws(Error('db query failed'));
            chai.request(server)
                .post(`/docs/addEditor`)
                .end((err, res) => {
                    res.should.have.status(500);
                    docsController.addEditor.restore();
                    done();
                });
        });
    });

    describe('/removeEditor to document', () => {
        it('it should fail to remove editor to a document', (done) => {
            sinon.stub(docsController, 'removeEditor').throws(Error('db query failed'));
            chai.request(server)
                .post(`/docs/removeEditor`)
                .end((err, res) => {
                    res.should.have.status(500);
                    docsController.removeEditor.restore();
                    done();
                });
        });
    });
});

sinon.restore();
