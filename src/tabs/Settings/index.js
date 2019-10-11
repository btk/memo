import React, { Component } from 'react';
import './style.css';
import API from "../../js/api"

import GoogleSignIn from './google';

class App extends Component {

  render() {
    return (
      <div className="SettingsTab">
        <h4>Settings</h4>
        <p className="sub">Manage your preferences and access your account information.</p>
        <h5>Preferences</h5>
        <h5>My Account</h5>
        <div onClick={() => API.event.emit("theme", "dark")}>Dark Theme</div>
        <div onClick={() => API.event.emit("theme", "light")}>Light Theme</div>
        <div>Login with google</div>
      </div>
    );
  }
}

export default App;
