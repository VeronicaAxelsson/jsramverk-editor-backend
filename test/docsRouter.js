process.env.NODE_ENV = 'test';

let server = require('../src/app');
let chai = require('chai');
let chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

require('dotenv').config();

let mongoose = require('mongoose');
let Document = require('../src/models/document');
let document;
const dsn = `mongodb://localhost:27017/test`;
const testData = {
    content: 'content',
    title: 'title'
};

chai.use(chaiHttp);
//Our parent block
describe('Documents', () => {
    beforeEach(() => {
        return new Promise(async (resolve) => {
            try {
                await mongoose.connect(dsn);
                await Document.deleteMany({});
                document = await Document.create(testData);
            } catch (e) {
                console.error(e);
            } finally {
                await mongoose.connection.close();
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
        it('it should GET the document with the given id', (done) => {
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
        it('it should GET the document with the given id', (done) => {
            chai.request(server)
                .put(`/docs/${document._id}`)
                .send(testData)
                .end((err, res) => {
                    res.should.have.status(204);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    /*
     * Test the /DELETE route
     */
    describe('/DELETE document', () => {
        it('it should DELETE the document with the given id', (done) => {
            chai.request(server)
                .put(`/docs/${document._id}`)
                .send(testData)
                .end((err, res) => {
                    res.should.have.status(204);
                    done();
                });
        });
    });
});
