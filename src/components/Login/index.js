import React, { Component } from 'react';
import './style.css';

import API from '../../js/api';

let AUTH_URL = "https://github.com/login/oauth/authorize?client_id=d63ed284bfb2c8e7a5d4&scope=gist&redirect_uri=https://api.usememo.com/github/";

if(API.development){
  AUTH_URL += "?development=true";
}

let isRefresh = AUTH_URL.includes("?") ? "&refresh=true" : "?refresh=true";
let AUTH_URL_REFRESH = AUTH_URL + isRefresh;

class App extends Component {

  state = {
    loginButtonText: "Login with GitHub"
  }

  handleIframeLoad(e){
    let iframe = this.refs._authIframe;
    let isOnline = API.isOnline();
    if(iframe && isOnline){
      try{
        let iframeURL = (iframe.contentWindow||iframe.contentDocument).location.href;
        API.githubLogin();
      } catch(err){
        console.log(err);
        console.warn("User haven't given authorization to Memo app on GitHub yet!");
        API.event.emit("loginButton");
      }

    }
    if(!isOnline){
      API.offlineLogin();
    }
  }

  render() {
    return (
      <div className="Login">
        <a href={AUTH_URL}>
          <div className="loginWithGithub" onClick={() => this.setState({loginButtonText: "Just a second..."})}>
            <img src={require("../../icon/github.svg")} />
            <span>{this.state.loginButtonText}</span>
          </div>
        </a>
        <iframe src={AUTH_URL_REFRESH} ref="_authIframe" onLoad={(event) => this.handleIframeLoad(event)} className="githubIframe" frameBorder="0"></iframe>
      </div>
    );
  }
}

export default App;
