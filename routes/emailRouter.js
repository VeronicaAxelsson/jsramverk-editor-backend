const mailgun = require("mailgun-js");
require('dotenv').config();
// const userController = require('../controllers/userController');

const express = require('express');
const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

var emailRouter = express.Router();


emailRouter.post('/', express.json(), async (req, res) => {
    const { email, inviterEmail, documentTitle } = req.body;
    // let message = 'Existerande användare';

    try {
        // const user = await userController.getOneUserByEmail(email);
        // console.log(user);

        // if (!user) {
        //     message = 'Icke Existerande användare';
        // }
        // return res.json(user);
        mg.messages().send({
            from: 'ABC Editor <abc@editor.com>',
            to: email,
            subject: 'ABC Editor',
            html: `<div><p>User ${inviterEmail} has invited you to edit a document in ABC Editor</p><a href="https://www.student.bth.se/~veax20/editor/">Don't have an account? Click here to register</a></div>`
        }, (error, body) => {
            if (error) {
                console.log(error);
                return res.status(500).json({message: 'Error in sending email.'})
            }
            console.log(body);
            return res.status(200).json({message: 'Email sent succesfully!'})
        });
    } catch (error) {
        return res.status(500).json({message: 'fel'})
    }

});

module.exports = emailRouter;
