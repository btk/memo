import React, { Component } from 'react';
import './style.css';

import Event from '../../js/event';

class App extends Component {
  state = {
    toggled: false,
    transition: 0,
    currentTab: false
  }

  componentDidMount(){
    Event.on("toggle", (tab) => {
      if(tab !== false){
        this.setState({
          currentTab: tab
        });
        setTimeout(() => {
          this.setState({
            transition: 1
          });
        }, 10);
      }else{
        this.setState({
          transition: 0
        });
        setTimeout(() => {
          this.setState({
            currentTab: false
          });
        }, 300);
      }
    });
  }

  render() {
    return (
      <>
        <div className="Toolbar" style={{width: this.state.transition == 1 ? 400 : 50}}>
          <div className="Menu">
            <div className="Top">
              <div className="Item" onClick={() => Event.emit("toggle", "search")}>
                <img src={require("../../icon/icon-search.svg")}/>
              </div>
              <div className="Item" onClick={() => Event.emit("toggle", false)}>
                <img src={require("../../icon/icon-duplicate.svg")}/>
              </div>
              <div className="Item">
                <img src={require("../../icon/icon-clip.svg")}/>
              </div>
            </div>
            <div className="Bottom">
              <div className="Item">
                <img src={require("../../icon/icon-archive.svg")}/>
              </div>
              <div className="Item">
                <img src={require("../../icon/icon-cog.svg")}/>
              </div>
            </div>
          </div>
        </div>
        {this.state.currentTab &&
          <div
            className="shadow"
            style={{opacity: this.state.transition}}
            onClick={() => Event.emit("toggle", false)}>
          </div>
        }
      </>
    );
  }
}

export default App;
