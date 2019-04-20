import React, { Component } from 'react';
import './style.css';
import Event from '../../js/event';

let spinner = require("../../icon/icon-cog.svg");

class App extends Component {

  renderQuote(){
    let quoteArray = [
      {
        person: "Burak Tokak",
        quote: "Wake up everyday, expecting resistance, and push through it!"
      },
      {
        person: "Bruce Lee",
        quote: "There are no limits. There are only plateaus, and you must not stay there, you must go beyond them."
      },
      {
        person: "Walt Disney",
        quote: "When you believe in a thing, believe in it all the way, implicitly and unquestionable."
      },
      {
        person: "Nelson Mandela",
        quote: "It always seems impossible until it's done."
      }
    ];

    let quote = quoteArray[Math.floor(Math.random() * (3 - 0 + 1) ) + 0];

    return (
      <div className="quote">
        <p>{quote.quote}</p>
        <div className="hr"></div>
        <span>{quote.person}</span>
      </div>
    );
  }

  render() {
    return (
      <div className="Loading" style={{height: this.props.height}}>
        {this.props.quote && <img src={require("./memo_logo_3.svg")} style={{marginBottom: 10}}/>}
        <div className="spinner">
          <div className="spinnerHole"></div>
        </div>
        {this.props.quote && this.renderQuote()}
      </div>
    );
  }
}

export default App;
