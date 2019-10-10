import React, { Component } from 'react';
import './style.css';
import API from '../../js/api';

import writeGood from "write-good";

const THROTTLE_LIMIT = 5; // fire for every 5 changes

let cog = require("./icon-cog.svg");

class App extends Component {
  state = {
    text: ""
  }

  componentDidMount(){
    this.throttleCounter = 0;
    API.event.on("lineFocused", (line) => {
      this.setState({
        text: line.text,
        lineId: line.lineId,
        index: line.index
      });
    });

    API.event.on("lineChanged", (text) => {
      if(this.throttleCounter == THROTTLE_LIMIT){
        this.setState({text});
        this.throttleCounter = 0;
      }
      this.throttleCounter++;
    });
  }

  render() {
    if(this.state.text){
      let writeGoodSuggestions = writeGood(this.state.text);
      if(writeGoodSuggestions.length){
        return (
          <>
            <div className="AddonItem">
              <img className="AddonConfigure" src={cog} width={16} height={16}/>
              <h5>Write-Good</h5>
              <p>{writeGoodSuggestions.map((s, i) => {
                return (<div className="writeGoodAdvice" key={i}>{s.reason}</div>)
              })}</p>
            </div>
          </>
        );
      }else{
        return null;
      }
    }else{
      return null;
    }
  }
}

export default App;
