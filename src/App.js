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
const DELETE_NOTE = gql`
    mutation DeleteNote($id: ID!){
        DeleteNote(id: $id){
            id
            time
            title
            text
      }
  }
`;
const CHAR_LIMIT = 500;


function CharCounter(props) {
    let className = (props.text.length >= CHAR_LIMIT) ? "badCharCounter" : "charCounter";
    return <div className={className}>{props.text.length}/{CHAR_LIMIT}</div>;
}

function TextBody(props) {
    let paddedLines = ('\n').repeat(props.padLines ?? 0);
    if (!props.readOnly) {
        let handleChange = event => {
            let value = props.isCharLimit?event.target.value.slice(0, CHAR_LIMIT):event.target.value;
            props.handleChange(value);
        };
        return (
            <div>
                <textarea autoFocus={props.autoFocus ?? false} className={props.className} value={props.value} onChange={handleChange} />
                {(props.isCharLimit) ? <CharCounter text={props.value} /> : (null)}
            </div>
        );
    }
    else
        return <textarea className={props.className} value={props.value + paddedLines} readOnly />;
}


function useDelete(id){
    const [mutationFn, {loading, error, data}] = useMutation(DELETE_NOTE, {
        refetchQueries: [NOTES_QUERY]
    });

    let deleteNote = () => {
        mutationFn({
            variables: {id: id}
        })
    };

    return [{ loading, error }, deleteNote];
}

function Note(props) {

    const [{ loading, error }, deleteNote] = useDelete(props.id); // TODO: Note can exploit useDelete by deleting other note ID

    return (
        <div className="Note">
            <div className="Options">
                {(loading)?"Loading...":(
                    (error)?"Error!":
                        <a href="#" onClick={deleteNote}>[x]</a>
                )}
                <br />
                <a href="#" onClick={props.handleEdit}>[/]</a>
            </div>
            <TextBody
                className="NoteTitle"
                readOnly={true}
                autoFocus={true}
                value={props.title}
            /> <br />
            <hr className="titleTextLine" />
            <TextBody
                className="NoteText"
                readOnly={true}
                value={props.text}
            />
        </div>
    );
}


