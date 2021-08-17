import './App.css';
import React, { useState, useEffect } from 'react';
var Scroll = require('react-scroll');
var ScrollElement = Scroll.Element;
var scroller = Scroll.scroller;


const LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui";
const DEFAULT_NOTES = [
  ["CAB", LOREM_IPSUM.slice(0, 20)],
  ["CADENCE", LOREM_IPSUM.slice(4, 20)],
  ["CANCEL", LOREM_IPSUM.slice(2, 5)],
  ["AUTOCAD", LOREM_IPSUM.slice(20)],
  ["CABIN", LOREM_IPSUM.slice(80, 200)],
  ["cab", "aaaaaaa\n".repeat(50)],
  ["DALTON", LOREM_IPSUM],
];
const CHAR_LIMIT = 400;


function CharCounter(props) {
  let className = (props.text.length > CHAR_LIMIT) ? "badCharCounter" : "charCounter";
  return <div className={className}>{props.text.length}/{CHAR_LIMIT}</div>;
}

function TextBody(props) {
  let paddedLines = ('\n').repeat(props.padLines??0);
  if (props.isTyping)
    return (
      <div>
        <textarea autoFocus={props.autoFocus} className={props.className} value={props.newValue} readOnly={false} onChange={props.handleChange} />
        {(props.charCounter) ? <CharCounter text={props.newValue} /> : (null)}
      </div>
    );
  else
    return <textarea className={props.className} value={props.value+paddedLines} readOnly={true} />;
}

function Note(props) {

  return (
    <div className={(props.isTyping) ? "EditingNote" : "Note"}>
      {
        (!props.isTyping) ? (
          <div className="Options">
            <a href="#" onClick={props.deleteNote}>[x]</a>
            <br />
            <a href="#" onClick={props.editNote}>[/]</a>
          </div>
        ) : (null)
      }

      <TextBody 
        className="NoteTitle"
        isTyping={props.isTyping}
        autoFocus={true} 
        newValue={props.newTitle}
        value={props.title} 
        charCounter={false}
        handleChange={props.handleChangeNote("Title")}
      /> <br />
      <hr className="titleTextLine" />
      <TextBody 
        className="NoteText"
        isTyping={props.isTyping}
        autoFocus={false} 
        newValue={props.newText}
        value={props.text} 
        charCounter={true}
        padLines={1}
        handleChange={props.handleChangeNote("Text")}
      />

      {
        (props.isTyping) ? (
          <div>
            <button className="DoneButton" onClick={props.handleSubmit}> Done </button>
            <button className="CancelButton" onClick={props.handleCancel}> Cancel </button>
          </div>
        ) : (null)
      }
    </div>
  );
}

function SearchBar(props) {
  return (<div className="Search">
    {(props.searchString == "") ?
      <input className="DefaultSearchText" value={"Search by Title..."} readOnly /> : (null)}
    <input className="SearchText" value={props.searchString} onChange={props.handleChangeSearch} />
  </div>);
}

function updateObject(obj, props) {
  Object.entries(props).forEach(([prop, value]) => { obj[prop] = value; });
}

function createNote(title, text, justCreated, time) {
  return {
    "title": title,
    "newTitle": title,
    "text": text,
    "newText": text,
    "isTyping": (justCreated) ? true : false,
    "justCreated": justCreated,
    "time": time,
  };
}

