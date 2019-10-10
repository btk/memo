import React, { Component } from 'react';
import './style.css';

import API from '../../js/api';
import makeid from '../../js/makeid';

class App extends Component {

  state = {
    pHeight: 0,
    text: this.props.children,
  }

  componentDidMount(){
    this.setState({
      pHeight: this.refs._lineText.scrollHeight
    });

    console.log("componentDidMount");

    window.addEventListener('resize', (event) => {
      this.handleChange();
    });

    if(this.props.focusOnRender){
      let lineText = this.refs._lineText;
      let cursorPosition = this.props.cursorPosition == "end" ? this.state.text.length : this.props.cursorPosition;
      lineText.focus();
      lineText.selectionStart = cursorPosition;
      lineText.selectionEnd = cursorPosition;
    }
  }

  componentWillReceiveProps(newProps){
    if(newProps.focusOnRender){
      let lineText = this.refs._lineText;
      let cursorPosition = newProps.cursorPosition == "end" ? this.state.text.length : newProps.cursorPosition;
      lineText.focus();
      lineText.selectionStart = cursorPosition;
      lineText.selectionEnd = cursorPosition;
    }
  }

  getHeight(text){
    let tArea = document.getElementById("trashTextarea");
    tArea.value = text;
    return tArea.scrollHeight;
  }

  handleChange(e){
    if(e){
      this.setState({text: e.target.value});
      API.event.emit("lineChanged", e.target.value);
      //.replace(/(\r\n|\n|\r)/gm,"")
    }
    if(this.refs._lineText){
      let renderedHeight = this.getHeight(this.refs._lineText.value);
      //console.log(renderedHeight);
      if(renderedHeight != this.state.pHeight){
        this.setState({pHeight: renderedHeight});
      }
    }
  }

