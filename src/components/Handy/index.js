import React, { Component } from 'react';
import './style.css';
import Event from '../../js/event';

let cog = require("../../icon/icon-cog.svg");

class App extends Component {

  render() {
    return (
      <>
        <div className="Handy">
          <div className="HandyInner">
            <div className="InfoItem">
              <img className="InfoConfigure" src={cog} width={16} height={16}/>
              <h5>Conversions</h5>
              <p>20 USD = 115,55 TRY</p>
            </div>
            <div className="InfoItem">
              <img className="InfoConfigure" src={cog} width={16} height={16}/>
              <h5>Calculator</h5>
              <p>X = 3423,12</p>
            </div>
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
            <div className="InfoItem">
              <img className="InfoConfigure" src={cog} width={16} height={16}/>
              <h5>Write-Good</h5>
              <p>Use forceful adjectives instead of passive.</p>
            </div>
            <div className="InfoItem">
              <img className="InfoConfigure" src={cog} width={16} height={16}/>
              <h5>Sources</h5>
              <p>[1]: https://mylink.com</p>
              <p>[2]: https://mylink.com</p>
            </div>
            <div className="InfoItem">
              <img className="InfoConfigure" src={cog} width={16} height={16}/>
              <h5>Link Preview</h5>
            </div>
            <div className="InfoItem">
              <img className="InfoConfigure" src={cog} width={16} height={16}/>
              <h5>Background</h5>
            </div>
            <div className="InfoItem">
              <img className="InfoConfigure" src={cog} width={16} height={16}/>
              <h5>Maps</h5>
            </div>
            <div className="InfoItem">
              <img className="InfoConfigure" src={cog} width={16} height={16}/>
              <h5>Phone</h5>
            </div>
            <div className="InfoItem">
              <img className="InfoConfigure" src={cog} width={16} height={16}/>
              <h5>JS Output</h5>
              <pre>
                ["Apples", "Oranges"]<br/>
                10
              </pre>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;
