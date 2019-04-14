import React, { Component } from 'react';

import API from "../../js/api"

class GoogleSignIn extends React.Component {
  componentDidMount() {
    window.gapi.signin2.render(
      this.props.id,
      {
        width: 200,
        height: 50,
        onsuccess: this.onSuccess,
      },
    );
  }

  onSuccess(googleUser) {
    var profile = googleUser.getBasicProfile();
    if(!API.logged){
      API.login({
        id: profile.getId(),
        email: profile.getEmail(),
        name: profile.getName(),
        avatar: profile.getImageUrl()
      });
    }
  }

  render() {
    return (
      <div id={this.props.id}/>
    );
  }
}
export default GoogleSignIn;
