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
    this.parentRefresh = props.parentRefresh;

    this.state = { "text": props.text, "newText": "", "isTyping": false };

    this.editNote = this.editNote.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
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
    this.setState({ "isTyping": false, "text": this.state.newText });
    this.parentRefresh();
  }

  handleCancel(event) {
    this.setState({ "isTyping": false });
    this.parentRefresh();
  }

  render() {
    return (
      <div className={(this.state.isTyping) ? "EditingNote" : "Note"}>
        {
          (!this.state.isTyping) ? (
            <div className="Options">
              {/* <button className="OptionsButton" >...</button> */}
              <div className="DropdownOptions">
                <a href="#" onClick={this.editNote}>Edit</a><br /><br />
                <a href="#" onClick={this.deleteNote}>Delete</a>
              </div>
            </div>
          ) : (null)
        }
        {
          (this.state.isTyping) ? (
            <div>
              <textarea className="NoteText" value={this.state.newText} readOnly={false} onChange={this.handleChange} /> <br />
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

    this.displayNotes = this.displayNotes.bind(this);
    this.newNoteButton = this.newNoteButton.bind(this);
    this.handleNewNote = this.handleNewNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.refresh = this.refresh.bind(this);

    let jsxNotes = {}
    for (let i = 0; i < defaultNotes.length; ++i) {
      jsxNotes[i] = <Note text={defaultNotes[i]} key={i} deleteNote={this.deleteNote(i)} parentRefresh={this.refresh} />;
    }
    this.state = { "notes": jsxNotes, "editMode": false, "totalNotesCounter": jsxNotes.length };
  }

  refresh() {
    this.setState({ "dummyParam": false });
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
    // let newNote = <Note
    // this.setState({"editMode": true})
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
