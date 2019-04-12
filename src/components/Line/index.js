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
      this.refs._lineText.focus();
      this.refs._lineText.selectionStart = this.props.cursorPosition;
      this.refs._lineText.selectionEnd = this.props.cursorPosition;
      setTimeout(() => {
        this.handleChange();
      }, 10);
    }
  }

  getHeight(text){
    let tArea = document.getElementById("trashTextarea");
    tArea.value = text;
    return tArea.scrollHeight;
  }

  handleChange(e){
    if(e){
      this.setState({text: e.target.value.replace(/(\r\n|\n|\r)/gm,"")});
    }
    let renderedHeight = this.getHeight(this.refs._lineText.value);
    //console.log(renderedHeight);
    if(renderedHeight != this.state.pHeight){
      this.setState({pHeight: renderedHeight});
    }
  }

  handleKeyDown(e){
    if(e.keyCode == 13){
      let selectionStart = this.refs._lineText.selectionStart;
      let selectionEnd = this.refs._lineText.selectionEnd;

      let nextLineText = e.target.value.substr(selectionEnd);

      this.setState({
        text: e.target.value.substr(0, selectionStart)
      });

      this.props.onSplit(this.props.id, nextLineText, this.props.index);

      setTimeout(() => {
        this.handleChange();
      }, 10);

      e.preventDefault();
      return false;
    }else if(e.keyCode == 8 && this.props.index !== 0){
      let selectionStart = this.refs._lineText.selectionStart;
      let selectionEnd = this.refs._lineText.selectionEnd;
      if(selectionStart == 0 && selectionEnd == 0){

        this.props.onConcat(this.props.id, this.state.text, this.props.index);
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
            onBlur={() => this.props.onBlur(this.state.text, this.props.index)}
            onKeyDown={(event) => this.handleKeyDown(event)}
            onChange={(event) => this.handleChange(event)}>
          </textarea>
        </div>
      </>
    );
  }
}

export default App;
