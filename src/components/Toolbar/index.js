import React, { Component } from 'react';
import './style.css';

import { Addons, Archives, Push, Search, Settings, Sheets } from '../../tabs'

import API from '../../js/api';

class App extends Component {
  state = {
    toggled: false,
    transition: 0,
    currentTab: false,
    tabTransition: 0,
    stagedAmount: API.getData("staging") ? API.getData("staging").split(",").length : 0
  }

  componentDidMount(){

    API.event.on("sync", status => {
      if(status == "flushed"){
        this.setState({stagedAmount: 0});
      }else{
        this.setState({stagedAmount: status});
      }
    })

    API.event.on("toggle", (tab) => {
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
      case "push":
        return <Push/>;
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
        <div className={(window && window.process && window.process.platform === 'win32') ? "Toolbar ToolbarWin" : "Toolbar ToolbarOther"} style={{width: this.state.transition == 1 ? 400 : 50}}>

          {this.state.currentTab &&
            <div className="ToolBack">
              <div className="Item"  onClick={() => API.event.emit("toggle", false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M5.41 11H21a1 1 0 0 1 0 2H5.41l5.3 5.3a1 1 0 0 1-1.42 1.4l-7-7a1 1 0 0 1 0-1.4l7-7a1 1 0 0 1 1.42 1.4L5.4 11z"/></svg>
              </div>
            </div>
          }
          <div className={this.state.transition == 0 ? "Menu" : "Menu MenuOpen"}>
            <div className="Top">
              <div className={this.state.currentTab == "search" ? "Item ItemActive": "Item"} onClick={() => API.event.emit("toggle", "search")}>
                <div className="ToolTip"><span>Search</span></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/></svg>
              </div>
              <div className={this.state.currentTab == "sheets" ? "Item ItemActive": "Item"} onClick={() => API.event.emit("toggle", "sheets")}>
                <div className="ToolTip"><span>Sheets</span></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M17 7h2.25c.97 0 1.75.78 1.75 1.75v10.5c0 .97-.78 1.75-1.75 1.75H8.75C7.78 21 7 20.22 7 19.25V17H4.75C3.78 17 3 16.22 3 15.25V4.75C3 3.78 3.78 3 4.75 3h10.5c.97 0 1.75.78 1.75 1.75V7zm-2 0V5H5v10h2V8.75C7 7.78 7.78 7 8.75 7H15zM9 9v10h10V9H9z"/></svg>
              </div>
              <div className={this.state.currentTab == "archives" ? "Item ItemActive": "Item"} onClick={() => API.event.emit("toggle", "archives")}>
                <div className="ToolTip"><span>Archives</span></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M20 9v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2zm0-2V5H4v2h16zM6 9v10h12V9H6zm4 2h4a1 1 0 0 1 0 2h-4a1 1 0 0 1 0-2z"/></svg>
              </div>
            </div>
            <div className="Bottom">

              <div className={this.state.currentTab == "push" ? "Item ItemActive": "Item"}  onClick={() => API.event.emit("toggle", "push")}>
                <div className="ToolTip"><span>Push</span></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                  {this.state.stagedAmount == 0 && <path d="M6 18.7V21a1 1 0 0 1-2 0v-5a1 1 0 0 1 1-1h5a1 1 0 1 1 0 2H7.1A7 7 0 0 0 19 12a1 1 0 1 1 2 0 9 9 0 0 1-15 6.7zM18 5.3V3a1 1 0 0 1 2 0v5a1 1 0 0 1-1 1h-5a1 1 0 0 1 0-2h2.9A7 7 0 0 0 5 12a1 1 0 1 1-2 0 9 9 0 0 1 15-6.7z"/> }
                  {this.state.stagedAmount != 0 && <path d="M13 5.41V17a1 1 0 0 1-2 0V5.41l-3.3 3.3a1 1 0 0 1-1.4-1.42l5-5a1 1 0 0 1 1.4 0l5 5a1 1 0 1 1-1.4 1.42L13 5.4zM3 17a1 1 0 0 1 2 0v3h14v-3a1 1 0 0 1 2 0v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3z"/> }
                </svg>
                {this.state.stagedAmount != 0 && <div className="dot"></div>}
              </div>
              <div className={this.state.currentTab == "addons" ? "Item ItemActive": "Item"} onClick={() => API.event.emit("toggle", "addons")}>
                <div className="ToolTip"><span>Addons</span></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M17 22a2 2 0 0 1-2-2v-1a1 1 0 0 0-1-1 1 1 0 0 0-1 1v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-3H5a3 3 0 1 1 0-6h1V8c0-1.11.9-2 2-2h3V5a3 3 0 1 1 6 0v1h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1a1 1 0 0 0-1 1 1 1 0 0 0 1 1h1a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-3zm3-2v-3h-1a3 3 0 1 1 0-6h1V8h-3a2 2 0 0 1-2-2V5a1 1 0 0 0-1-1 1 1 0 0 0-1 1v1a2 2 0 0 1-2 2H8v3a2 2 0 0 1-2 2H5a1 1 0 0 0-1 1 1 1 0 0 0 1 1h1a2 2 0 0 1 2 2v3h3v-1a3 3 0 1 1 6 0v1h3z"/></svg>
              </div>
              <div className={this.state.currentTab == "settings" ? "Item ItemActive": "Item"} onClick={() => API.event.emit("toggle", "settings")}>
                <div className="ToolTip"><span>Settings</span></div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M9 4.58V4c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v.58a8 8 0 0 1 1.92 1.11l.5-.29a2 2 0 0 1 2.74.73l1 1.74a2 2 0 0 1-.73 2.73l-.5.29a8.06 8.06 0 0 1 0 2.22l.5.3a2 2 0 0 1 .73 2.72l-1 1.74a2 2 0 0 1-2.73.73l-.5-.3A8 8 0 0 1 15 19.43V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.58a8 8 0 0 1-1.92-1.11l-.5.29a2 2 0 0 1-2.74-.73l-1-1.74a2 2 0 0 1 .73-2.73l.5-.29a8.06 8.06 0 0 1 0-2.22l-.5-.3a2 2 0 0 1-.73-2.72l1-1.74a2 2 0 0 1 2.73-.73l.5.3A8 8 0 0 1 9 4.57zM7.88 7.64l-.54.51-1.77-1.02-1 1.74 1.76 1.01-.17.73a6.02 6.02 0 0 0 0 2.78l.17.73-1.76 1.01 1 1.74 1.77-1.02.54.51a6 6 0 0 0 2.4 1.4l.72.2V20h2v-2.04l.71-.2a6 6 0 0 0 2.41-1.4l.54-.51 1.77 1.02 1-1.74-1.76-1.01.17-.73a6.02 6.02 0 0 0 0-2.78l-.17-.73 1.76-1.01-1-1.74-1.77 1.02-.54-.51a6 6 0 0 0-2.4-1.4l-.72-.2V4h-2v2.04l-.71.2a6 6 0 0 0-2.41 1.4zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
              </div>
            </div>
          </div>
          <div className="tabContent" style={{opacity: this.state.tabTransition, left: this.state.tabTransition == 1 ? 0 : 10}}>
            {this.renderTabContent(this.state.currentTab)}
          </div>
        </div>
        <div
          className={(window && window.process && window.process.platform === 'win32') ? "shadow shadowWin": "shadow"}
          style={{opacity: this.state.transition, visibility: this.state.transition == 0 ? "hidden" : "visible"}}
          onClick={() => API.event.emit("toggle", false)}>
        </div>
      </>
    );
  }
}

export default App;
