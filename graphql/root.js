const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLFloat,
    GraphQLNonNull
} = require('graphql');

const docsController = require('../controllers/docsController');
const userController = require('../controllers/userController');

const DocumentType = require("./document");
const UserType = require('./user')

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        documents: {
            type: new GraphQLList(DocumentType),
            description: 'List all documents',
            args: {
                owner: { type: GraphQLString },
                allowedEditor: { type: GraphQLString }
            },
            resolve: async (parent, args) => {
                const allDocuments = await docsController.getAllDocs(args.owner, args.allowedEditor);
                return allDocuments;
            }
        },
        document: {
            type: DocumentType,
            description: 'Get one documents',
            args: {
                documentId: { type: GraphQLString }
            },
            resolve: async (parent, args) => {
                const document = await docsController.getOneDoc(args.documentId);
                return document;
            }
        },
        users: {
            type: new GraphQLList(UserType),
            description: 'List all users',
            resolve: async () => {
                const allUsers = await userController.getAllUsers();
                return allUsers;
            }
        },
        user: {
            type: UserType,
            description: 'Get one user',
            args: {
                userId: { type: GraphQLString }
            },
            resolve: async (parent, args) => {
                const user = await userController.getOneUser(args.userId);
                return user;
            }
        },
    })
});

module.exports = RootQueryType;
