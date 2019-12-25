import React, { Component } from 'react';
import './style.css';
import API from "../../js/api"

class App extends Component {

  state = {
    theme: API.getTheme()
  }

  changeTheme(changeTo){
    this.setState({theme: changeTo})
    API.event.emit("theme", changeTo);
  }

  changeCurrency(event){
    API.updatePreference("currency", event.target.value);
  }

  render() {
    let currencies = ["CAD", "HKD", "ISK", "PHP", "DKK", "HUF", "CZK", "GBP", "RON", "SEK", "IDR", "INR", "BRL", "RUB", "HRK", "JPY", "THB", "CHF", "EUR", "MYR", "BGN", "TRY", "CNY", "NOK", "NZD", "ZAR", "USD", "MXN", "SGD", "AUD", "ILS", "KRW", "PLN" ];

    return (
      <div className="TabCarrier SettingsTab">
        <h4>Settings</h4>
        <p className="sub">Manage your preferences and access your account information.</p>
        <h5>Choose Your Side</h5>
        <div className="prefItem theme">
          <div onClick={() => this.changeTheme("dark")} className={this.state.theme == "dark" ? "darkTheme themeActive" : "darkTheme"}>
            <div className="themeScreen">
              <img src={require("../../assets/memo_logo_left_white.svg")}/>
              <div className="themeScreenElement"></div>
            </div>
          </div>
          <div onClick={() => this.changeTheme("light")} className={this.state.theme == "light" ? "lightTheme themeActive" : "lightTheme"}>
            <div className="themeScreen">
              <img src={require("../../assets/memo_logo_left.svg")}/>
              <div className="themeScreenElement"></div>
            </div>
          </div>
        </div>
        <h5>Currency Preference</h5>
        <p className="sub">Choose your prefered currency that will be used for addons.</p>
        <select className="label" onChange={this.changeCurrency.bind(this)}>
          {API.getData("currency") && <option key={0} value={API.getData("currency")}>{API.getData("currency")}</option>}
          {!API.getData("currency") && <option key={0} value={"USD"}>USD</option>}
          {currencies.map((curr, i) => {
            return (<option key={i} value={curr}>{curr}</option>)
          })}
        </select>
        <>
          <h5>Revision History</h5>
          <p className="sub">In case of data loss, you can use your Gist revisions and see your change history.</p>
          {API.user &&
            <a href={"https://gist.github.com/"+ API.user.gist_id + "/revisions"} target="_blank">
              <div className="label" style={{fontSize: 15, fontWeight: 500}}>See Your Gist Revisions</div>
            </a>
          }
        </>
        {!API.user &&
          <div className="label">Only Available Online</div>
        }
        <h5>My Account</h5>
        {API.isOnline() &&
          <p className="sub">You are logged in as {API.user.username ? API.user.username : API.user.email.split("@")[0]} <span style={{cursor: "pointer", fontWeight: 500}} onClick={() => API.githubLogout()}>(Logout?)</span></p>
        }
        {!API.isOnline() &&
          <p className="sub">You are in offline mode. You can login the app when you have internet. <span style={{cursor: "pointer", fontWeight: 500}} onClick={() => window.location.reload()}>Try to login?</span></p>
        }
      </div>
    );
  }
}

export default App;
