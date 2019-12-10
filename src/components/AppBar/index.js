import React, { Component } from 'react';
import './style.css';

class App extends Component {

  render() {
    if(window && window.process && window.process.type) {
      if(this.props.spacer){
        return (<div className="AppTitleSpacer"></div>);
      }else {
        return (
          <div className={(window.process.platform === 'darwin') ? "AppTitle AppTitleOSX" : "AppTitle AppTitleOther"}>
            <img src={this.props.theme == "dark"?  require("../../assets/memo_logo_left_white.svg") : require("../../assets/memo_logo_left.svg")}/>
          </div>
        );
      }
    }else{
      return null;
    }
  }
}

export default App;
