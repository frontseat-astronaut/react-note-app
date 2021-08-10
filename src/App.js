import './App.css';
import React from 'react';
var Scroll = require('react-scroll');
var ScrollElement = Scroll.Element;
var scroller = Scroll.scroller;

let defaultNotes = [
  "A note is a string of text placed at the bottom of a page in a book or document or at the end of a chapter, volume or the whole text. The note can provide an author's comments on the main text or citations of a reference work in support of the text.\nFootnotes are notes at the foot of the page while endnotes are collected under a separate heading at the end of a chapter, volume, or entire work. Unlike footnotes, endnotes have the advantage of not affecting the layout of the main text, but may cause inconvenience to readers who have to move back and forth between the main text and the endnotes.\nIn some editions of the Bible, notes are placed in a narrow column in the middle of each page between two columns of biblical text.",
];

function Note(props) {

  let textBody = function (field, autoFocus = true) {
    let firstCapField = field.charAt(0).toUpperCase() + field.slice(1);
    if (props.isTyping)
      return <textarea autoFocus={autoFocus} className={`Note${firstCapField}`} value={props[`new${firstCapField}`]} readOnly={false} onChange={props.handleChange(firstCapField)} />;
    else
      return <textarea className={`Note${firstCapField}`} value={props[field]} readOnly={true} />;
  }

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
      {textBody('title')} <br />
      <hr className="titleTextLine" />
      {textBody('text', false)}
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

function updateObject(obj, props) {
  Object.entries(props).forEach(([prop, value]) => { obj[prop] = value; });
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.createNote = this.createNote.bind(this);
    this.displayNotes = this.displayNotes.bind(this);
    this.handleNewNote = this.handleNewNote.bind(this);
    this.editNote = this.editNote.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.deleteNote = this.deleteNote.bind(this);

    this._toJSXNote = this._toJSXNote.bind(this);

    let notes = {}
    for (let i = 0; i < defaultNotes.length; ++i)
      notes[i] = this.createNote(`Note #${i+1}`, defaultNotes[i], false);
    this.state = { "notes": notes, "totalNotesCounter": Object.keys(notes).length };
  }

  createNote(title, text, justCreated) {
    return {
      "title": title,
      "newTitle": "",
      "text": text,
      "newText": "",
      "isTyping": (justCreated) ? true : false,
      "justCreated": justCreated,
    };
  }

  _toJSXNote([key, note]) {
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
          editNote={this.editNote(key)}
          handleChange={this.handleChange(key)}
          handleSubmit={this.handleSubmit(key)}
          handleCancel={this.handleCancel(key)}
          deleteNote={this.deleteNote(key)}
          />
      </div>
    );
  }

  displayNotes() {
    return (
      <div className="NotesGrid">
        {Object.entries(this.state.notes).map(this._toJSXNote)}
      </div>
    );
  }

  handleNewNote(event) {
    this.setState((state) => {
      let note = this.createNote("", "", true);
      let notes = state.notes;
      notes[state.totalNotesCounter] = note;
      return { "notes": notes, "totalNotesCounter": state.totalNotesCounter + 1 };
    });
  }

  editNote(key) {
    let editNote = function (event) {
      this.setState((state) => {
        updateObject(state.notes[key], { "isTyping": true, "newTitle": state.notes[key].title, "newText": state.notes[key].text });
        console.log(state.notes[key]);
        return { "notes": state.notes }
      });
    };
    return editNote.bind(this);
  }

  handleChange(key) {
    let handleChange = function (firstCapField) {
      let handleChange = function (event) {
        this.setState((state) => {
          let value = event.target.value;
          if (firstCapField == "Title")
            value = value.replace("\n", "");
          updateObject(state.notes[key], { [`new${firstCapField}`]: value });
          return { "notes": state.notes };
        });
      }
      return handleChange.bind(this);
    }
    return handleChange.bind(this);
  }

  handleSubmit(key) {
    let handleSubmit = function (event) {
      this.setState((state) => {
        let note = state.notes[key];
        updateObject(note, { "isTyping": false, "text": note.newText, "title": note.newTitle, "justCreated": false });
        return { "notes": state.notes };
      });
    };
    return handleSubmit.bind(this);
  }

  handleCancel(key) {
    let handleCancel = function(event) {
      let note = this.state.notes[key];
      console.assert(note!=undefined);
      if (note.justCreated)
        delete this.state.notes[key];
      else
        updateObject(note, { "isTyping": false });
      this.setState({ "notes": this.state.notes });
    };
    return handleCancel.bind(this);
  }

  deleteNote(key) {
    let handleDelete = function (event) {
      if(window.confirm("Delete Note?"))
        delete this.state.notes[key];
      this.setState({"notes": this.state.notes});
    };
    return handleDelete.bind(this);
  }

  render() {
    return (
      <div className="App">
        <h1 className="Heading">NOTES</h1>
        <br />
        <button onClick={this.handleNewNote}>
          + Add Note
        </button>
        <br /> <br />
        {this.displayNotes()}
      </div>
    );
  }
}

export default App;
