import React, { Component } from 'react';
import './style.css';
import API from "../../js/api"

class App extends Component {

  render() {
    return (
      <div className="TabCarrier SettingsTab">
        <h4>Settings</h4>
        <p className="sub">Manage your preferences and access your account information.</p>
        <h5>Preferences</h5>
        <h5>My Account</h5>
        <div onClick={() => API.event.emit("theme", "dark")}>Dark Theme</div>
        <div onClick={() => API.event.emit("theme", "light")}>Light Theme</div>
        <div onClick={() => API.githubLogout()}>LOGOUT</div>
      </div>
    );
  }
}

export default App;
