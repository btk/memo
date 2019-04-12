import React, { Component } from 'react';
import './App.css';

import Line from './components/Line';
import Toolbar from './components/Toolbar';

import makeid from './js/makeid';
import Event from './js/event';

let sheet = require("./sheet.json");

class App extends Component {

  state = {
    lines: sheet.lines,
    focusIndex: 0,
    cursorPosition: 0
  };

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

  handleConcat(id, text, i){
    let keyToRemove = id.split("-")[1];
    let lines = this.state.lines;
    let cursorPosition = 0;
    if(lines[i-1]){
      cursorPosition = lines[i-1].text.length;
      lines[i-1].text = lines[i-1].text + text;
      lines[i-1].key = makeid(5);
    }
    lines.splice(i, 1);
    this.setState({focusIndex: i-1, cursorPosition, lines});
  }

  handleSplit(id, text, i){
    let keyToSplit = id.split("-")[1];
    let lines = this.state.lines;
    lines.splice(i+1, 0, {
      "key": makeid(5),
      "date": id.split("-")[0].split("!")[1],
      text
    });
    this.setState({focusIndex: i+1, cursorPosition: 0, lines});
  }

  handleBlur(text, i){
    let lines = this.state.lines;
    if(lines[i].text != text){
      lines[i].text = text;
      this.setState({lines});
    }
  }

  renderLines(lines){
    let lineArray = [];
    let prevDate = "";

    lines.forEach((l, i) => {
      if(prevDate !== l.date){
        lineArray.push(
          <div
            className="Identifier"
            key={sheet.id + "-" + l.date}
            dangerouslySetInnerHTML={{__html: `${l.date} ${this.getDateIdentifier(l.date)}`}}>
          </div>
        );
        prevDate = l.date;
      }

      lineArray.push(
        <Line
          key={sheet.id + "!" + l.date + "-" + l.key}
          id={sheet.id + "!" + l.date + "-" + l.key}
          index={i}
          prevId={lines[i - 1]? sheet.id + "!" + l.date + "-" + lines[i - 1].key : ""}
          nextId={lines[i + 1]? sheet.id + "!" + l.date + "-" + lines[i + 1].key : ""}
          onConcat={this.handleConcat.bind(this)}
          onSplit={this.handleSplit.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          cursorPosition={i == this.state.focusIndex ? this.state.cursorPosition : false}
          focusOnRender={i == this.state.focusIndex}>
          {l.text}
        </Line>
      );
    });

    return lineArray;
  }

  render() {
    return (
      <div className="App">
        <div className="Note">
          {this.renderLines(this.state.lines)}
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
