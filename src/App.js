import React, { Component } from 'react';
import './App.css';

import Line from './components/Line';
import Title from './components/Title';
import Toolbar from './components/Toolbar';
import Handy from './components/Handy';
import Loading from './components/Loading';
import Cover from './components/Cover';

import makeid from './js/makeid';
//import writeGood from 'write-good';

import API from './js/api';

//let sheet = require("./sheet.json");

class App extends Component {

  state = {
    lines: "",
    focusIndex: 0,
    cursorPosition: 0,
    logged: false,
    theme: API.getData("theme") || "light"
  };

  componentDidMount(){

    setTimeout(() => {
      API.githubLogin();
    }, 1000);

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

    API.event.on("theme", (type) => {
      API.setData("theme", type);
      this.setState({theme: type});
      console.log("type", type)
    })

    API.event.on("sheet", (id) => {
      API.getSheet(id).then((sheet) => {
        if(sheet == "NO_AUTH"){
          console.log("NO_AUTH, retrying initiation");
          API.login("refresh", id);
        }else{
          document.title = sheet.title + " | Memo";
          this.setState({
            lines: sheet.lines,
            sheet: {
              id: sheet.id,
              title: sheet.title
            }
          });
        }
      });
      API.event.emit("toggle", false);
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

    if(i == 0 && (direction == 37 || direction == 38)){
      newIndex = "title";
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
      //console.log(writeGood(text));
      this.setState({lines, focusIndex: null});
    }
  }

  handleTitleDown(){
    this.setState({focusIndex: 0, cursorPosition: 0});
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
            onClick={() => this.setState({focusIndex: i})}
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

  renderApp(){
    if(this.state.logged){
      return(
        <div className="AppHolder">
          <div className="Note" key={this.state.logged}>
            <Handy/>
            <div className="Content">
              {this.state.sheet &&
                <Title
                  shouldFocused={this.state.focusIndex == "title"}
                  key={this.state.sheet.id}
                  onTitleDown={this.handleTitleDown.bind(this)}
                  sheet={this.state.sheet}>
                  {this.state.sheet.title}
                </Title>
              }
              {this.state.sheet && this.renderLines(this.state.lines)}
              <div className="spacer" onClick={() => this.focusLast()}></div>
              <div id="trash">
                <textarea id="trashTextarea"></textarea>
              </div>
            </div>
            <Toolbar/>
          </div>
        </div>
      );
    }else{
      return (
        <div>
          <Loading quote={true}>
            <a href="https://github.com/login/oauth/authorize?client_id=d63ed284bfb2c8e7a5d4&scope=gist&redirect_uri=https://api.usememo.com/github.php">
              Login with github
            </a>
          </Loading>
        </div>
      );
    }
  }

  render() {
    return (
      <div className={`App${this.state.theme == "dark" ? " darkmode": ""}`}>
        <div className="AppTitle"></div>
        {this.renderApp()}
      </div>
    );
  }
}

export default App;
