import React, { Component } from 'react';
import './style.css';
import API from '../../js/api';

const cog = require("./icon-cog.svg");
const addon = require("./addon.json");

class App extends Component {
  state = {
    text: ""
  }

  componentDidMount(){
    API.event.on("lineFocused", (line) => {
      this.setState({
        text: line.text,
        lineId: line.lineId,
        index: line.index
      });
    });

    API.event.on("lineChanged", (text) => {
      this.setState({text});
    });
  }

  render() {
    if(this.state.text){
      let includes = this.state.text.includes("=");
      if(includes){
        return (
          <>
            <div className="AddonItem">
              <img className="AddonConfigure" src={cog} width={16} height={16}/>
              <h5>{addon.display}</h5>
              <p>X = 1232132</p>
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
