const express = require('express');
const docsRouter = require('./docsRouter.js');
const userRouter = require('./userRouter.js');
const authRouter = require('./authRouter.js');
const emailRouter = require('./emailRouter.js');
const authController = require('../controllers/authController');

const routes = express.Router();

const visual = false;
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema } = require('graphql');

const RootQueryType = require('../graphql/root');

const schema = new GraphQLSchema({
    query: RootQueryType
});

routes.use('/docs', authController.checkToken, docsRouter);
routes.use('/user', authController.checkToken, userRouter);
routes.use('/email', emailRouter);
routes.use(
    '/graphql',
    authController.checkToken,
    graphqlHTTP({
        schema: schema,
        graphiql: visual // Visual är satt till true under utveckling annars visual
    })
);
routes.use('/auth', authRouter);

module.exports = routes;
