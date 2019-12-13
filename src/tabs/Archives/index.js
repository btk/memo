import React, { Component } from 'react';
import './style.css';

import API from '../../js/api';
import Loading from '../../components/Loading';

class App extends Component {
  state = {
    sheets: [],
    noSheets: false
  }

  componentDidMount(){
    API.getSheets(0).then(sheets => {
      if(sheets.length){
        this.setState({sheets});
      }else{
        this.setState({noSheets: true});
      }
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
      if(this.state.noSheets){
        return (<div className="tabNotice">You don't have any archived sheets!</div>);
      }else{
        return (<Loading height={200}/>);
      }
    }
  }

  render() {
    return (
      <div className="TabCarrier ArchivesTab">
        <h4>Archives</h4>
        <p className="sub">See and manage your old and not-so-popular sheets.</p>
        <div className="tabScroller">
          {this.renderSheets(this.state.sheets)}
        </div>
      </div>
    );
  }
}

export default App;