function App(){

  let notes = {}
  for (let i = 0; i < DEFAULT_NOTES.length; ++i)
    notes[i] = createNote(DEFAULT_NOTES[i][0], DEFAULT_NOTES[i][1], false, i);

  const initState = {
    "notes": notes,
    "totalNotesCounter": Object.keys(notes).length,
    "focusedNote": -1,
    "sortBy": "time",
    "searchString": "",
  };
  const [state, updateState] = useState(initState);

  let setState = function(props){
    let newState = Object.assign({}, state);
    updateObject(newState, props);
    updateState(newState);
  };

  let changeOrder = function(value) {
    let fn = function (event) {
      setState({ "sortBy": value, "focusedNote": -1 });
    }
    return fn;
  }

  let handleChangeSearch = function(event) {
    setState({ "searchString": event.target.value, "focusedNote": -1 });
  }

  let handleNewNote = function(event) {
    let note = createNote("", "", true, state.totalNotesCounter);
    let notes = state.notes;
    notes[state.totalNotesCounter] = note;
    setState({ "notes": notes, "totalNotesCounter": state.totalNotesCounter + 1, "focusedNote": state.totalNotesCounter, "searchString": "" });
  }

  let editNote = function(key) {
    let editNote = function (event) {
      updateObject(state.notes[key], { "isTyping": true, "newTitle": state.notes[key].title, "newText": state.notes[key].text });
      setState({ "notes": state.notes, "focusedNote": key });
    };
    return editNote;
  }

  let handleChangeNote = function(key) {
    let handleChangeNote = function (firstCapField) {
      let handleChangeNote = function (event) {
        let value = event.target.value;
        if (firstCapField == "Title")
          value = value.replace("\n", "");
        updateObject(state.notes[key], { [`new${firstCapField}`]: value });
        setState({ "notes": state.notes, "focusedNote": key });
      }
      return handleChangeNote;
    }
    return handleChangeNote;
  }

  let handleSubmit = function(key) {
    let handleSubmit = function (event) {
      let note = state.notes[key];
      if (note.newText.length > CHAR_LIMIT)
        return {};
      updateObject(note, { "isTyping": false, "text": note.newText, "title": note.newTitle, "justCreated": false });
      setState({"notes": state.notes, "focusedNote": key });
    };
    return handleSubmit;
  }

  let handleCancel = function(key) {
    let handleCancel = function (event) {
      let note = state.notes[key];
      if (note.justCreated)
        delete state.notes[key];
      else
        updateObject(note, { "isTyping": false });
      setState({ "notes": state.notes, "focusedNote": -1 });
    };
    return handleCancel;
  }

  let deleteNote = function(key) {
    let handleDelete = function (event) {
      if (window.confirm("Delete Note?"))
        delete state.notes[key];
      setState({ "notes": state.notes, "focusedNote": -1 });
    };
    return handleDelete;
  }

  let _scrollToNote = function() {
    if (state.focusedNote < 0) return;
    scroller.scrollTo(`Note ${state.focusedNote}`, { "smooth": true, duration: 500 });
  }

  let _toJSXNote = function([key, note]) {
    return (
      <div key={key}>
        <ScrollElement name={`Note ${key}`}></ScrollElement>
        <Note
          title={note.title}
          newTitle={note.newTitle}
          text={note.text}
          newText={note.newText}
          isTyping={note.isTyping}
          justCreated={note.justCreated}
          editNote={editNote(key)}
          handleChangeNote={handleChangeNote(key)}
          handleSubmit={handleSubmit(key)}
          handleCancel={handleCancel(key)}
          deleteNote={deleteNote(key)}
        />
      </div>
    );
  }

  let displayNotes = function() {
    // comparison functions
    let byTime = (a, b) => { return b[1].time - a[1].time };
    let byTitle = (a, b) => { return (a[1].title.toLowerCase() < b[1].title.toLowerCase()) ? -1 : 1 }; // lexicographic compare

    let sortFn;
    switch (state.sortBy) {
      case "title": sortFn = byTitle; break;
      default: sortFn = byTime;
    }

    let arrNotes = Array.from(Object.entries(state.notes));
    arrNotes.sort(sortFn);

    // filter out notes that don't follow constraints
    let filteredNotes = arrNotes.filter(([_, note]) => {
      return note.title.toLowerCase().startsWith(state.searchString.toLowerCase());
    });

    return (
      <div className="NotesGrid">
        {filteredNotes.map(_toJSXNote)}
      </div>
    );
  }

  useEffect(() => {
    _scrollToNote();
  });

  return (
    <div className="App">
      <h1 className="Heading">NOTES</h1>
      <br />
      <button className="AddNoteOption" onClick={handleNewNote}> + Add Note </button>
      <SearchBar searchString={state.searchString} handleChangeSearch={handleChangeSearch} />
      <div className="SortOptions">
        Sort By:&nbsp;
        <button onClick={changeOrder("time")}> Time </button>
        <button onClick={changeOrder("title")}> Title </button>
      </div>
      <br /> <br /> <br /> <br />
      {displayNotes()}
    </div>
  );
}

export default App;
