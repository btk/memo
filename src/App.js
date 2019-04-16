import React, { Component } from 'react';
import './App.css';

import Line from './components/Line';
import Toolbar from './components/Toolbar';
import Handy from './components/Handy';

import makeid from './js/makeid';
import API from './js/api';

//let sheet = require("./sheet.json");

class App extends Component {

  state = {
    lines: "",
    focusIndex: 0,
    cursorPosition: 0,
    logged: false
  };

  componentDidMount(){
    API.renderLogin();

    window.addEventListener("keydown", (e) => {
      if (e.keyCode === 114 || ((e.ctrlKey || e.metaKey) && e.keyCode === 70)) {
        API.event.emit("toggle", "search");
        e.preventDefault();
      }else if ((e.ctrlKey || e.metaKey) && e.keyCode === 188) {
        API.event.emit("toggle", "settings");
        e.preventDefault();
      }else if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
        API.event.emit("toggle", "sheets");
        e.preventDefault();
      }else if ((e.ctrlKey || e.metaKey) && e.keyCode === 85) {
        API.event.emit("toggle", "archives");
        e.preventDefault();
      }else if ((e.ctrlKey || e.metaKey) && e.keyCode === 69) {
        API.event.emit("toggle", "addons");
        e.preventDefault();
      }else if(e.keyCode === 27){
        API.event.emit("toggle", false);
        e.preventDefault();
      }
    })

    API.event.on("login", (status) => {
      this.setState({logged: status});
    })

    API.event.on("sheet", (id) => {
      API.getSheet(id).then((sheet) => {
        this.setState({
          lines: sheet.lines,
          sheet: {
            id: sheet.id,
            title: sheet.title
          }
        });
      });
      API.event.emit("toggle", false);
    })

    API.event.emit("sheet", 1);
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
    }else{
      return "";
    }
  }

  handleConcat(id, text, i){
    let lines = this.state.lines;
    let cursorPosition = 0;
    if(lines[i-1]){
      API.updateLine(id, i, "", "rm");
      cursorPosition = lines[i-1].text.length;
      lines[i-1].text = lines[i-1].text + text;
      lines[i-1].old_key = lines[i-1].line_key;
      lines[i-1].line_key = makeid(5);
    }
    lines.splice(i, 1);
    this.setState({focusIndex: i-1, cursorPosition, lines});
  }

  handleSplit(id, text, i){
    let keyToSplit = id.split("-")[1];
    let lines = this.state.lines;
    let date = id.split("-")[0].split("!")[1];

    if(lines.length == i+1){
      let today = new Date();
      today = String(today.getDate()).padStart(2, '0') + "/" + String(today.getMonth() + 1).padStart(2, '0') + "/" + today.getFullYear();
      date = today
    }

    let newLineKey = makeid(5);
    lines.splice(i+1, 0, {
      "line_key": newLineKey,
      date,
      text
    });
    this.setState({focusIndex: i+1, cursorPosition: 0, lines});
    API.updateLine(id.split("!")[0]+"!"+date+"-"+newLineKey, i+1, text);
  }

  handleCursor(direction, id, i){
    let newIndex = 0;
    let cursorPosition = 0;
    if(direction == 37 || direction == 38){
      newIndex = i-1;
    }else if(direction == 39 || direction == 40){
      newIndex = i+1;
    }

    if(direction == 37 || ((direction == 40 || direction == 38) && false)){
      cursorPosition = "end";
    }

    this.setState({focusIndex: newIndex, cursorPosition});
  }

  handleBlur(text, lineId, i){
    let lines = this.state.lines;
    if(lines[i].text != text || text == "" || lines[i].old_key){
      if(lines[i].old_key){
        API.updateLine(lineId, i, text, "key", lines[i].old_key);
        lines[i].old_key = "";
      }else{
        API.updateLine(lineId, i, text);
      }
      lines[i].text = text;
      this.setState({lines});
    }

  }

  focusLast(){
    this.setState({focusIndex: this.state.lines.length - 1, cursorPosition: "end"});
  }

  renderLines(lines){
    let lineArray = [];
    let prevDate = "";

    lines.forEach((l, i) => {
      if(prevDate !== l.date){
        lineArray.push(
          <div
            className="Identifier"
            key={this.state.sheet.id + "-" + l.date}
            dangerouslySetInnerHTML={{__html: `${l.date} ${this.getDateIdentifier(l.date)}`}}>
          </div>
        );
        prevDate = l.date;
      }

      lineArray.push(
        <Line
          key={this.state.sheet.id + "!" + l.date + "-" + l.line_key}
          id={this.state.sheet.id + "!" + l.date + "-" + l.line_key}
          index={i}
          prevId={lines[i - 1]? this.state.sheet.id + "!" + l.date + "-" + lines[i - 1].line_key : ""}
          nextId={lines[i + 1]? this.state.sheet.id + "!" + l.date + "-" + lines[i + 1].line_key : ""}
          onConcat={this.handleConcat.bind(this)}
          onSplit={this.handleSplit.bind(this)}
          onBlur={this.handleBlur.bind(this)}
          onCursor={this.handleCursor.bind(this)}
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
        <div className="Note" key={this.state.logged}>
        {this.state.sheet && <h3 className="title">{this.state.sheet.title}</h3>}
          {this.state.lines.length && this.renderLines(this.state.lines)}
          <Handy/>
          <div className="spacer" onClick={() => this.focusLast()}></div>
          <div id="my-signin2"></div>
          <div id="trash">
            <textarea id="trashTextarea"></textarea>
          </div>
        </div>
        <Toolbar/>
      </div>
    );
  }
}

export default App;
