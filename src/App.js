import React, { Component } from 'react';
import './App.css';

import Line from './components/Line';
import Toolbar from './components/Toolbar';

import makeid from './js/makeid';
import Event from './js/event';

let sheet = require("./sheet.json");

class App extends Component {

  componentDidMount(){
    window.addEventListener("keydown", (e) => {
      if (e.keyCode === 114 || ((e.ctrlKey || e.metaKey) && e.keyCode === 70)) {
        Event.emit("toggle", "search");
        e.preventDefault();
      }else if(e.keyCode === 27){
        Event.emit("toggle", false);
        e.preventDefault();
      }
    })
  }

  getDateIdentifier(date){
    let today = new Date();
    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    today = String(today.getDate()).padStart(2, '0') + "/" + String(today.getMonth() + 1).padStart(2, '0') + "/" + today.getFullYear();
    yesterday = String(yesterday.getDate()).padStart(2, '0') + "/" + String(yesterday.getMonth() + 1).padStart(2, '0') + "/" + yesterday.getFullYear();

    if(date == today) {
      return "&middot; Today";
    }else if(date == yesterday){
      return "&middot; Yesterday"
    }
  }

  handleConcat(id, text){
    let keyToRemove = id.split("-")[1];
    console.log("removing", keyToRemove);
  }

  renderLines(){
    let dates = [];

    sheet.lines.forEach(l => {
      if(!dates.includes(l.date)){
        dates.push(l.date);
      }
    });

    let lineArray = [];

    dates.forEach(date => {
      lineArray.push(
        <div
          className="Identifier"
          key={sheet.id + "-" + date}
          dangerouslySetInnerHTML={{__html: `${date} ${this.getDateIdentifier(date)}`}}>
        </div>
      );

      let linesByDate = sheet.lines.filter(l => {
        return l.date == date
      });

      linesByDate.forEach((l, i) => {
        lineArray.push(
          <Line
            key={sheet.id + "!" + date + "-" + l.key}
            id={sheet.id + "!" + date + "-" + l.key}
            prevId={linesByDate[i - 1]? sheet.id + "!" + date + "-" + linesByDate[i - 1].key : ""}
            nextId={linesByDate[i + 1]? sheet.id + "!" + date + "-" + linesByDate[i + 1].key : ""}
            onConcat={this.handleConcat.bind(this)}>
            {l.text}
          </Line>
        );
      });
    })

    return lineArray;
  }

  render() {
    return (
      <div className="App">
        <div className="Note">
          {this.renderLines()}
        </div>
        <Toolbar/>
        <div id="trash">
          <textarea id="trashTextarea"></textarea>
        </div>
      </div>
    );
  }
}

export default App;
