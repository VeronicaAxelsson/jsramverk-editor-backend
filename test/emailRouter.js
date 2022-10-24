require('dotenv').config();
process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
const sinon = require('sinon');
const authController = require('../controllers/authController');
const { expect } = chai;
const emailController = require('../controllers/emailController');

sinon.stub(authController, 'checkToken').callsFake((req, res, next) => {
    return next();
});

let server = require('../app');

chai.should();
chai.use(chaiHttp);

let sendEmailStub = sinon.stub(emailController, 'sendEmail');

describe('Email', () => {
    beforeEach(() => {
        sendEmailStub.resolves();     
    });

    afterEach(() => {
        sinon.restore();
    })

    describe('/POST email', () => {
        it('it should return success message if sendEmail returns promise resolve', (done) => {
            sinon.stub(emailController, 'sendEmail').resolves();
            chai.request(server)
                .post(`/email`)
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body)
                        .to.be.an('object')
                        .that.has.property('message')
                        .equal('Email sent succesfully!');
                    done();
                });
        });
    });
});

describe('Email', () => {
    beforeEach(() => {
        sendEmailStub.rejects(new Error('Error in sending email.'));
    });

    afterEach(() => {
        sinon.restore();
    })

    describe('/POST email', () => {

        it('it should catch the error if sendEmail returns promise reject', (done) => {
            chai.request(server)
                .post(`/email`)
                .end((err, res) => {
                    res.should.have.status(500);
                    expect(res.body.errors)
                        .to.be.an('object')
                        .that.has.property('message')
                        .equal('Error in sending email.');
                    done();
                });
        });
    });
});

sinon.restore();
