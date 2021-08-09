import './App.css';
import React from 'react';
var Scroll   = require('react-scroll');
var ScrollElement  = Scroll.Element;
var scroller = Scroll.scroller;

let defaultNotes = [
  "A note is a string of text placed at the bottom of a page in a book or document or at the end of a chapter, volume or the whole text. The note can provide an author's comments on the main text or citations of a reference work in support of the text.\nFootnotes are notes at the foot of the page while endnotes are collected under a separate heading at the end of a chapter, volume, or entire work. Unlike footnotes, endnotes have the advantage of not affecting the layout of the main text, but may cause inconvenience to readers who have to move back and forth between the main text and the endnotes.\nIn some editions of the Bible, notes are placed in a narrow column in the middle of each page between two columns of biblical text.",
];

class Note extends React.Component {
  constructor(props) {
    super(props);

    this.deleteNote = props.deleteNote;
    this.parentRefresh = props.parentRefresh;

    this.state = { "title": props.title, "newTitle": props.title, "text": props.text, "newText": props.text, "isTyping": ((props.justCreated) ? true : false), "justCreated": props.justCreated };

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
    this.setState({ "isTyping": true, "newText": this.state.text, "newTitle": this.state.title });
    this.parentRefresh();
  }

  handleChange(firstCapField)
  {
    let handleChangeFn = function(event) {
      let value = event.target.value;
      if(firstCapField=="Title")
        value = value.replace("\n", "");
      this.setState({ [`new${firstCapField}`]: value });
      this.parentRefresh();
    }
    return handleChangeFn.bind(this);
  }

  handleSubmit(event) {
    this.setState({ "isTyping": false, "text": this.state.newText, "title": this.state.newTitle, "justCreated": false });
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

  textBody(field, autoFocus=true) {
    let firstCapField = field.charAt(0).toUpperCase() + field.slice(1);
    if(this.state.isTyping)
      return <textarea autoFocus={autoFocus} className={`Note${firstCapField}`} value={this.state[`new${firstCapField}`]} readOnly={false} onChange={this.handleChange(firstCapField)} />;
    else 
      return <textarea className={`Note${firstCapField}`} value={this.state[field]} readOnly={true} />;
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
        {this.textBody('title')} <br />
        <hr className="titleTextLine" />
        {this.textBody('text', false)}
        {
          (this.state.isTyping) ? (
            <div>
              <button className="DoneButton" onClick={this.handleSubmit}> Done </button>
              <button className="CancelButton" onClick={this.handleCancel}> Cancel </button>
            </div>
          ) : (null)
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
    this.handleNewNote = this.handleNewNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.refresh = this.refresh.bind(this);

    let jsxNotes = {}
    for (let i = 0; i < defaultNotes.length; ++i) {
      jsxNotes[i] = this.createNote(i, `Note ${i+1}`, defaultNotes[i], false);
    }
    this.state = { "notes": jsxNotes, "editMode": false, "totalNotesCounter": Object.keys(jsxNotes).length };
  }

  createNote(key, initTitle, initText, justCreated) {
    return (
      <div key={key}>
      <ScrollElement name={`Note ${key}`}></ScrollElement>
      <Note title={initTitle} text={initText} deleteNote={this.deleteNote(key)} parentRefresh={this.refresh(key)} justCreated={justCreated} />
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

  handleNewNote(event) {
    let newNote = this.createNote(this.state.totalNotesCounter, "", "", true);
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
