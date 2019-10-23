import React, { Component } from 'react';
import './style.css';
import API from '../../js/api';

import Notes from '../../addons/notes/';
import Calculator from '../../addons/calculator/';
import Conversion from '../../addons/conversion/';
import WriteGood from '../../addons/write-good/';
import Links from '../../addons/links/';

class App extends Component {
  state = {
    text: ""
  }

  render() {
    return (
      <>
        <div className="Handy">
          <div className="HandyFixed"></div>
          <div className="HandyInner">
            <Notes />
            <WriteGood />
            <Conversion />
            <Calculator />
            <Links />

          </div>
        </div>
      </>
    );
  }
}

export default App;
