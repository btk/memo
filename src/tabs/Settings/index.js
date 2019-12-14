import React, { Component } from 'react';
import './style.css';
import API from "../../js/api"

class App extends Component {

  state = {
    theme: API.getTheme()
  }

  changeTheme(changeTo){
    this.setState({theme: changeTo})
    API.event.emit("theme", changeTo);
  }

  render() {
    return (
      <div className="TabCarrier SettingsTab">
        <h4>Settings</h4>
        <p className="sub">Manage your preferences and access your account information.</p>
        <h5>Preferences</h5>
        <div className="prefItem theme">
          <div onClick={() => this.changeTheme("dark")} className={this.state.theme == "dark" ? "darkTheme themeActive" : "darkTheme"}>
            <div className="themeScreen">
              <img src={require("../../assets/memo_logo_left_white.svg")}/>
              <div className="themeScreenElement"></div>
            </div>
          </div>
          <div onClick={() => this.changeTheme("light")} className={this.state.theme == "light" ? "lightTheme themeActive" : "lightTheme"}>
            <div className="themeScreen">
              <img src={require("../../assets/memo_logo_left.svg")}/>
              <div className="themeScreenElement"></div>
            </div>
          </div>
        </div>
        <h5>My Account</h5>
        <div onClick={() => API.githubLogout()}>LOGOUT</div>
      </div>
    );
  }
}

export default App;
