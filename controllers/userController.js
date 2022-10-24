let User = require('../models/user');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

require('dotenv').config();

exports.getAllUsers = async () => {
    const users = await User.find({});

    return users;
};

exports.getOneUser = async (userId) => {
    const user = await User.findById(userId).exec();

    return user;
};

exports.getOneUserByEmail = async (email) => {
    const user = await User.findOne({ email: email }).exec();

    return user;
};

exports.createUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        bcryptjs.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        message: 'Could not hash password'
                    }
                });
            }

            const encryptedPassword = hash;

            const data = {
                email: email,
                password: encryptedPassword
            };

            try {
                const user = await User.create(data);

                return res
                    .status(201)
                    .json({ message: 'User succesfully created!', _id: user._id });
            } catch (error) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        message: 'Email allready in use'
                    }
                });
            }
        });
    } catch (e) {
        return res.status(500).json({
            errors: {
                status: 500,
                source: '/',
                title: 'Database error',
                detail: e.message
            }
        });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email }).exec();

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        bcryptjs.compare(password, user.password, async (err, result) => {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        message: 'Could not decrypt password.'
                    }
                });
            }

            if (result) {
                const secret = process.env.JWT_SECRET;
                const payload = { email: user.email };
                const token = jwt.sign(payload, secret, {
                    expiresIn: '1h'
                });

                return res.status(201).json({
                    email: user.email,
                    _id: user._id,
                    token: token
                });
            }

            return res.status(401).json({
                message: 'Password is incorrect.'
            });
        });
    } catch (e) {
        return res.status(500).json({
            errors: {
                status: 500,
                source: '/',
                title: 'Database error',
                detail: e.message
            }
        });
    }
};

exports.updateUser = async (userId, data) => {
    const user = await User.findById(userId).exec();
    const response = await user.updateOne(data);

    return response;
};

exports.deleteUser = async (userId) => {
    const filter = { _id: userId };
    const result = await User.deleteOne(filter);

    return result;
};
