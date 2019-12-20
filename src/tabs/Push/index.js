import React, { Component } from 'react';
import './style.css';
import API from '../../js/api';
import Loading from '../../components/Loading';

class App extends Component {

  state = {
    syncText: API.getData("staging") ? "Push" : "Synced",
    stagedAmount: API.getData("staging") ? API.getData("staging").split(",").length : 0
  }

  componentDidMount(){
    API.event.on("sync", this.syncAction);
  }

  componentWillUnmount(){
    API.event.removeListener("sync", this.syncAction);
  }

  syncAction = (status) => {
    if(status == "flushed"){
      this.setState({syncText: "Synced"});
    }else{
      this.setState({syncText: "Push", stagedAmount: status});
    }
  }

  renderSheets(sheets){
    if(sheets.length){
      return sheets.map(sheet => {
        let date = new Date(sheet.created_at * 1000);
        return (
          <div
            className="sheetItem"
            key={sheet.id}
            onClick={() => API.event.emit("sheet", sheet.id)}>
            <div className="sheetRight">
              <span>{sheet.title}</span>
              <div className="sub">{sheet.first_line ? sheet.first_line.substr(0, 50).replace(/-/g, "") + "..." : "This sheet is as empty as it can be..."}</div>

              <div className="subHolder">
                <sub>{date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()}</sub>
                {sheet.first_line &&
                  <sub>{sheet.line_count} Line{sheet.line_count != 1 ? "s": ""}</sub>
                }
                {!sheet.first_line &&
                  <sub>Blank</sub>
                }
              </div>
            </div>
          </div>
        );
      });
    }else{
      if(this.state.noSheets){
        return (<div className="tabNotice">No results with this term</div>);
      }else{
        return (<Loading height={200}/>);
      }
    }
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
      <div className="TabCarrier PushTab">
        <h4>Push Changes</h4>
        <p className="sub">You can push changes to your Gist and sync your data.</p>

        <div className="syncButton" onClick={() => this.startSync()}>
          {this.state.syncText} {this.renderStagedAmount(this.state.stagedAmount)}
        </div>
      </div>
    );
  }
}

export default App;
