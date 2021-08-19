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
  query GetNotesAndCount{
    notes{
      id
      time
      title
      text
    }
    totalNotesCount
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


function Note(props){
    const [draft, changeDraft] = useState(null);
    let handleEdit = ()=>{
        changeDraft({title: props.title, text: props.text});
    };
    let handleChange = (field) => ((event)=>{
        changeDraft({...draft, [field]: event.target.value});
    }); 
    let handleSubmit = ()=>{
        props.editNote(draft);
        changeDraft(null);
    };
    if(draft){
        return (
            <div className="EditingNote">
                <h1><input value={draft.title} onChange={handleChange('title')}/> </h1>
                <br />
                <input value={draft.text} onChange={handleChange('text')}/>
                <button onClick={handleSubmit}>Submit</button>
            </div>
        );
    }
    else
        return (
            <div className="Note">
                <h1>{props.title} </h1>
                <br />
                {props.text}
                <button onClick={handleEdit}>Edit</button>
            </div>
        );
}


function NotesGrid(props){

    let notes = props.notes.map((note)=><Note key={note.id} title={note.title} text={note.text} editNote={props.editNote(note.id)} />);
    return (
      <div className="NotesGrid">
        {notes}
      </div>
    );
}


function App(){

    const {loading, error, data} = useQuery(NOTES_QUERY);
    const [editNoteMutation, {loading_, error_, _}] = useMutation(EDIT_NOTE);

    let editNote = (id) => ((draft)=>
        editNoteMutation({
            variables: {
                ...draft,
                id: id
            }
        })
    );

    const notes = data && data.notes;
    const totalNotesCount = data && data.totalNotesCount;

    if(loading)
        return <div>Loading...</div>
    if(error)
        return <div>Error in receiving notes!</div>
    return (
        <div className="App">
            <h1 className="Heading">NOTES</h1>
            <br />
            {/* <button className="AddNoteOption" onClick={handleNewNote}> + Add Note </button> */}
            {/* <SearchBar searchString={state.searchString} handleChangeSearch={handleChangeSearch} /> */}
            {/* <div className="SortOptions"> */}
            {/* Sort By:&nbsp; */}
            {/* <button onClick={changeOrder("time")}> Time </button> */}
            {/* <button onClick={changeOrder("title")}> Title </button> */}
            {/* </div> */}
            <br /> <br /> <br /> <br />
            <NotesGrid notes={notes} editNote={editNote}/>
        </div>

    );

}

export default App;
