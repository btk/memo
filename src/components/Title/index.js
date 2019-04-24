import React, { Component } from 'react';
import './style.css';

import API from '../../js/api';

class App extends Component {

  state = {
    text: this.props.children,
  }

  componentDidMount(){
    if(this.state.text == "Untitled Sheet"){
      setTimeout(() => {
        this.refs._title.focus();
      },10);
    }
  }

  componentWillReceiveProps(newProps){
    if(this.props.shouldFocused != newProps.shouldFocused && newProps.shouldFocused){
      setTimeout(() => {
        this.refs._title.focus();
      },10);
    }
  }

  handleChange(e){
    if(e){
      this.setState({text: e.target.value});
      //.replace(/(\r\n|\n|\r)/gm,"")
    }
  }

  handleBlur(){
    let text = this.state.text;
    if(text != this.props.sheet.title){
      if(!text){
        text = "Untitled Sheet";
      }
      API.updateTitle(text, this.props.sheet.id);
    }
  }

  handleKeyDown(e){
    let selectionStart = this.refs._title.selectionStart;
    let selectionEnd = this.refs._title.selectionEnd;

    if(e.keyCode == 13 || (selectionStart == selectionStart && e.keyCode == 39 && selectionStart == this.state.text.length) || e.keyCode == 40){
      this.props.onTitleDown();
      e.preventDefault();
      return false;
    }
  }

  remove(){
    API.removeSheet(this.props.sheet.id);
    alert("Removed");
    API.event.emit("sheet", "LAST_ACCESSED");
  }

  render() {
    return (
      <>
        <div className="Title">
          <input
            ref="_title"
            placeholder={"Untitled Sheet"}
            value={this.state.text == "Untitled Sheet" ? "" : this.state.text}
            onKeyDown={(event) => this.handleKeyDown(event)}
            onBlur={() => this.handleBlur()}
            onChange={(event) => this.handleChange(event)}/>
            <img src={require("../../icon/icon-minus-circle.svg")} onClick={() => this.remove()}/>
        </div>
      </>
    );
  }
}

export default App;
