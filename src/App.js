import './App.css';
import React, { useState, useEffect } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  useMutation,
  gql
} from "@apollo/client";


var Scroll = require('react-scroll');
var ScrollElement = Scroll.Element;
var scroller = Scroll.scroller;


const NOTES_QUERY = gql`
  query GetNotes{
    notes{
      id
      time
      title
      text
    }
  }
`;
const EDIT_NOTE = gql`
  mutation EditNote($id: ID!, $title: String!, $text: String!){
      EditNote(id: $id, title: $title, text: $text){
          id
          time
          title
          text
      }
  }
`;
const CREATE_NOTE = gql`
  mutation CreateNote($title: String!, $text: String!){
      CreateNote(title: $title, text: $text){
          id
          time
          title
          text
      }
  }
`;


function Note(props){
    return (
        <div className="Note">
            <h1>{props.title} </h1>
            <br />
            {props.text}
            <button onClick={props.handleEdit}>Edit</button>
        </div>
    );
}


function useSubmit(id, doCreate){
    const docNode = doCreate?CREATE_NOTE:EDIT_NOTE;
    const [mutationFn, {loading, error, data}] = useMutation(docNode, {
        refetchQueries: [NOTES_QUERY]
    });

    let submitNote = draft => {
        mutationFn({
            variables: {
                ...draft,
                id: id
            }
        });
    };
    return [{loading, error}, submitNote];
}


function DraftNote(props){
    const [{loading, error}, submitNote] = useSubmit(props.id, props.doCreate); // TODO: DraftNote shouldn't be able to edit any other note
    const [draft, changeDraft] = useState({title: props.title, text: props.text});
    let handleChange = (field) => ((event)=>{
        changeDraft({...draft, [field]: event.target.value});
    }); 
    let handleSubmit = ()=>{props.deleteDraftNote(); submitNote(draft);};
    return (
        <div className="DraftNote">
            <h1><input value={draft.title} onChange={handleChange('title')}/> </h1>
            <br />
            <input value={draft.text} onChange={handleChange('text')}/>
            {
                (loading)?"Loading...":(
                    (error)?"Error!":
                        <button onClick={handleSubmit}>Done</button>
                )
            }
        </div>
    );
}


function NotesGrid(props){

    return (
      <div className="NotesGrid">
        {props.notes}
      </div>
    );
}


function getNoteComponents(notes, draftNotes, handleEdit, deleteDraftNote){

    let allNotes = {};
    notes.forEach(note =>{
        allNotes[note.id] = 
            <Note 
                key={note.id}
                title={note.title}
                text={note.text} 
                handleEdit={handleEdit(note)}
            />;
    });
    /*
    If id<0, it's a draft that's not yet present in the server and we have to perform CREATE_NOTE
    If id>0, it's a draft that's already present in the server and we have to perform EDIT_NOTE
    id = 0 should not be possible
    */
    Object.entries(draftNotes).forEach(([id, note])=>{
        console.assert(id!=0);
        allNotes[id] = 
            <DraftNote 
                key={id}
                title={note.title}
                text={note.text}
                doCreate={id<0}
                id={id}
                deleteDraftNote={deleteDraftNote(id)}
            />
    });

    return Object.values(allNotes);
}


function App(){

    const {loading, error, data, refetch} = useQuery(NOTES_QUERY);

    const [draftNotes, changeDraftNotes] = useState({});
    const [draftNotesCount, changeDraftNotesCount] = useState(0);

    let handleAddNote = ()=>{
        let id = draftNotesCount+1;
        changeDraftNotes({...draftNotes, 
            [`-${id}`]: {
                title: "",
                text: "",
        }});
        changeDraftNotesCount(draftNotesCount+1);
    }

    let handleEdit = note => () => {
        changeDraftNotes({...draftNotes, 
            [note.id]: {
                title: note.title,
                text: note.text,
            }
        });
        changeDraftNotesCount(draftNotesCount+1);
    };

    let deleteDraftNote = id =>()=>{
        const {[id]:sm, ...rest} = draftNotes;
        changeDraftNotes(rest);
    };

    const notes = data && data.notes;
    const allNotes = data && getNoteComponents(notes, draftNotes, handleEdit, deleteDraftNote);

    if(loading)
        return <div>Loading...</div>
    if(error)
        return <div>Error in receiving notes!</div>
    return (
        <div className="App">
            <h1 className="Heading">NOTES</h1>
            <br />
            <button className="RefreshButton" onClick={() => refetch()}>Refresh</button>
            <button className="AddNoteButton" onClick={handleAddNote}>+ Add Note</button>
            {/* <SearchBar searchString={state.searchString} handleChangeSearch={handleChangeSearch} /> */}
            {/* <div className="SortOptions"> */}
            {/* Sort By:&nbsp; */}
            {/* <button onClick={changeOrder("time")}> Time </button> */}
            {/* <button onClick={changeOrder("title")}> Title </button> */}
            {/* </div> */}
            <br /> <br /> <br /> <br />
            <NotesGrid notes={allNotes} />
        </div>

    );

}

export default App;
