const express = require('express');
const userController = require('../controllers/userController');

var userRouter = express.Router();

userRouter.get('/', async (req, res) => {
    try {
        const users = await userController.getAllUsers();

        return res.status(200).json(users);
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
});

userRouter.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await userController.getOneUser(userId);

        return res.status(200).json(user);
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
});

userRouter.put('/:userId', express.json(), async (req, res) => {
    try {
        const { userId } = req.params;
        const data = req.body;

        const response = await userController.updateUser(userId, data);

        return res.status(200).json(response);
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
});

userRouter.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const result = await userController.deleteUser(userId);

        if (result.deletedCount === 1) {
            return res.status(200).json({ message: 'Successfully deleted one user.' });
        } else {
            return res.status(200).json({
                message: 'No users matched the query. Deleted 0 users.'
            });
        }
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
});

module.exports = userRouter;
