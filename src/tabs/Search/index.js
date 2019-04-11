import React, { Component } from 'react';
import './style.css';

class App extends Component {

  componentDidMount(){
    this.refs._searchInput.focus();
  }

  render() {
    return (
      <div className="SearchTab">
        <input ref="_searchInput" placeholder="Search in your notes..."/>
        <div className="SearchResults">
          This is your results
        </div>
      </div>
    );
  }
}

export default App;
