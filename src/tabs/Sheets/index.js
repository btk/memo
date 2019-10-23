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
              <div className="sub">{sheet.first_line ? sheet.first_line.substr(0, 50).replace(/-/g, "") + "..." : "This sheet is as empty as it can be..."}</div>

              <div className="subHolder">
                <sub>{date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()}</sub>
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="#444" viewBox="0 0 24 24" width="18" height="18"><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-9h2a1 1 0 0 1 0 2h-2v2a1 1 0 0 1-2 0v-2H9a1 1 0 0 1 0-2h2V9a1 1 0 0 1 2 0v2z"/></svg>
              <span>Create New Sheet</span>
          </div>
          {this.renderSheets(this.state.sheets)}
        </div>
      </div>
    );
  }
}

export default App;
