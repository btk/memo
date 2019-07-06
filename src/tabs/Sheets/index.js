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
        let date = new Date(sheet.created_at * 1000);
        return (
          <div
            className="sheetItem"
            key={sheet.id}
            onClick={() => API.event.emit("sheet", sheet.id)}>
            <div className="sheetRight">
              <span>{sheet.title}</span>
              <div className="sub">{sheet.first_line.substr(0, 50).replace(/-/g, "")}...</div>

              <div className="subHolder">
                <sub>{date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()}</sub>
                <sub>23 Lines</sub>
              </div>
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
            className="sheetItem addNew"
            key={"new_sheet"}
            onClick={() => API.event.emit("sheet", "NEW_SHEET")}>
              <img style={{width: 18, height: 18}} src={require("../../icon/icon-plus-circle.svg")}/>
              <span>Create New Sheet</span>
          </div>
          {this.renderSheets(this.state.sheets)}
        </div>
      </div>
    );
  }
}

export default App;
