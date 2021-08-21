import './App.css';
import React, {useState} from 'react';

// let globalCnt = -1;
// function GetCount(){
//     console.log("First function called!");
//     return useState(0); 
// }
// function GetCount1(){
//     console.log("Second function called!");
//     return useState('ok'); 
// }
// function TestApp(){
//     globalCnt += 1;

//     let x, changeX, updX;
//     if(globalCnt%2==0)
//     {
//         [x, changeX] = GetCount();
//         updX = () => {changeX(x+1);};
//     }
//     else 
//     {
//         [x, changeX] = GetCount1();
//         updX = () => {changeX(x+'k');};

//     }
//     console.log(x);
//     return (
//         <div>
//             Current x: {x}<br/>
//             <button onClick={updX} >upd</button>
//         </div>
//     );
// }

function Note(props){
    const [note, changeNote] = useState(`Note ${props.num}`);
    console.log(note);
    let editNote = ()=>changeNote(note + ".");
    return (
        <div>
            {note}
            <button onClick={editNote}>Edit</button>
        </div>
    );
}
function TestApp(){
    console.log(`Running root`);
    const [noteIndices, changeNotes] = useState([]);
    const [noteCount, changeNoteCnt] = useState(0);
    let addNote = ()=>{
        changeNoteCnt(noteCount+1);
        changeNotes([...noteIndices, noteCount]);
    };
    let delNote = ()=>{
        changeNotes(noteIndices.slice(1));
    };
    let notes = noteIndices.map((i)=>(<Note num={i}/>));
    return (
        <div>
            <button onClick={addNote}>+Add Note</button>
            <button onClick={delNote}>-Delete Note</button>
            {notes}
        </div>
    );
}

export default TestApp;

