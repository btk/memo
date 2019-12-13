import React, { Component } from 'react';
import './style.css';
import API from '../../js/api';
import Loading from '../../components/Loading';

class App extends Component {

  state = {
    searchTerm: "",
    sheets: [],
    noSheets: false
  }

  componentDidMount(){
    setTimeout(() => {
      this.refs._searchInput.focus();

    }, 200);
  }

  handleChange(e){
    if(e){
      let searchTerm = e.target.value;
      this.setState({searchTerm});
      API.searchSheets(searchTerm).then(sheets => {

        let noSheets = (sheets.length === 0);
        this.setState({sheets, noSheets});
      })
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

  render() {
    return (
      <div className="TabCarrier SearchTab">
        <div className={this.state.searchTerm ? "SearchHead SearchHeadHidden" : "SearchHead"}>
          <h4>Search</h4>
          <p className="sub">Search for a term in title or content of your notes.</p>
        </div>
        <input
          ref="_searchInput"
          className="searchInput"
          value={this.state.searchTerm}
          placeholder="Search in your notes..."
          onChange={(event) => this.handleChange(event)}/>

        <div className="SearchResults">
          { this.state.searchTerm && this.renderSheets(this.state.sheets)}
        </div>
      </div>
    );
  }
}

export default App;
