import React, { Component } from 'react';
import './App.css';
import API from './js/api';

import Loading from './components/Loading';

import Note from './view/Note';
import Growth from './view/Growth';
//import Growth from './view/Note';

class App extends Component {

  state = {
    logged: false
  };

  componentDidMount(){
    API.renderLogin();

    API.event.on("login", (status) => {
      this.setState({logged: status});
    })

  }

  renderApp(){
    if(this.state.logged){
      return(
        <Growth/>
      );
    }else{
      return (
        <div>
          <div id="my-signin2"></div>
          <Loading quote={true}/>
        </div>
      );
    }
  }

  render() {
    return (
      <div className="App">
        <div className="AppTitle"></div>
        {this.renderApp()}
      </div>
    );
  }
}

export default App;
