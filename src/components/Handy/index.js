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
    text: "",
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
        <div className="Handy">
          <div className="HandyFixed"></div>
          <div className="HandyInner">
            <Notes />
            <WriteGood />
            <Conversion />
            <Calculator />
            <Links />

            <div className="sync" style={{position: "absolute", bottom: 50, left: 10}} onClick={() => API.fetch()}>
              Force Fetch
            </div>
            <div className="sync" style={{position: "absolute", bottom: 10, left: 10}} onClick={() => this.startSync()}>
              {this.state.syncText} {this.renderStagedAmount(this.state.stagedAmount)}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;
