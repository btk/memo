import React, { Component } from 'react';
import './style.css';

import API from '../../js/api';

const AUTH_URL = "https://github.com/login/oauth/authorize?client_id=d63ed284bfb2c8e7a5d4&scope=gist&redirect_uri=https://api.usememo.com/github/";

class App extends Component {

  state = {
    loginButtonText: "Login with GitHub"
  }

  componentDidMount(){
    API.githubLogin();
  }

  handleIframeLoad(e){
    let iframe = this.refs._authIframe;
    if(iframe){
      try{
        let iframeURL = (iframe.contentWindow||iframe.contentDocument).location.href;
        API.githubLogin();
      } catch(err){
        console.warn("User haven't given authorization to Memo app on GitHub yet!");
        API.event.emit("loginButton");
      }

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
        <iframe src={AUTH_URL} ref="_authIframe" onLoad={(event) => this.handleIframeLoad(event)} className="githubIframe" frameBorder="0"></iframe>
      </div>
    );
  }
}

export default App;
