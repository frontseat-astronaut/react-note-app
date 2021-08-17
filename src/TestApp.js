import './App.css';
import React, {useState} from 'react';

let globalCnt = -1;
function GetCount(){
    console.log("First function called!");
    return useState(0); 
}
function GetCount1(){
    console.log("Second function called!");
    return useState('ok'); 
}
function TestApp(){
    globalCnt += 1;

    let x, changeX, updX;
    if(globalCnt%2==0)
    {
        [x, changeX] = GetCount();
        updX = () => {changeX(x+1);};
    }
    else 
    {
        [x, changeX] = GetCount1();
        updX = () => {changeX(x+'k');};

    }
    console.log(x);
    return (
        <div>
            Current x: {x}<br/>
            <button onClick={updX} >upd</button>
        </div>
    );
}
export default TestApp;

