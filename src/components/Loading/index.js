import React, { Component } from 'react';
import './style.css';
import Event from '../../js/event';

import API from '../../js/api';

const quoteRand = Math.floor(Math.random() * (3 - 0 + 1) ) + 0;

class App extends Component {

  state = {
    spinning: true
  }

  componentDidMount(){
    API.event.on("loginButton", () => {
      this.setState({spinning: false});
    });

    API.event.on("fetching", () => {
      this.setState({statusText: "Processing data from GitHub..."});
    });

    API.event.on("fetched", () => {
      this.setState({statusText: ""});
    });


  }

  renderQuote(){
    let quoteArray = [
      {
        person: "Muhammed Ali",
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

    let quote = quoteArray[quoteRand];

    return (
      <div className="quote" style={{height: 114}}>
        <p>{quote.quote}</p>
        <div className="hr"></div>
        <span>{quote.person}</span>
      </div>
    );
  }

  render() {
    return (
      <div className="Loading" style={{height: this.props.height}}>
        {this.props.quote && <img src={API.getTheme() == "dark" ? require("../../assets/memo_logo_left_white.svg"):require("../../assets/memo_logo_left.svg")} style={{marginBottom: 10, width: 159, height: 42}}/>}
        {this.state.spinning &&
          <>
            <div className="spinner">
              <div className="spinnerHole"></div>
            </div>
          </>
        }
        <div style={{height: this.state.spinning ? 0 : "auto", overflow: "hidden", margin: this.state.spinning ? 0 : 16}}>{this.props.children}</div>
        {this.props.quote && this.renderQuote()}
        {this.state.statusText && <div className="loginStatusText">{this.state.statusText}</div>}
      </div>
    );
  }
}

export default App;
