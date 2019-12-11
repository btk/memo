import React, { Component } from 'react';
import './style.css';


class App extends Component {

  state = {
    maximized: false
  }

  renderWindowsButtons(){
    const remote = window.require('electron').remote;
    let win = remote.getCurrentWindow();
    return (
      <div id="window-controls">
        <div class="wbutton" id="min-button" onClick={() => win.minimize()}>
          <span>&#xE921;</span>
        </div>
        {!this.state.maximized &&
          <div class="wbutton" id="max-button" onClick={() => { this.setState({maximized: true}); win.maximize() }}>
            <span>&#xE922;</span>
          </div>
        }
        {this.state.maximized &&
          <div class="wbutton" id="restore-button" onClick={() => { this.setState({maximized: false}); win.unmaximize() }}>
            <span>&#xE923;</span>
          </div>
        }
        <div class="wbutton" id="close-button" onClick={() => win.close()}>
          <span>&#xE8BB;</span>
        </div>
      </div>
    );
  }

  render() {
    if(window && window.process && window.process.type) {
      if(this.props.spacer){
        return (<div className="AppTitleSpacer"></div>);
      }else {
        return (
          <div className={(window.process.platform === 'darwin') ? "AppTitle AppTitleOSX" : "AppTitle AppTitleOther"}>
            <img src={this.props.theme == "dark"?  require("../../assets/memo_logo_left_white.svg") : require("../../assets/memo_logo_left.svg")}/>
            {window.process.platform != 'darwin' && this.renderWindowsButtons()}
          </div>
        );
      }
    }else{
      return null;
    }
  }
}

export default App;
