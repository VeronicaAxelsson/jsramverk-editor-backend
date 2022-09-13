let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//Doc schema definition
let DocumentSchema = new Schema({
    content: { type: String },
    title: { type: String },
    updatedAt: { type: Date, default: () => Date.now() }
});

DocumentSchema.pre('save', (next) => {
    this.updatedAt = new Date();
    next();
});

module.exports = mongoose.model('document', DocumentSchema);
