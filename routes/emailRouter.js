const emailController = require('../controllers/emailController');

require('dotenv').config();

const express = require('express');

var emailRouter = express.Router();

emailRouter.post('/', express.json(), async (req, res) => {
    const { email, inviterEmail, documentTitle } = req.body;
    try {
        await emailController.sendEmail(email, inviterEmail, documentTitle);
        return res.status(200).json({message: 'Email sent succesfully!'});
       } catch (e) {
        return res.status(500).json({
            errors: {
                status: 500,
                source: '/',
                message: e.message
            }
        });
     }
});

module.exports = emailRouter;
