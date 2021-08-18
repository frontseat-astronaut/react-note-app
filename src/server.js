const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
#	Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

	type Note{
		id: ID!
		time: Int
		title: String!
		text: String!
	}

	type Query{
		notes: [Note!]!
		totalNotesCount: Int!
	}

	type Mutation{
		addNote(title: String!, text: String!): Note
	}
`;

let notes = [
	{
		id: "1",
		time: 4,
		title: "Hey",
		text: "You"
	},
	{
		id: "2",
		time: 1,
		title: "All",
		text: "You"
	}
];
let totalNotesCount = 2;

const resolvers = {
	Query: {
		notes(){
			return notes;
		},

		totalNotesCount(){
			return totalNotesCount;
		}
	},
	Mutation: {
		addNote(parent, args){
			let note = {
				"id": totalNotesCount+"",
				"time": totalNotesCount,
				"title": args.title,
				"text": args.text,
			};
			totalNotesCount++;
			notes.push(note);
			return note;
		}
	}
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});