  handleKeyDown(e){
    if(e.keyCode == 13){ // 13 = "\n"
      let selectionStart = this.refs._lineText.selectionStart;
      let selectionEnd = this.refs._lineText.selectionEnd;

      let ordinarySplit = e.target.value.substr(selectionStart-1, 1) == "\n";
      let extraOrdinarySplit = e.target.value.substr(selectionStart, 1) == "\n";
      if(ordinarySplit || extraOrdinarySplit){
        let nextLineText = e.target.value.substr(selectionEnd);

        if(ordinarySplit){
          this.setState({
            text: e.target.value.substr(0, selectionStart - 1)
          });
          this.props.onSplit(this.props.id, nextLineText, this.props.index);
        }else if(extraOrdinarySplit){
          this.setState({
            text: e.target.value.substr(0, selectionStart)
          });
          this.props.onSplit(this.props.id, nextLineText.substr(1), this.props.index);
        }

        setTimeout(() => {
          this.handleChange();
        }, 10);

        e.preventDefault();
        return false;
      }

      if(e.target.value == ""){
        this.props.onSplit(this.props.id, "", this.props.index);

        e.preventDefault();
        return false;
      }

      let newItemTest = e.target.value.substr(0, selectionStart).split("\n").pop();
      let rightOfCursor = e.target.value.substr(selectionStart).split("\n").slice(0, 1)[0];
      if(newItemTest.substr(0, 3) == "\t- " && newItemTest != "\t- "){
        let textString = e.target.value;
        let tailText = textString.substr(selectionEnd);
        if(tailText.substr(0, 1) == " "){
          // Space after the dash should merge
          tailText = tailText.substr(1);
        }

        this.setState({text: textString.substr(0, selectionStart) + '\n\t- ' + tailText});
        setTimeout(() => {
          this.refs._lineText.selectionStart = selectionStart + 4;
          this.refs._lineText.selectionEnd = selectionStart + 4;
          this.handleChange();
        }, 10);

        e.preventDefault();
        return false;
      }else if(newItemTest == "\t- " && rightOfCursor == ""){

        let textString = e.target.value;
        this.setState({text: textString.substr(0, selectionStart - 4) + textString.substr(selectionEnd)});
        setTimeout(() => {
          this.refs._lineText.selectionStart = selectionStart - 3;
          this.refs._lineText.selectionEnd = selectionStart - 3;
          this.handleChange();
        }, 10);
      }else if(newItemTest == "\t- " && rightOfCursor){

        let textString = e.target.value;
        this.setState({text: textString.substr(0, selectionStart - 3) + textString.substr(selectionEnd)});
        setTimeout(() => {
          this.refs._lineText.selectionStart = selectionStart - 3;
          this.refs._lineText.selectionEnd = selectionStart - 3;
          this.handleChange();
        }, 10);

        e.preventDefault();
        return false;
      }

    }else if(e.keyCode == 8){
      let selectionStart = this.refs._lineText.selectionStart;
      let selectionEnd = this.refs._lineText.selectionEnd;
      if(selectionStart == 0 && selectionEnd == 0 && this.props.index !== 0){

        this.props.onConcat(this.props.id, this.state.text, this.props.index);
        e.preventDefault();
        return false;
      }else{
        let prevText = this.state.text.substr(selectionStart - 3, 3);
        if(prevText == "\t- "){
          let textString = this.state.text;

          this.setState({text: textString.substr(0, selectionStart - 4) + textString.substr(selectionEnd)});
          setTimeout(() => {
            this.refs._lineText.selectionStart = selectionStart - 4;
            this.refs._lineText.selectionEnd = selectionStart - 4;
            this.handleChange();
          }, 10);

          e.preventDefault();
          return false;
        }
      }
    }else if(e.keyCode == 39 || e.keyCode == 40){ // 37 38 = "down" "right"
      let selectionStart = this.refs._lineText.selectionStart;
      let selectionEnd = this.refs._lineText.selectionEnd;
      let textLength = this.state.text.length;

      if(selectionStart == textLength && selectionEnd == textLength){
        this.props.onCursor(e.keyCode, this.props.id, this.props.index);

        e.preventDefault();
        return false;
      }
    }else if(e.keyCode == 37 || e.keyCode == 38){ // 37 38 = "up" "left"
      let selectionStart = this.refs._lineText.selectionStart;
      let selectionEnd = this.refs._lineText.selectionEnd;

      if(selectionStart == 0 && selectionEnd == 0){
        this.props.onCursor(e.keyCode, this.props.id, this.props.index);

        e.preventDefault();
        return false;
      }
    }else if(e.keyCode == 9){ // 0 == "\t"
      let selectionStart = this.refs._lineText.selectionStart;
      let selectionEnd = this.refs._lineText.selectionEnd;
      let textString = this.state.text;
      textString = textString.substr(0, selectionStart) + '\t' + textString.substr(selectionEnd);
      this.setState({text: textString});

      setTimeout(() => {
        this.refs._lineText.selectionStart = selectionStart + 1;
        this.refs._lineText.selectionEnd = selectionStart + 1;
      }, 10);

      e.preventDefault();
      return false;

    }else if(e.keyCode == 189){ // 189 = "-"
      let selectionStart = this.refs._lineText.selectionStart;
      let selectionEnd = this.refs._lineText.selectionEnd;
      let textString = this.state.text;
      let prevText = this.state.text.substr(selectionStart - 1, 1);

      if(prevText === '\n' || selectionStart === 0){
        let tailText = textString.substr(selectionEnd);
        if(tailText.substr(0, 1) == " "){
          // Space after the dash should merge
          tailText = tailText.substr(1);
        }
        this.setState({text: textString.substr(0, selectionStart) + '\t- ' + tailText});
        setTimeout(() => {
          this.refs._lineText.selectionStart = selectionStart + 3;
          this.refs._lineText.selectionEnd = selectionStart + 3;
        }, 10);
        e.preventDefault();
        return false;
      }
    }else if(e.keyCode == 32){ // 32 = " "
      // Space after the dash should merge
      let selectionStart = this.refs._lineText.selectionStart;
      let selectionEnd = this.refs._lineText.selectionEnd;
      let prevText = this.state.text.substr(selectionStart - 2, 2);

      if(prevText === '- '){
        e.preventDefault();
        return false;
      }
    }
  }

  forceHandyBar(){
    API.event.emit("lineFocused", {text: this.state.text, lineId: this.props.id, index: this.props.index});
  }

  render() {
    return (
      <>
        <div className="Line">
          <textarea
            ref="_lineText"
            style={{height: this.state.pHeight}}
            value={this.state.text}
            wrap="soft"
            onFocus={() => this.forceHandyBar()}
            onBlur={() => this.props.onBlur(this.state.text, this.props.id, this.props.index)}
            onKeyDown={(event) => this.handleKeyDown(event)}
            onChange={(event) => this.handleChange(event)}>
          </textarea>
        </div>
      </>
    );
  }
}

export default App;
