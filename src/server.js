const { ApolloServer, gql } = require('apollo-server');
const { JsonDB } = require('node-json-db');
const { Config } = require('node-json-db/dist/lib/JsonDBConfig');


const typeDefs = gql`
	type Note{
		id: ID!
		time: String!
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
if( Object.keys(db.getData("/"))==0 ){
	db.push("/notes", {});
	db.push("/totalNotesCount", 0); 
}
console.log(db.getData("/"));

function updateObject(obj, props) {
	Object.entries(props).forEach(([prop, value]) => { obj[prop] = value; });
}

// TODO: use utils.js; having import some issue
function getCurrentTime(){
    const zp = (num, cnt) => String(num).padStart(cnt, "0");
    let today = new Date();
    let date = zp(today.getFullYear(), 4)+zp(today.getMonth()+1, 2)+zp(today.getDate(), 2);
    let time = zp(today.getHours(), 2) + zp(today.getMinutes(), 2) + zp(today.getSeconds(), 2);
    let dateTime = date+time;
    return dateTime;
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
				"time": getCurrentTime(),
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
				"time": getCurrentTime(),
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

