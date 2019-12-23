import React, { Component } from 'react';
import './style.css';
import API from '../../js/api';
import Loading from '../../components/Loading';

class App extends Component {

  state = {
    syncText: API.getData("staging") ? "Push Changes" : "No Local Changes",
    staged: API.getData("staging") ? API.getData("staging") : "",
    error: ""
  }

  componentDidMount(){
    API.event.on("sync", this.syncAction);
    API.event.on("syncError", this.syncErrorAction);
  }

  componentWillUnmount(){
    API.event.removeListener("sync", this.syncAction);
    API.event.removeListener("syncError", this.syncErrorAction);
  }

  syncAction = (status) => {
    if(status == "flushed"){
      this.setState({syncText: "No Local Changes", staged: API.getData("staging")});
    }else{
      this.setState({syncText: "Push Changes", staged: API.getData("staging")});
    }
  }

  syncErrorAction = (err) => {
    this.setState({syncText: "Error Occured!", error: String(err)});
  }

  renderChanges(staging){
    if(staging){
      let staged = staging.split(",");
      return staged.map((sheet, i) => {
        let sheetId = Number(sheet.replace(/\|/g, ""));
        return (
          <div
            className="sheetItem"
            key={sheetId}
            onClick={() => API.event.emit("sheet", sheetId)}>
            <div className="sub">Changed sheet with id {sheetId}</div>
          </div>
        )
      })
    }else{
      return (<div className="tabNotice">Your local sheets are in sync with the origin.</div>);
    }
  }

  startSync(){
    if(this.state.staged){
      this.setState({syncText: "Syncing...", staged: ""});
      API.sync();
    }else{
      console.log("Already Synced");
    }
  }

  render() {
    return (
      <div className="TabCarrier PushTab">
        <h4>Push Changes</h4>
        <p className="sub">You can push changes to your Gist and sync your data.</p>

        <div className="tabScroller">
          {API.isOnline() &&
            <div
              className={this.state.staged == "" ? "sheetItem pushButton passive" : "sheetItem pushButton"}
              key={"push_changes"}
              onClick={() => this.startSync()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="#444" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M13 5.41V17a1 1 0 0 1-2 0V5.41l-3.3 3.3a1 1 0 0 1-1.4-1.42l5-5a1 1 0 0 1 1.4 0l5 5a1 1 0 1 1-1.4 1.42L13 5.4zM3 17a1 1 0 0 1 2 0v3h14v-3a1 1 0 0 1 2 0v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3z"/>
                </svg>
                <span>{this.state.syncText}</span>
            </div>
          }
          {(this.state.error != "") &&
             <div className="tabNotice">{this.state.error} <br/>Please try to login again by <span style={{cursor: "pointer", fontWeight: 500}} onClick={() => window.location.reload()}>restarting the app.</span></div>
          }
          {!API.isOnline() && <div className="tabNotice">No internet connection. <br/>Please connect to internet and <span style={{cursor: "pointer", fontWeight: 500}} onClick={() => window.location.reload()}>restart the app.</span></div>}
          {(API.isOnline() && (this.state.error == "")) && this.renderChanges(this.state.staged)}
        </div>
      </div>
    );
  }
}

export default App;
