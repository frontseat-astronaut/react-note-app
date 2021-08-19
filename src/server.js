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
		CreateNote: Note!
        EditNote(id: ID!, title: String!, text: String!): Note!
	}
`;

let notes = {

	0: {
		id: "0",
		time: 0,
		title: "Hey",
		text: "You"
	},
	1: {
		id: "1",
		time: 1,
		title: "All",
		text: "You"
	}
};
let totalNotesCount = 2;

function updateObject(obj, props) {
	Object.entries(props).forEach(([prop, value]) => { obj[prop] = value; });
}

const resolvers = {
	Query: {
		notes(){
			return Object.values(notes);
		},

		totalNotesCount(){
			return totalNotesCount;
		}
	},
	Mutation: {
		CreateNote(){
			let note = {
				"id": totalNotesCount+"",
				"time": totalNotesCount,
				"title": "",
				"text": ""
			};
            notes[totalNotesCounter] = note;
			totalNotesCount++;
			return note;
		},
        EditNote(_, args){
            let note = {
                "title": args.title,
                "text": args.text,
            }
            updateObject(notes[parseInt(args.id)], note);
            return notes[parseInt(args.id)];
        },
	}
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});

