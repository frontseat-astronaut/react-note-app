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


function Note(props){
    return (
        <div className="Note">
            {props.title}
            <br />
            {props.text}
        </div>
    );
}


function NotesGrid(props){

    let notes = props.notes.map((note)=><Note title={note.title} text={note.text}/>);
    return (
      <div className="NotesGrid">
        {notes}
      </div>
    );
}


function App(){

    const {loading, error, data} = useQuery(NOTES_QUERY);

    const dataNotes = data && data.notes;
    let totalNotesCount = data && data.totalNotesCount;

    const [drafts, updateDrafts] = useState({});
    let notes;
    if(dataNotes)
    {
        notes = dataNotes.map((note)=>
            ({
                ...note,
                "draft": (note.id in drafts)?(drafts[note.id]):null,
            })
        );
    }

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
            <NotesGrid notes={notes}/>
        </div>

    );

}

export default App;
