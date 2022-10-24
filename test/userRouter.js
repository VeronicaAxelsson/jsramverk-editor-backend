require('dotenv').config();
process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
const sinon = require('sinon');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { expect } = chai;

sinon.stub(authController, 'checkToken').callsFake((req, res, next) => {
    return next();
});

let server = require('../app');

chai.should();
chai.use(chaiHttp);

require('dotenv').config();

let User = require('../models/user');
let user;
const testData = {
    email: 'test@test.se',
    password: 'test'
};

chai.use(chaiHttp);

//Our parent block
describe('Users', () => {
    beforeEach(() => {
        return new Promise(async (resolve) => {
            try {
                await User.deleteMany({});
                user = await User.create(testData);
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
    describe('/GET user', () => {
        it('it should GET an array with all the users', (done) => {
            chai.request(server)
                .get('/user')
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
    describe('/GET specific user', () => {
        it('it should GET the user with the given id', (done) => {
            chai.request(server)
                .get(`/user/${user._id}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    /*
     * Test the /PUT route
     */
    describe('/PUT user', () => {
        it('it should update the user with the given id', (done) => {
            chai.request(server)
                .put(`/user/${user._id}`)
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
    describe('/DELETE user', () => {
        it('it should delete the user with the given id', (done) => {
            chai.request(server)
                .delete(`/user/${user._id}`)
                .send(testData)
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body)
                        .to.be.an('object')
                        .that.has.property('message')
                        .equal('Successfully deleted one user.');
                    done();
                });
        });

        it('it should not delete the user with the given id, since it does not exist', (done) => {
            chai.request(server)
                .delete(`/user/6356538ef9638837e25121fe`)
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body)
                        .to.be.an('object')
                        .that.has.property('message')
                        .equal('No users matched the query. Deleted 0 users.');
                    done();
                });
        });
    });
});

describe('Users cathes errors', () => {
    describe('/GET user', () => {
        it('it should fail to GET an array with all the users', (done) => {
            sinon.stub(userController, 'getAllUsers').throws(Error('db query failed'));
            chai.request(server)
                .get('/user')
                .end((err, res) => {
                    res.should.have.status(500);
                    userController.getAllUsers.restore();
                    done();
                });
        });
    });

    describe('/GET specific user', () => {
        it('it should fail to GET the user with the given id', (done) => {
            sinon.stub(userController, 'getOneUser').throws(Error('db query failed'));
            chai.request(server)
                .get(`/user/${user._id}`)
                .end((err, res) => {
                    res.should.have.status(500);
                    userController.getOneUser.restore();
                    done();
                });
        });
    });

    describe('/PUT user', () => {
        it('it should fail to update the user with the given id', (done) => {
            sinon.stub(userController, 'updateUser').throws(Error('db query failed'));
            chai.request(server)
                .put(`/user/${user._id}`)
                .send(testData)
                .end((err, res) => {
                    res.should.have.status(500);
                    userController.updateUser.restore();
                    done();
                });
        });
    });

    describe('/DELETE document', () => {
        it('it should fail to delete the user with the given id', (done) => {
            sinon.stub(userController, 'deleteUser').throws(Error('db query failed'));
            chai.request(server)
                .delete(`/user/${user._id}`)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
    });
});
sinon.restore();
