let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//User schema definition
let UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (email) {
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
            },
            message: (props) => `${props.value} is not a valid email adress!`
        }
    },
    password: { type: String, required: true }
});

module.exports = mongoose.model('user', UserSchema);
