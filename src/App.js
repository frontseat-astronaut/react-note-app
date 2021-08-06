import './App.css';
import React from 'react';

function Note(props) {
  return (
    <textarea className="Note" value={props.text} readOnly />
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { "notes": ["Hello there!\nI'm note #1", "Bruh\nNotes are useless", "kd", "djasi", "jdisa", "odkaso"], "isTyping": false, "newNote": "" };

    this.handleNewNote = this.handleNewNote.bind(this);
    this.newNoteButton = this.newNoteButton.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.displayNotes = this.displayNotes.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.enterNote = this.enterNote.bind(this);
  }
  displayNotes() {
    return (
      <div className="NotesGrid">
        {this.state.notes.map((note, index) =>
          <div key={index}><Note text={note} /></div>
        )}
      </div>
    );
  }
  newNoteButton() {
    return (
      <button onClick={this.handleNewNote} className="Button">
        + Add Note
      </button>
    );
  }
  handleNewNote(event) {
    this.setState({ "isTyping": true });
    event.preventDefault();
  }
  handleChange(event) {
    this.setState({ "newNote": event.target.value });
  }
  enterNote() {
    return (
      <form onSubmit={this.handleSubmit}>
        <textarea value={this.state.newNote} onChange={this.handleChange} className="TextInput" />
        <br />
        <input type="submit" value="Done" className="Button" />
      </form>
    );
  }
  handleSubmit(event) {
    event.preventDefault();
    let newNotes = this.state.notes;
    newNotes.push(this.state.newNote);
    this.setState({ "notes": newNotes, "isTyping": false, "newNote": "" });
  }
  render() {
    return (
      <div className="App">
        <br/>
        {(!this.state.isTyping) ? this.newNoteButton() : this.enterNote()} <br /><br />
        {this.displayNotes()}
      </div>
    );
  }
}

export default App;
