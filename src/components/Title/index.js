import React, { Component } from 'react';
import './style.css';

import API from '../../js/api';

class App extends Component {

  state = {
    text: this.props.children,
  }

  handleChange(e){
    if(e){
      this.setState({text: e.target.value});
      //.replace(/(\r\n|\n|\r)/gm,"")
    }
  }

  handleBlur(){
    let text = this.state.text;
    if(text != this.props.sheet.text){
      API.updateTitle(this.state.text, this.props.sheet.id);
    }
  }

  render() {
    return (
      <>
        <div className="Title">
          <input
            ref="_title"
            value={this.state.text}
            onBlur={() => this.handleBlur()}
            onChange={(event) => this.handleChange(event)}/>
        </div>
      </>
    );
  }
}

export default App;
