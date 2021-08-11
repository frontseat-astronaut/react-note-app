import './App.css';
import React from 'react';
var Scroll = require('react-scroll');
var ScrollElement = Scroll.Element;
var scroller = Scroll.scroller;

let loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui";

let defaultNotes = [
  ["CAB", loremIpsum.slice(0, 20)],
  ["CAB RIDE", loremIpsum.slice(4, 20)],
  ["BATTLE", loremIpsum.slice(2, 5)],
  ["BALCONY", loremIpsum.slice(20)],
  ["ATLAS", loremIpsum.slice(80, 200)],
  ["attire", loremIpsum.slice(10, 40)],
  ["DALTON", loremIpsum],
];

function CharCounter(props) {
  let className = (props.text.length>props.charLimit)?"badCharCounter":"charCounter";
  return <div className={className}>{props.text.length}/{props.charLimit}</div>;
}

function Note(props) {

  let textBody = function (field, autoFocus = true) {
    let firstCapField = field.charAt(0).toUpperCase() + field.slice(1);
    if (props.isTyping)
      return (
        <div>
          <textarea autoFocus={autoFocus} className={`Note${firstCapField}`} value={props[`new${firstCapField}`]} readOnly={false} onChange={props.handleChangeNote(firstCapField)} />
          {(field=="text")? <CharCounter text={props[`new${firstCapField}`]} charLimit={props.charLimit}/>:(null)}
        </div>
      );
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
    
    this.charLimit = 400;

    this.createNote = this.createNote.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.displayNotes = this.displayNotes.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
    this.handleNewNote = this.handleNewNote.bind(this);
    this.editNote = this.editNote.bind(this);
    this.handleChangeNote = this.handleChangeNote.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.deleteNote = this.deleteNote.bind(this);

    this._toJSXNote = this._toJSXNote.bind(this);
    this._scrollToNote = this._scrollToNote.bind(this);

    let notes = {}
    for (let i = 0; i < defaultNotes.length; ++i)
      notes[i] = this.createNote(defaultNotes[i][0], defaultNotes[i][1], true, i);
    this.state = {
      "notes": notes,
      "totalNotesCounter": Object.keys(notes).length,
      "focusedNote": -1,
      "sortBy": "time",
      "searchString": "",
    };
  }

  createNote(title, text, justCreated, time) {
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
          handleChangeNote={this.handleChangeNote(key)}
          handleSubmit={this.handleSubmit(key)}
          handleCancel={this.handleCancel(key)}
          deleteNote={this.deleteNote(key)}
          charLimit={this.charLimit}
        />
      </div>
    );
  }

  changeOrder(value) {
    let fn = function (event) {
      this.setState({ "sortBy": value, "focusedNote": -1 });
    }
    return fn.bind(this);
  }

  displayNotes() {
    // comparison functions
    let byTime = (a, b) => { return b[1].time - a[1].time };
    let byTitle = (a, b) => { return (a[1].title.toLowerCase() < b[1].title.toLowerCase()) ? -1 : 1 }; // lexicographic compare

    let sortFn;
    switch (this.state.sortBy) {
      case "title": sortFn = byTitle; break;
      default: sortFn = byTime;
    }

    let arrNotes = Array.from(Object.entries(this.state.notes));
    arrNotes.sort(sortFn);

    // filter out notes that don't follow constraints
    let filteredNotes = arrNotes.filter(([_, note]) => {
      return note.title.toLowerCase().startsWith(this.state.searchString.toLowerCase());
    });

    return (
      <div className="NotesGrid">
        {filteredNotes.map(this._toJSXNote)}
      </div>
    );
  }

  handleChangeSearch(event) {
    this.setState({ "searchString": event.target.value });
  }

  handleNewNote(event) {
    this.setState((state) => {
      let note = this.createNote("", "", true, state.totalNotesCounter);
      let notes = state.notes;
      notes[state.totalNotesCounter] = note;
      return { "notes": notes, "totalNotesCounter": state.totalNotesCounter + 1, "focusedNote": state.totalNotesCounter, "searchString": "" };
    });
  }

  editNote(key) {
    let editNote = function (event) {
      this.setState((state) => {
        updateObject(state.notes[key], { "isTyping": true, "newTitle": state.notes[key].title, "newText": state.notes[key].text });
        return { "notes": state.notes, "focusedNote": key }
      });
    };
    return editNote.bind(this);
  }

  handleChangeNote(key) {
    let handleChangeNote = function (firstCapField) {
      let handleChangeNote = function (event) {
        this.setState((state) => {
          let value = event.target.value;
          if (firstCapField == "Title")
            value = value.replace("\n", "");
          updateObject(state.notes[key], { [`new${firstCapField}`]: value });
          return { "notes": state.notes, "focusedNote": key };
        });
      }
      return handleChangeNote.bind(this);
    }
    return handleChangeNote.bind(this);
  }

  handleSubmit(key) {
    let handleSubmit = function (event) {
      this.setState((state) => {
        let note = state.notes[key];
        if(note.newText.length > this.charLimit)
          return {};
        updateObject(note, { "isTyping": false, "text": note.newText, "title": note.newTitle, "justCreated": false });
        return { "notes": state.notes, "focusedNote": key };
      });
    };
    return handleSubmit.bind(this);
  }

  handleCancel(key) {
    let handleCancel = function (event) {
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
      if (window.confirm("Delete Note?"))
        delete this.state.notes[key];
      this.setState({ "notes": this.state.notes, "focusedNote": -1 });
    };
    return handleDelete.bind(this);
  }

  _scrollToNote() {
    if (this.state.focusedNote < 0) return;
    scroller.scrollTo(`Note ${this.state.focusedNote}`, { "smooth": true });
  }

  componentDidUpdate() {
    this._scrollToNote();
  }

  render() {
    return (
      <div className="App">
        <h1 className="Heading">NOTES</h1>
        <br />
        <button className="AddNoteOption" onClick={this.handleNewNote}> + Add Note </button>
        <textarea className="Search" value={this.state.searchString} onChange={this.handleChangeSearch}></textarea>
        <div className="SortOptions">
          Sort By:&nbsp;
          <button onClick={this.changeOrder("time")}> Time </button>
          <button onClick={this.changeOrder("title")}> Title </button>
        </div>
        <br /> <br /> <br /> <br />
        {this.displayNotes()}
      </div>
    );
  }
}

export default App;
