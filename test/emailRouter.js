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

describe('Email', () => {
    beforeEach(() => {
        const sandbox = sinon.createSandbox();
        sandbox.stub(mg.Mailgun.prototype, 'messages')
            .returns({
                send: (data, cb) => cb(),
            });       
    });

    afterEach(() => {
        sinon.restore();
    })

    describe('/POST email', () => {
        it('it should return success message if mg.message.send succeed.', (done) => {

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

// describe('Email', () => {
//     beforeEach(() => {
//         const sandbox = sinon.createSandbox();

//         let mailgunSendSpy = sandbox.stub().yields('error', { message: 'error' });

//         sandbox.stub(mg.Mailgun.prototype, 'messages')
//         .returns({
//             send: mailgunSendSpy
//         })
//     });

//     afterEach(() => {
//         sinon.restore();
//     })

//     describe('/POST email', () => {

//         it('it should catch the error when mg.message.send fails to send email', (done) => {
//             chai.request(server)
//                 .post(`/email`)
//                 .end((err, res) => {
//                     res.should.have.status(500);
//                     expect(res.body)
//                         .to.be.an('object')
//                         .that.has.property('message')
//                         .equal('Error in sending email.');
//                     done();
//                 });
//         });
//     });
// });

// describe('Email', () => {
//     beforeEach(() => {
//         sinon.stub(mg.Mailgun.prototype, 'messages')
//             .throws(Error('mailgun failed'))
//     });

//     afterEach(() => {
//         sinon.restore();
//     })

//     describe('/POST email', () => {
//         it('it should catch the error when something else then sending the email goes wrong.', (done) => {
//             chai.request(server)
//                 .post(`/email`)
//                 .end((err, res) => {
//                     res.should.have.status(500);
//                     expect(res.body)
//                         .to.be.an('object')
//                         .that.has.property('message')
//                         .equal('error');
//                     done();
//                 });
//         });
//     });
// });

sinon.restore();
