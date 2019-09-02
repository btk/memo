import React, { Component } from 'react';
import Toolbar from '../components/Toolbar';
import Calendar from '../components/Calendar';

import makeid from '../js/makeid';

import './growth.css';

import API from '../js/api';

class Growth extends Component {

  state = {
  };

  componentDidMount(){
    API.event.on("sheet", (id) => {
      API.getSheet(id).then((sheet) => {
        if(sheet == "NO_AUTH"){
          console.log("NO_AUTH, retrying initiation");
          API.login("refresh", id);
        }else{
          document.title = sheet.title + " | Memo";
          this.setState({
            lines: sheet.lines,
            sheet: {
              id: sheet.id,
              title: sheet.title
            }
          });
        }
      });
      API.event.emit("toggle", false);
    })
  }

  render(){
    return(
      <div className="AppHolder">
        <div className="Note">
          <div className="Left">
            <Calendar />
          </div>
          <div className="Growth">
          TEST
          </div>
          <Toolbar/>
        </div>
      </div>
    );
  }
}

export default Growth;
