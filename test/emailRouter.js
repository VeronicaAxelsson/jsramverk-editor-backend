require('dotenv').config();
process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
const sinon = require('sinon');
const authController = require('../controllers/authController');
const { expect } = chai;
const mailgun = require('mailgun-js');
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });

sinon.stub(authController, 'checkToken').callsFake((req, res, next) => {
    return next();
});

let server = require('../app');

chai.should();
chai.use(chaiHttp);

let Document = require('../models/document');
let document;
const testData = {
    email: 'veronica-a@live.se',
    inviterEmail: 'inviter@inviter.se',
    documentTitle: 'title'
};

const failTestData = {
    email: 'test@test.se',
    inviterEmail: 'inviter@inviter.se',
    documentTitle: 'title'
};

chai.use(chaiHttp);
//Our parent block
describe('Email', () => {
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

    describe('/POST email', () => {
        it('it should send email to registerd email', (done) => {
            chai.request(server)
                .post(`/email`)
                .send(testData)
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body)
                        .to.be.an('object')
                        .that.has.property('message')
                        .equal('Email sent succesfully!');
                    done();
                });
        });

        it('it should not send email to unregisterd email', (done) => {
            chai.request(server)
                .post(`/email`)
                .send(failTestData)
                .end((err, res) => {
                    res.should.have.status(500);
                    expect(res.body)
                        .to.be.an('object')
                        .that.has.property('message')
                        .equal('Error in sending email.');
                    done();
                });
        });

        it('it raise error if mailgun operation fails', (done) => {
            sinon.stub(mg.messages(), 'send').throws(Error('mg.message().send failed'));
            chai.request(server)
                .post(`/email`)
                .end((err, res) => {
                    res.should.have.status(500);
                    done();
                });
        });
    });
});

sinon.restore();
