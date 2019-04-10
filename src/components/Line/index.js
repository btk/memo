import React, { Component } from 'react';
import './style.css';

class App extends Component {

  state = {
    pHeight: 0,
    text: this.props.children
  }

  componentDidMount(){
    this.setState({
      pHeight: this.refs._lineText.scrollHeight
    });

    window.addEventListener('resize', (event) => {
      this.handleChange();
    });

  }

  getHeight(text){
    let tArea = document.getElementById("trashTextarea");
    tArea.value = text;
    return tArea.scrollHeight;
  }

  handleChange(e){
    if(e){
      this.setState({text: e.target.value});
    }
    let renderedHeight = this.getHeight(this.refs._lineText.value);
    //console.log(renderedHeight);
    if(renderedHeight != this.state.pHeight){
      this.setState({pHeight: renderedHeight});
    }
  }

  render() {
    return (
      <div className="Line">
        <textarea
          ref="_lineText"
          style={{height: this.state.pHeight}}
          value={this.state.text}
          wrap="soft"
          onChange={(event) => this.handleChange(event)}>
        </textarea>
      </div>
    );
  }
}

export default App;
