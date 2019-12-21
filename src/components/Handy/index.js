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
    position: 0,
    syncText: API.getData("staging") ? "Sync to Github" : "Synced",
    stagedAmount: API.getData("staging") ? API.getData("staging").split(",").length : 0
  }

  componentDidMount(){
    API.event.on("sync", status => {
      if(status == "flushed"){
        this.setState({syncText: "Synced"});
      }else{
        this.setState({syncText: "Sync to Github", stagedAmount: status});
      }
    })

    API.event.on("lineFocused", (line) => {
      this.setState({
        position: line.position
      });
    });
  }

  startSync(){
    if(this.state.stagedAmount != 0){
      this.setState({syncText: "Syncing...", stagedAmount: 0});
      API.sync();
    }else{
      console.log("Already Synced");
    }
  }

  renderStagedAmount(staged){
    if(staged !== 0){
      return (<span>({staged})</span>)
    }else{
      return null;
    }
  }

  render() {
    return (
      <>
        <div className="Handy" style={{top: this.state.position}}>
          <div className={(window && window.process && window.process.type && window.process.platform !== 'browser') ? "HandyInner HandyInnerApp" : "HandyInner"}>
            <WriteGood />
            <Conversion />
            <Calculator />
            <Links />

            <div className="sync" onClick={() => API.fetch()}>
              Force Fetch
            </div>
            <div className="sync" onClick={() => this.startSync()}>
              {this.state.syncText} {this.renderStagedAmount(this.state.stagedAmount)}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;
