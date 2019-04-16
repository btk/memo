import React, { Component } from 'react';
import './style.css';

import makeid from '../../js/makeid';
import Line from './index';

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
    if(e.keyCode == 13){
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
    }else if(e.keyCode == 8 && this.props.index !== 0){
      let selectionStart = this.refs._lineText.selectionStart;
      let selectionEnd = this.refs._lineText.selectionEnd;
      if(selectionStart == 0 && selectionEnd == 0){

        this.props.onConcat(this.props.id, this.state.text, this.props.index);
        e.preventDefault();
        return false;
      }
    }else if(e.keyCode == 39 || e.keyCode == 40){
      let selectionStart = this.refs._lineText.selectionStart;
      let selectionEnd = this.refs._lineText.selectionEnd;
      let textLength = this.state.text.length;

      if(selectionStart == textLength && selectionEnd == textLength){
        this.props.onCursor(e.keyCode, this.props.id, this.props.index);

        e.preventDefault();
        return false;
      }
    }else if(e.keyCode == 37 || e.keyCode == 38){
      let selectionStart = this.refs._lineText.selectionStart;
      let selectionEnd = this.refs._lineText.selectionEnd;

      if(selectionStart == 0 && selectionEnd == 0){
        this.props.onCursor(e.keyCode, this.props.id, this.props.index);

        e.preventDefault();
        return false;
      }
    }
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
