import React, { Component } from 'react';
import './style.css';

import makeid from '../../js/makeid';
import Line from './index';

class App extends Component {

  state = {
    pHeight: 0,
    text: this.props.children,
    newLines: []
  }

  componentDidMount(){
    this.setState({
      pHeight: this.refs._lineText.scrollHeight
    });

    window.addEventListener('resize', (event) => {
      this.handleChange();
    });

    if(this.props.focusOnRender){
      this.refs._lineText.focus();
      this.refs._lineText.selectionStart = 0;
      this.refs._lineText.selectionEnd = 0;
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
      let nextLineKey = makeid(5);
      let newLineArray = this.state.newLines;
      newLineArray.unshift({key: nextLineKey, text: nextLineText});

      this.setState({
        text: e.target.value.substr(0, selectionStart),
        newLines: newLineArray
      });

      setTimeout(() => {
        this.handleChange();
      }, 10);

      e.preventDefault();
      return false;
    }else if(e.keyCode == 8){
      let selectionStart = this.refs._lineText.selectionStart;
      let selectionEnd = this.refs._lineText.selectionEnd;
      if(selectionStart == 0 && selectionEnd == 0){
        this.props.onConcat(this.props.id, this.state.text);
        e.preventDefault();
        return false;
      }
    }
  }

  handleConcat(id, text){
    if(this.state.newLines.length == 0){
      this.props.onConcat(id, text);
    }else{
      let keyToRemove = id.split("-")[1];
      console.log("removing", keyToRemove);
    }
  }

  renderNewLines(){
    if(this.state.newLines.length){
      return this.state.newLines.map((nl, i) => {
        return (
          <Line
            key={this.props.id.split("-")[0]+ "-" + nl.key}
            id={this.props.id.split("-")[0]+ "-" + nl.key}
            onConcat={this.handleConcat.bind(this)}
            prevId={this.props.id}
            nextId={this.state.newLines[i + 1] ? this.props.id.split("-")[0] + "-" + this.state.newLines[i + 1].key : this.props.nextId}
            focusOnRender={true}>
            {nl.text}
          </Line>
        );
      });
    }else{
      return null;
    }
  }

  render() {
    return (
      <>
        <div className="Line">
        {this.props.prevId}   ( ~me~ {this.props.id})
          <textarea
            ref="_lineText"
            style={{height: this.state.pHeight}}
            value={this.state.text}
            wrap="soft"
            onKeyDown={(event) => this.handleKeyDown(event)}
            onChange={(event) => this.handleChange(event)}>
          </textarea>
          {this.props.nextId}
        </div>
        {this.renderNewLines()}
      </>
    );
  }
}

export default App;
