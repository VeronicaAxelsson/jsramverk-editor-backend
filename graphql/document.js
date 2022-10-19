const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLFloat,
    GraphQLNonNull
} = require('graphql');


const DocumentType = new GraphQLObjectType({
    name: 'Document',
    description: 'This represents a document',
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString)},
        owner: { type: new GraphQLNonNull(GraphQLString) },
        ownerEmail: { type: GraphQLString },
        content: { type: GraphQLString },
        title: { type: GraphQLString },
        type: { type: GraphQLString },
        updatedAt: { type: GraphQLString },
        allowed_editors: { type: new GraphQLList(GraphQLString) }
    })
})

module.exports = DocumentType;