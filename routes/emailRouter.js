const emailController = require('../controllers/emailController');

require('dotenv').config();

const express = require('express');

var emailRouter = express.Router();

emailRouter.post('/', express.json(), async (req, res) => {
    const { email, inviterEmail, documentTitle } = req.body;
    try {
        await emailController.sendEmail(email, inviterEmail, documentTitle);
        res.json({message: 'Email sent succesfully!'});
        await next();
       } catch (e) {
        return res.status(500).json({
            errors: {
                status: 500,
                source: '/',
                message: e.message
            }
        });
     }
    // try {
    //     const { email, inviterEmail, documentTitle } = req.body;
    //     const result = await emailController.sendEmail(email, inviterEmail, documentTitle);
    //     console.log(result);
    //     return res.status(200).json(result);
    // } catch (error) {
    //     return res.status(500).json({
    //         errors: {
    //             status: 500,
    //             source: '/',
    //             title: 'Database error',
    //             detail: e.message
    //         }
    //     });
    // }
});

module.exports = emailRouter;
