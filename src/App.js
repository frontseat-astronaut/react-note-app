import './App.css';
import React from 'react';
var Scroll   = require('react-scroll');
var ScrollElement  = Scroll.Element;
var scroller = Scroll.scroller;

let defaultNotes = [
  "Note #1\nA note is a string of text placed at the bottom of a page in a book or document or at the end of a chapter, volume or the whole text. The note can provide an author's comments on the main text or citations of a reference work in support of the text.\nFootnotes are notes at the foot of the page while endnotes are collected under a separate heading at the end of a chapter, volume, or entire work. Unlike footnotes, endnotes have the advantage of not affecting the layout of the main text, but may cause inconvenience to readers who have to move back and forth between the main text and the endnotes.\nIn some editions of the Bible, notes are placed in a narrow column in the middle of each page between two columns of biblical text.",
  "Note #2",
  "Note #3",
  "Note #4",
];

class Note extends React.Component {
  constructor(props) {
    super(props);

    this.deleteNote = props.deleteNote;
    this.parentRefresh = props.parentRefresh;

    this.state = { "text": props.text, "newText": props.text, "isTyping": (props.justCreated) ? true : false, "justCreated": props.justCreated };

    this.editNote = this.editNote.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);

  }

  componentDidMount(){
    if(this.state.justCreated)
      this.parentRefresh();
  }

  editNote(event) {
    this.setState({ "isTyping": true, "newText": this.state.text });
    this.parentRefresh();
  }

  handleChange(event) {
    this.setState({ "newText": event.target.value });
    this.parentRefresh();
  }

  handleSubmit(event) {
    this.setState({ "isTyping": false, "text": this.state.newText, "justCreated": false });
    this.parentRefresh();
  }

  handleCancel(event) {
    if (this.state.justCreated) {
      this.deleteNote(null, true);
      return;
    }
    this.setState({ "isTyping": false });
    this.parentRefresh();
  }

  render() {
    return (
      <div className={(this.state.isTyping) ? "EditingNote" : "Note"}>
        {
          (!this.state.isTyping) ? (
            <div className="Options">
              <a href="#" onClick={this.deleteNote}>[x]</a>
              <br />
              <a href="#" onClick={this.editNote}>[/]</a>
            </div>
          ) : (null)
        }
        {
          (this.state.isTyping) ? (
            <div>
              <textarea autoFocus className="NoteText" value={this.state.newText} readOnly={false} onChange={this.handleChange} /> <br />
              <button className="DoneButton" onClick={this.handleSubmit}> Done </button>
              <button className="CancelButton" onClick={this.handleCancel}> Cancel </button>
            </div>
          ) : (
            <textarea className="NoteText" value={this.state.text} readOnly={true} />
          )
        }
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.createNote = this.createNote.bind(this);
    this.displayNotes = this.displayNotes.bind(this);
    this.newNoteButton = this.newNoteButton.bind(this);
    this.handleNewNote = this.handleNewNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.refresh = this.refresh.bind(this);

    let jsxNotes = {}
    for (let i = 0; i < defaultNotes.length; ++i) {
      jsxNotes[i] = this.createNote(i, defaultNotes[i], false);
    }
    this.state = { "notes": jsxNotes, "editMode": false, "totalNotesCounter": Object.keys(jsxNotes).length };
  }

  createNote(key, initText, justCreated) {
    return (
      <div key={key}>
      <ScrollElement name={`Note ${key}`}></ScrollElement>
      <Note text={initText} deleteNote={this.deleteNote(key)} parentRefresh={this.refresh(key)} justCreated={justCreated} />
      </div>);
  }

  refresh(key) {
    let parentRefresh = function() {
      this.setState({});
      scroller.scrollTo(`Note ${key}`, {'smooth':true, 'duration': 700});
    };
    return parentRefresh.bind(this);
  }

  displayNotes() {
    return (
      <div className="NotesGrid">
        {Object.values(this.state.notes)}
      </div>
    );
  }

  newNoteButton() {
    return (
      <button onClick={this.handleNewNote}>
        + Add Note
      </button>
    );
  }

  handleNewNote(event) {
    let newNote = this.createNote(this.state.totalNotesCounter, "", true);
    let newNotes = this.state.notes;
    newNotes[this.state.totalNotesCounter] = newNote;
    this.setState({ "editMode": true, "totalNotesCounter": this.state.totalNotesCounter + 1 });
  }

  deleteNote(key) {
    let handleDelete = function (event, cancelled=false) {
      if (cancelled || window.confirm(`Delete Note?`)) {
        let notes = this.state.notes;
        delete notes[key];
        this.setState({ "notes": notes });
      }
    };
    return handleDelete.bind(this);
  }

  render() {
    return (
      <div className="App">
        <h1 className="Heading">NOTES</h1>
        <br />
        {this.newNoteButton()}
        <br /> <br />
        {this.displayNotes()}
      </div>
    );
  }
}

export default App;
