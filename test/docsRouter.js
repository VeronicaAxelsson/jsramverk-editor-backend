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
const dsn = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@jsramverk.gbjc7zt.mongodb.net/test?retryWrites=true&w=majority`;
const testData = {
  content: 'content',
  title: 'title'
};

const invalidTestData = {
  test: 'test',
}

const invalidDocumentId = '1234';

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

// const chai = require('chai');
// const expect = chai.expect;
// const sinon = require('sinon');
// const sinonChai = require('sinon-chai');
// chai.use(sinonChai);
// const rewire = require('rewire');
// const request = require('supertest');
// let mongoose = require('mongoose');
// var should = chai.should();

// const sandbox = sinon.createSandbox();

// let app = require('../src/app');

// describe('Testing docs routes', () => {
//     afterEach(() => {
//         sandbox.restore();
//     });

//     describe('GET /docs', () => {
//         let testDocs;
//         let findStub;

//         beforeEach('beforeEach', async () => {
//             testDocs = [
//                 {
//                     content: 'test',
//                     title: 'test'
//                 }
//             ];

//             findStub = sandbox.stub(mongoose.Model, 'find').resolves(testDocs);
//         });

//         it('should list ALL documents on /docs GET', (done) => {
//             request(app)
//                 .get('/docs')
//                 .expect(200)
//                         .end((err, response) => {
//                             response.body.should.be.a('array');
//                             response.body.length.should.be.eql(1);
//                             done();
//                         });
//         });
//     });
// });
