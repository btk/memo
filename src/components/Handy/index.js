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
    position: 0
  }

  componentDidMount(){

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


  render() {
    let addons = this.state.addons;

    return (
      <>
        <div className="Handy" style={{top: this.state.position, display: (this.state.position === 0) ? "none" : "block"}}>
          <div className={(window && window.process && window.process.type && window.process.platform !== 'browser') ? "HandyInner HandyInnerApp" : "HandyInner"}>
            {addons.includes("|write-good|") && <WriteGood />}
            {addons.includes("|conversion|") && <Conversion />}
            {addons.includes("|calculator|") && <Calculator />}
            {addons.includes("|links|") && <Links />}
          </div>
        </div>
      </>
    );
  }
}

export default App;
