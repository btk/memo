import React, { Component } from 'react';
import './style.css';
import API from '../../js/api';

import writeGood from "write-good";

import WriteGood from '../../addons/write-good/';
import Calculator from '../../addons/calculator/';
import Conversion from '../../addons/conversion/';
import Links from '../../addons/links/';

let cog = require("../../icon/icon-cog.svg");

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
            <div className="InfoItem">
              <img className="InfoConfigure" src={cog} width={16} height={16}/>
              <h5>Notes</h5>
              <p>This paragraph might be asked in the midterm exam.</p>
              <div className="colorCode">
                <div className="colorNode yellow">
                  <div className="colorInner"></div>
                </div>
                <div className="colorNode green">
                  <div className="colorInner"></div>
                </div>
                <div className="colorNode blue">
                  <div className="colorInner"></div>
                </div>
                <div className="colorNode pink">
                  <div className="colorInner"></div>
                </div>
                <div className="colorNode purple">
                  <div className="colorInner"></div>
                </div>
                <div className="colorNode white active">
                  <div className="colorInner"></div>
                </div>
              </div>
            </div>

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
