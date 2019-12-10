import React, { Component } from 'react';
import './style.css';

class App extends Component {

  render() {
    return (
      <>
        <div className="AppTitle">
          <img src={this.props.theme == "dark"?  require("../../assets/memo_logo_left_white.svg") : require("../../assets/memo_logo_left.svg")}/>
        </div>
      </>
    );
  }
}

export default App;
