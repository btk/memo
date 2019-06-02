import React, { Component } from 'react';
import './style.css';

import { Addons, Archives, Search, Settings, Sheets } from '../../tabs'

import Event from '../../js/event';

class App extends Component {
  state = {
    toggled: false,
    transition: 0,
    currentTab: false,
    tabTransition: 0
  }

  componentDidMount(){
    Event.on("toggle", (tab) => {
      if(tab !== false){
        if(this.state.currentTab != tab){
          if(this.state.currentTab != false){
            this.setState({
              tabTransition: 0
            });
            setTimeout(() => {
              this.setState({
                currentTab: tab,
                tabTransition: 1
              });
            }, 200);
          }else{
            this.setState({
              currentTab: tab,
              tabTransition: 1
            });
            setTimeout(() => {
              this.setState({
                transition: 1
              });
            }, 10);
          }
        }
      }else{
        this.setState({
          transition: 0,
          tabTransition: 0
        });
        setTimeout(() => {
          this.setState({
            currentTab: false
          });
        }, 300);
      }
    });
  }

  renderTabContent(tab){
    switch (tab) {
      case "addons":
        return <Addons/>;
        break;
      case "archives":
        return <Archives/>;
        break;
      case "search":
        return <Search/>;
        break;
      case "settings":
        return <Settings/>;
        break;
      case "sheets":
        return <Sheets/>;
        break;
      default:

    }
  }

  render() {
    return (
      <>
        <div className="Toolbar" style={{width: this.state.transition == 1 ? 400 : 50}}>
          <div className="Menu">
            <div className="Top">
              <div className="Item Search" onClick={() => Event.emit("toggle", "search")} style={{backgroundColor: this.state.currentTab == "search" ? "#f1f1f1" : "transparent"}}>
                <div className="ToolTip"><span>Search</span></div>
                <img src={require("../../icon/icon-search.svg")}/>
              </div>
              <div className="Item" onClick={() => Event.emit("toggle", "sheets")} style={{backgroundColor: this.state.currentTab == "sheets" ? "#f1f1f1" : "#ffffff"}}>
                <div className="ToolTip"><span>Sheets</span></div>
                <img src={require("../../icon/icon-duplicate.svg")}/>
              </div>
              <div className="Item" onClick={() => Event.emit("toggle", "archives")} style={{backgroundColor: this.state.currentTab == "archives" ? "#f1f1f1" : "#ffffff"}}>
                <div className="ToolTip"><span>Archives</span></div>
                <img src={require("../../icon/icon-archive.svg")}/>
              </div>
              <div className="Item" onClick={() => Event.emit("toggle", "attachments")} style={{backgroundColor: this.state.currentTab == "attachments" ? "#f1f1f1" : "#ffffff"}}>
                <div className="ToolTip"><span>Attachments</span></div>
                <img src={require("../../icon/icon-clip.svg")}/>
              </div>
            </div>
            <div className="Bottom">
              <div className="Item" onClick={() => Event.emit("toggle", "addons")} style={{backgroundColor: this.state.currentTab == "addons" ? "#f1f1f1" : "#ffffff"}}>
                <div className="ToolTip"><span>Addons</span></div>
                <img src={require("../../icon/icon-puzzle.svg")}/>
              </div>
              <div className="Item" onClick={() => Event.emit("toggle", "settings")} style={{backgroundColor: this.state.currentTab == "settings" ? "#f1f1f1" : "#ffffff"}}>
                <div className="ToolTip"><span>Settings</span></div>
                <img src={require("../../icon/icon-cog.svg")}/>
              </div>
            </div>
          </div>
          <div className="tabContent" style={{opacity: this.state.tabTransition, left: this.state.tabTransition == 1 ? 0 : 10}}>
            {this.renderTabContent(this.state.currentTab)}
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
