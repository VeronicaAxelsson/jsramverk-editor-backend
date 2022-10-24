require('dotenv').config();
process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
const sinon = require('sinon');
const authController = require('../controllers/authController');
const { expect } = chai;
const mailgun = require('mailgun-js');

sinon.stub(authController, 'checkToken').callsFake((req, res, next) => {
    return next();
});

let mg = mailgun({ apiKey: 'foo', domain: 'bar' });

let server = require('../app');

chai.should();
chai.use(chaiHttp);

const testData = {
    email: 'email@email.se', 
    inviterEmail: 'inviter@inviter.se', 
    documentTitle: 'title' 
}

describe('Email', () => {
    beforeEach(() => {
        sinon.stub(mg.Mailgun.prototype, 'messages')
            .returns({
                send: (data, cb) => cb(),
            });       
    });

    afterEach(() => {
        sinon.restore();
    })

    describe('/POST email', () => {
        it('it should return an object when called upon', (done) => {
            chai.request(server)
                .post(`/email`)
                .send(testData)
                .end((err, res) => {
                    console.log(res);
                    expect(res.body)
                        .to.be.an('object')
                        .that.has.property('message');
                    done();
                });
        });
    });
});

describe('Email', () => {
    beforeEach(() => {
        sinon.stub(mg.Mailgun.prototype, 'messages')
            .throws(Error('mailgun failed'))
    });

    afterEach(() => {
        sinon.restore();
    })

    describe('/POST email', () => {
        it('it should catch the error when something else then sending the email goes wrong.', (done) => {
            chai.request(server)
                .post(`/email`)
                .end((err, res) => {
                    res.should.have.status(500);
                    expect(res.body)
                        .to.be.an('object')
                        .that.has.property('message')
                        .equal('error');
                    done();
                });
        });
    });
});

sinon.restore();
