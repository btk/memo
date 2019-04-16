import React, { Component } from 'react';
import './style.css';

import API from '../../js/api';

class App extends Component {
  state = {
    sheets: []
  }

  componentDidMount(){
    API.getSheets(1).then(sheets => {
      console.log(sheets);
      this.setState({sheets});
    });
  }

  renderSheets(sheets){
    return sheets.map(sheet => {
      return (
        <div
          className="sheetItem"
          key={sheet.id}
          onClick={() => API.event.emit("sheet", sheet.id)}>
          <div className="sheetRight">
            <h5>{sheet.title}</h5>
            <span>{sheet.first_line}</span>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="SheetsTab">
        <h4>Sheets</h4>
        <p className="sub">See and manage your most recent sheets.</p>
        {this.renderSheets(this.state.sheets)}
      </div>
    );
  }
}

export default App;
