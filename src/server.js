const { ApolloServer, gql } = require('apollo-server');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');


const typeDefs = gql`
	type Note{
		id: ID!
		time: Int
		title: String!
		text: String!
	}

	type Query{
		notes: [Note!]!
	}

	type Mutation{
		CreateNote(title: String!, text: String!): Note!
        EditNote(id: ID!, title: String!, text: String!): Note!
		DeleteNote(id: ID!): Note
	}
`;

var db = new JsonDB(new Config("notes", true));
db.push("/notes", {});
db.push("/totalNotesCount", 0); 
console.log(db.getData("/"));

function updateObject(obj, props) {
	Object.entries(props).forEach(([prop, value]) => { obj[prop] = value; });
}

const resolvers = {
	Query: {
		notes(){
			return Object.values(db.getData("/notes"));
		},
	},
	Mutation: {
		CreateNote(_, args){
			let totalNotesCount = db.getData("/totalNotesCount")+1;
			let note = {
				"id": totalNotesCount+"",
				"time": totalNotesCount,
				"title": args.title,
				"text": args.text
			};
			db.push(`/notes/${totalNotesCount}`, note);
			db.push("/totalNotesCount", totalNotesCount);
			return note;
		},
        EditNote(_, args){
            let props = {
                "title": args.title,
                "text": args.text,
            }
			let note = db.getData(`/notes/${args.id}`);
            updateObject(note, props);
			db.push(`/notes/${args.id}`, note);
            return note;
        },
		DeleteNote(_, args){
			let note = db.getData(`/notes/${args.id}`)
			db.delete(`/notes/${args.id}`);
			return note;
		}
	}
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});

