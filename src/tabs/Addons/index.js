import React, { Component } from 'react';
import './style.css';
import API from '../../js/api';

let addons = [
  require('../../addons/write-good/addon.json'),
  require('../../addons/conversion/addon.json'),
  require('../../addons/links/addon.json'),
  require('../../addons/calculator/addon.json')
]


class App extends Component {
  state = {
    addons: API.getData("addons") != null ? API.getData("addons") : API.defaultAddons
  }

  toggleAddon(slug){
    let addons = this.state.addons;
    if(addons.includes("|" + slug + "|")){
      addons = addons.replace("|" + slug + "|", "");
    }else{
      addons = addons + "|" +slug+ "|";
    }

    API.event.emit("addonsUpdated", addons);
    this.setState({addons});
    API.updatePreference("addons", addons);
  }

  render() {
    return (
      <div className="TabCarrier AddonsTab">
        <h4>Addons</h4>
        <p className="sub">Discover and add tools to costimize your note taking experience.</p>
        {
          addons.map((addon, i) => {
            return (
              <div
                className="sheetItem"
                key={i}
                onClick={() => this.toggleAddon(addon.slug)}>
                <div className="sheetRight">
                  <span style={{paddingTop: 5, paddingBottom: 5}}>{addon.display}</span>
                  <label className="switch">
                    <input type="checkbox" checked={this.state.addons.includes("|" +addon.slug+ "|")} readOnly={true}/>
                    <span className="slider round"></span>
                  </label>
                  <div className="switchBlocker"></div>
                  <div className="sub" style={{paddingBottom: 5}}>{addon.description}</div>
                </div>
              </div>
            )
          })
        }
      </div>
    );
  }
}

export default App;
