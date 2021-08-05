import './App.css';
import React from 'react';

function Note(props) {
  return (
    <div className="Note">
      {props.text}
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { "notes": ["a\nb", "c\nd"], "isTyping": false, "newNote": "" };

    this.handleNewNote = this.handleNewNote.bind(this);
    this.newNoteButton = this.newNoteButton.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.displayNotes = this.displayNotes.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.enterNote = this.enterNote.bind(this);
  }
  displayNotes() {
    return (
      <ul>
        {this.state.notes.map((note, index) =>
          <li key={index}><Note text={note} /><br/></li>
        )}
      </ul>
    );
  }
  newNoteButton() {
    return (
      <button onClick={this.handleNewNote}>
        Create New Note
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
        <textarea value={this.state.newNote} onChange={this.handleChange} />
        <br />
        <input type="submit" value="Add Note" />
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
        {(!this.state.isTyping) ? this.newNoteButton() : this.enterNote()} <br /><br />
        <label >
          <h2>Your notes: </h2>
          {this.displayNotes()}
        </label>
      </div>
    );
  }
}

export default App;