function useSubmit(id, doCreate) {
    const docNode = doCreate ? CREATE_NOTE : EDIT_NOTE;
    const [mutationFn, { loading, error, data }] = useMutation(docNode, {
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
    return [{ loading, error }, submitNote];
}

function DraftNote(props) {
    const [{ loading, error }, submitNote] = useSubmit(props.id, props.doCreate); // TODO: similar issue as above 
    const [draft, changeDraft] = useState({ title: props.title, text: props.text });

    let handleChange = (field) => ((value) => {
        changeDraft({ ...draft, [field]: value });
    });
    let handleSubmit = () => { props.deleteDraftNote(); submitNote(draft); };
    let handleCancel = () => { props.deleteDraftNote(); };

    return (
        <div className="DraftNote">
            <TextBody
                className="NoteTitle"
                autoFocus={true}
                value={draft.title}
                handleChange={handleChange("title")}
            /> <br />
            <hr className="titleTextLine" />
            <TextBody
                className="NoteText"
                value={draft.text}
                isCharLimit={true}
                handleChange={handleChange("text")}
            />

            {
                (loading)?"Loading...":(
                    (error)?"Error!":(
                        <div>
                            <button className="DoneButton" onClick={handleSubmit}> Done </button>
                            <button className="CancelButton" onClick={handleCancel}> Cancel </button>
                        </div>
                ))
            }
        </div>
    );
}


function NotesGrid(props) {

    return (
        <div className="NotesGrid">
            {props.notes}
        </div>
    );
}


function useSort(notes){
    const byTime = (a, b) => ((a.props.time > b.props.time)?-1:1);
    const byTitle = (a, b) => ((a.props.title.toLowerCase() < b.props.title.toLowerCase())?-1:1);

    const [sortBy, changeSortBy] = useState(()=>byTime);

    const changeOrder = sortBy => () => changeSortBy(()=>sortBy);

    if(!notes) return [null, ()=>{}, ()=>{}];
    
    let sortedNotes = [...notes];
    sortedNotes.sort(sortBy);

    return [sortedNotes, changeOrder(byTime), changeOrder(byTitle)];
}


function useSearch(notes){
    const [searchString, changeSearchString] = useState("");

    const handleChangeSearch = event => changeSearchString(event.target.value);

    if(!notes) return [null, searchString, ()=>{}];
    
    let filteredNotes = [...notes].filter(note => note.props.title.startsWith(searchString));
    console.log(filteredNotes);

    return [filteredNotes, searchString, handleChangeSearch];
}


function SearchBar(props) {
  return (<div className="Search">
    {(props.searchString == "") ?
      <input className="DefaultSearchText" value={"Search by Title..."} readOnly /> : (null)}
    <input className="SearchText" value={props.searchString} onChange={props.handleChangeSearch} />
  </div>);
}


function getNoteComponents(notes, draftNotes, handleEdit, deleteDraftNote) {

    let allNotes = {};
    notes.forEach(note => {
        allNotes[note.id] =
            <Note
                key={note.id}
                id={note.id}
                time={note.time}
                title={note.title}
                text={note.text}
                handleEdit={handleEdit(note)}
            />;
    });
    /*
    If id<0, it's a draft that's not yet present in the server and we have to perform CREATE_NOTE
    If id>0, it's a draft to edit a pre-existing note in the server and we have to perform EDIT_NOTE
    id = 0 should not be possible
    */
    Object.entries(draftNotes).forEach(([id, note]) => {
        console.assert(id != 0);
        allNotes[id] =
            <DraftNote
                key={id}
                title={note.title}
                text={note.text}
                time={note.time}
                doCreate={id < 0}
                id={id}
                deleteDraftNote={deleteDraftNote(id)}
            />
    });

    return Object.values(allNotes);
}

function App() {

    const { loading, error, data, refetch } = useQuery(NOTES_QUERY);

    const [draftNotes, changeDraftNotes] = useState({});
    const [draftNotesCount, changeDraftNotesCount] = useState(0);

    let handleAddNote = () => {
        let id = draftNotesCount + 1;
        changeDraftNotes({
            ...draftNotes,
            [`-${id}`]: {
                title: "",
                text: "",
                time: ":",
            }
        });
        changeDraftNotesCount(draftNotesCount + 1);
    }

    let handleEdit = note => () => {
        changeDraftNotes({
            ...draftNotes,
            [note.id]: {
                title: note.title,
                text: note.text,
                time: ":",
            }
        });
        changeDraftNotesCount(draftNotesCount + 1);
    };

    let deleteDraftNote = id => () => {
        const { [id]: sm, ...rest } = draftNotes;
        changeDraftNotes(rest);
    };

    const notes = data && data.notes;
    const allNotes = data && getNoteComponents(notes, draftNotes, handleEdit, deleteDraftNote);
    const [filteredNotes, searchString, handleChangeSearch] = useSearch(allNotes);
    const [sortedNotes, sortByTime, sortByTitle] = useSort(filteredNotes);

    if (loading)
        return <div>Loading...</div>
    if (error)
        return <div>Error in receiving notes!</div>

    return (
        <div className="App">
            <h1 className="Heading">NOTES</h1>
            <br />
            <button className="RefreshButton" onClick={() => refetch()}>Refresh</button>
            <button className="AddNoteButton" onClick={handleAddNote}>+ Add Note</button>
            <div className="SortOptions">
                Sort by:&nbsp;
                <button onClick={sortByTime}> time </button>
                <button onClick={sortByTitle}> title </button>
            </div>
            <SearchBar searchString={searchString} handleChangeSearch={handleChangeSearch} />
            <br /> <br /> <br /> <br />
            <NotesGrid notes={sortedNotes} /> 
        </div>

    );

}

export default App;
