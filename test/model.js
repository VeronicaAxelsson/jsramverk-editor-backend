const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');

let Document = require('../src/models/document');

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
