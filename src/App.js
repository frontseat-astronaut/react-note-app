import './App.css';
import React from 'react';
var Scroll = require('react-scroll');
var ScrollElement = Scroll.Element;
var scroller = Scroll.scroller;

let loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";

let defaultNotes = [
  ["C", loremIpsum.slice(0, 20)],
  ["G", loremIpsum.slice(4, 20)],
  ["B", loremIpsum.slice(2, 5)],
  ["E", loremIpsum.slice(20)],
  ["A", loremIpsum.slice(80, 200)],
  ["F", loremIpsum.slice(10, 40)],
  ["D", loremIpsum],
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
    this.changeOrder = this.changeOrder.bind(this);
    this.displayNotes = this.displayNotes.bind(this);
    this.handleNewNote = this.handleNewNote.bind(this);
    this.editNote = this.editNote.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.deleteNote = this.deleteNote.bind(this);

    this._toJSXNote = this._toJSXNote.bind(this);
    this._scrollToNote = this._scrollToNote.bind(this);

    let notes = {}
    for (let i = 0; i < defaultNotes.length; ++i)
      notes[i] = this.createNote(defaultNotes[i][0], defaultNotes[i][1], false, i);
    this.state = { 
      "notes": notes,
      "totalNotesCounter": Object.keys(notes).length,
      "focusedNote": -1,
      "sortBy": "time",
    };
  }

  createNote(title, text, justCreated, time) {
    console.log(time);
    return {
      "title": title,
      "newTitle": "",
      "text": text,
      "newText": "",
      "isTyping": (justCreated) ? true : false,
      "justCreated": justCreated,
      "time": time,
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

  changeOrder(value){
    let fn = function (event){
      this.setState({"sortBy": value});
    }
    return fn.bind(this);
  }

  displayNotes() {
    // comparison functions
    let byTime = (a, b) => {return b[1].time-a[1].time};
    let byTitle = (a, b) => {return (a[1].title<b[1].title)?-1:1}; // lexicographic compare

    let sortFn;
    switch(this.state.sortBy){
      case "title": sortFn = byTitle; break;
      default: sortFn = byTime;
    }

    let arrNotes = Array.from(Object.entries(this.state.notes));
    arrNotes.sort(sortFn);

    return (
      <div className="NotesGrid">
        {arrNotes.map(this._toJSXNote)}
      </div>
    );
  }

  handleNewNote(event) {
    this.setState((state) => {
      let note = this.createNote("", "", true, state.totalNotesCounter);
      let notes = state.notes;
      notes[state.totalNotesCounter] = note;
      return { "notes": notes, "totalNotesCounter": state.totalNotesCounter + 1, "focusedNote": state.totalNotesCounter};
    });
  }

  editNote(key) {
    let editNote = function (event) {
      this.setState((state) => {
        updateObject(state.notes[key], { "isTyping": true, "newTitle": state.notes[key].title, "newText": state.notes[key].text});
        return { "notes": state.notes, "focusedNote": key }
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
          return { "notes": state.notes, "focusedNote": key  };
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
        return { "notes": state.notes, "focusedNote": key };
      });
    };
    return handleSubmit.bind(this);
  }

  handleCancel(key) {
    let handleCancel = function(event) {
      let note = this.state.notes[key];
      if (note.justCreated)
        delete this.state.notes[key];
      else
        updateObject(note, { "isTyping": false });
      this.setState({ "notes": this.state.notes, "focusedNote": key });
    };
    return handleCancel.bind(this);
  }

  deleteNote(key) {
    let handleDelete = function (event) {
      if(window.confirm("Delete Note?"))
        delete this.state.notes[key];
      this.setState({"notes": this.state.notes, "focusedNote": -1});
    };
    return handleDelete.bind(this);
  }

  _scrollToNote(){
    if(this.state.focusedNote <0) return;
    scroller.scrollTo(`Note ${this.state.focusedNote}`, {"smooth": true});
  }

  componentDidUpdate(){
    this._scrollToNote();
  }

  render() {
    return (
      <div className="App">
        <h1 className="Heading">NOTES</h1>
        <br />
        <div className="AppOptions">
          <button className="AddNoteOption" onClick={this.handleNewNote}> + Add Note </button>
          <div className="SortOptions"> 
            Sort By:&nbsp; 
            <button onClick={this.changeOrder("time")}> Time </button>
            <button onClick={this.changeOrder("title")}> Title </button>
          </div>
        </div>
        <br /> <br /> <br />
        {this.displayNotes()}
      </div>
    );
  }
}

export default App;
