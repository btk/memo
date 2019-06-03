import React, { Component } from 'react';
import './style.css';

import API from '../../js/api';
import Loading from '../../components/Loading';

class App extends Component {
  state = {
    sheets: []
  }

  componentDidMount(){
    API.getSheets(1).then(sheets => {
      this.setState({sheets});
    });
  }

  renderSheets(sheets){
    if(sheets.length){
      return sheets.map(sheet => {
        return (
          <div
            className="sheetItem"
            key={sheet.id}
            onClick={() => API.event.emit("sheet", sheet.id)}>
            <div className="sheetRight">
              <span>{sheet.title}</span>
              <div className="sub">{sheet.first_line.substr(0, 50).replace(/-/g, "")}...</div>
            </div>
          </div>
        );
      });
    }else{
      return (<Loading height={200}/>);
    }
  }

  render() {
    return (
      <div className="SheetsTab">
        <h4>Sheets</h4>
        <p className="sub">See and manage your most recently accessed sheets.</p>
        <div className="tabScroller">
          <div
            className="sheetItem"
            key={"new_sheet"}
            onClick={() => API.event.emit("sheet", "NEW_SHEET")}>
            <div className="sheetIcon">
              <img src={require("../../icon/icon-file-plus.svg")}/>
            </div>
            <div className="sheetRight">
              <span>Add New Sheet</span>
            </div>
          </div>
          {this.renderSheets(this.state.sheets)}
        </div>
      </div>
    );
  }
}

export default App;
