import React, { Component } from 'react';
import './style.css';
import API from '../../js/api';

import WriteGood from '../../addons/write-good/';
import Conversion from '../../addons/conversion/';
import Calculator from '../../addons/calculator/';
import Links from '../../addons/links/';

class App extends Component {
  state = {
    addons: API.getData("addons") != null ? API.getData("addons") : API.defaultAddons,
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

    API.event.on("sheet", () => {
      this.setState({ position: 0 });
    });

    API.event.on("addonsUpdated", (addons) => {
      this.setState({ addons });
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
    let addons = this.state.addons;

    return (
      <>
        <div className="Handy" style={{top: this.state.position, display: (this.state.position === 0) ? "none" : "block"}}>
          <div className={(window && window.process && window.process.type && window.process.platform !== 'browser') ? "HandyInner HandyInnerApp" : "HandyInner"}>
            {this.state.addons.includes("|write-good|") && <WriteGood />}
            {this.state.addons.includes("|conversion|") && <Conversion />}
            {this.state.addons.includes("|calculator|") && <Calculator />}
            {this.state.addons.includes("|links|") && <Links />}

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
