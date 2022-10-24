const chai = require('chai');
const expect = chai.expect;

let Document = require('../models/document');
let User = require('../models/user');

describe('Testing Document model', () => {
    let testDocument;

    beforeEach(() => {
        testDocument = {
            content: 'content',
            title: 'title',
            allowed_editors: ['test@test.se'],
            ownerEmail: 'test@test.se',
            owner: '634e75f97bfb7f5afec8fa56',
            type: 'text',
            comments: [
                {
                    comment: 'comment',
                    commenter: 'test@test.se',
                    rangeIndex: 2,
                    rangeLength: 3
                }
            ]
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
                expect(doc.allowed_editors).to.be.a('array');
                expect(doc.ownerEmail).to.equal('test@test.se');
                expect(doc.owner).to.be.a('object');
                expect(doc.type).to.equal('text');
                expect(doc.comments).to.be.a('array');
                done();
            }
        });
    });

    it('it should fail due to wrong field', (done) => {
        let doc = new Document({ test: 'test' });

        doc.validate((err) => {
            expect(err);
            done();
        });
    });

    it('it should fail due to wrong type', (done) => {
        let doc = new Document({ content: 1 });

        doc.validate((err) => {
            expect(err);
            done();
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

    it('it should fail due to wrong field', (done) => {
        let doc = new Document({ test: 'test' });

        doc.validate((err) => {
            expect(err);
            done();
        });
    });

    it('it should fail due to wrong type', (done) => {
        let doc = new Document({ email: 1 });

        doc.validate((err) => {
            expect(err);
            done();
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
