require('dotenv').config();
process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
const sinon = require('sinon');
const authController = require('../controllers/authController');

sinon.stub(authController, 'checkToken').callsFake((req, res, next) => {
    return next();
});

let server = require('../app');

chai.should();
chai.use(chaiHttp);
const { expect } = chai;

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

    describe('/POST login', () => {
        it('fail login user if email does not exist', (done) => {
            chai.request(server)
                .post('/auth/login')
                .send({ email: 'false@false.se', password: 'test' })
                .end((err, res) => {
                    res.should.have.status(401);
                    expect(res.body)
                        .to.be.an('object')
                        .that.has.property('message')
                        .equal('User not found');

                    done();
                });
        });

        it('fail login user if wrong password', (done) => {
            chai.request(server)
                .post('/auth/login')
                .send({ email: 'test@test.se', password: 'false' })
                .end((err, res) => {
                    res.should.have.status(401);
                    expect(res.body)
                        .to.be.an('object')
                        .that.has.property('message')
                        .equal('Password is incorrect.');

                    done();
                });
        });
    });

    describe('/POST register user', () => {
        it('it should register the user', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send({ email: 'test1@test.se', password: 'test' })
                .end((err, res) => {
                    res.should.have.status(201);
                    expect(res.body)
                        .to.be.an('object')
                        .that.has.property('message')
                        .equal('User succesfully created!');
                    done();
                });
        });

        it('it should fail register the user if email allready is taken', (done) => {
            chai.request(server)
                .post('/auth/register')
                .send({ email: 'test@test.se', password: 'test' })
                .end((err, res) => {
                    res.should.have.status(500);
                    expect(res.body.errors)
                        .to.be.an('object')
                        .that.has.property('message')
                        .equal('Email allready in use');
                    done();
                });
        });
    });
});

sinon.restore();
