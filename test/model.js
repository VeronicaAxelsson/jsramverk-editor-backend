const chai = require('chai');
const expect = chai.expect;

let Document = require('../models/document');
let User = require('../models/user');

describe('Testing Document model', () => {
    let testDocument;

    beforeEach(() => {
        testDocument = {
            content: 'content',
            title: 'title'
        };
    });

    it('it should create the item successfully', (done) => {
        let doc = new Document(testDocument);

        doc.validate((err) => {
            if (err) {
                const unexpectedFailureError = new Error('⚠️ Unexpected failure!');

                done(unexpectedFailureError);
            } else {
                expect(doc.content).to.equal('content');
                expect(doc.title).to.equal('title');
                //TODO: test dateTime
                done();
            }
        });
    });
});

describe('Testing User model', () => {
    let testUser;

    beforeEach(() => {
        testUser = {
            email: 'email@email.se',
            password: 'password'
        };
    });

    it('it should create the item successfully', (done) => {
        let user = new User(testUser);

        user.validate((err) => {
            if (err) {
                const unexpectedFailureError = new Error('⚠️ Unexpected failure!');

                done(unexpectedFailureError);
            } else {
                expect(user.email).to.equal('email@email.se');
                expect(user.password).to.equal('password');
                //TODO: test dateTime
                done();
            }
        });
    });
});

describe('Testing User model with unvalid email', () => {
    let testUser;

    beforeEach(() => {
        testUser = {
            email: 'email.email.se',
            password: 'password'
        };
    });

    it('it should not create the item successfully', (done) => {
        let user = new User(testUser);

        user.validate((err) => {
            err._message.should.equal('user validation failed');
            done();
        });
    });
});
