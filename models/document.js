let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//Doc schema definition
let DocumentSchema = new Schema({
    owner: { type: mongoose.ObjectId },
    ownerEmail: { type: String },
    content: { type: String },
    title: { type: String },
    updatedAt: { type: Date, default: () => Date.now() },
    allowed_editors: { type: [String] },
    type: { type: String },
    comments: {type: [Object]}
});

DocumentSchema.pre('save', (next) => {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('document', DocumentSchema);
