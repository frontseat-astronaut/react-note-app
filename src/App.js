import './App.css';
import React from 'react';

let defaultNotes = [
  "A note is a string of text placed at the bottom of a page in a book or document or at the end of a chapter, volume or the whole text. The note can provide an author's comments on the main text or citations of a reference work in support of the text.\nFootnotes are notes at the foot of the page while endnotes are collected under a separate heading at the end of a chapter, volume, or entire work. Unlike footnotes, endnotes have the advantage of not affecting the layout of the main text, but may cause inconvenience to readers who have to move back and forth between the main text and the endnotes.\nIn some editions of the Bible, notes are placed in a narrow column in the middle of each page between two columns of biblical text.",
  "Note #2",
  "Note #3",
  "Note #4",
  "Note #5",
  "Note #6",
  "Note #7",
];

class Note extends React.Component {
  constructor(props) {
    super(props);

    this.key = props.key;
    this.deleteNote = props.deleteNote;

    this.state = { "text": props.text, "isTyping": false };

    this.editNote = this.editNote.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  editNote(event) {
    this.setState({ "isTyping": true });
  }

  handleChange(event) {
    this.setState({ "text": event.target.value });
  }

  handleSubmit(event) {
    this.setState({ "isTyping": false });
  }

  render() {
    console.log("Rendering!");
    return (
      <div className="Note">
        {
          (!this.state.isTyping)?(
            <div className="Options">
              <button className="OptionsButton" >...</button>
              <div className="DropdownOptions">
                <a href="#" onClick={this.editNote}>Edit</a><br />
                <a href="#" onClick={this.deleteNote}>Delete</a>
              </div>
            </div>
          ):(null)
        }
        <textarea className="NoteText" value={this.state.text} readOnly={!this.state.isTyping} onChange={this.handleChange} />
        {
          (this.state.Typing)?(<button onClick={this.handleSubmit}>Submit</button>):(null)
        }
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.displayNotes = this.displayNotes.bind(this);
    this.newNoteButton = this.newNoteButton.bind(this);
    this.handleNewNote = this.handleNewNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);

    let jsxNotes = {}
    for (let i = 0; i < defaultNotes.length; ++i) {
      jsxNotes[i] = <Note text={defaultNotes[i]} key={i} deleteNote={this.deleteNote(i)} />;
    }
    this.state = { "notes": jsxNotes, "editMode": false, "totalNotesCounter": jsxNotes.length };
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
    let newNote = <Note
    this.setState({"editMode": true})
  }

  deleteNote(key) {
    let handleDelete = function (event) {
      let notes = this.state.notes;
      delete notes[key];
      this.setState({ "notes": notes });
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
