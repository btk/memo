import React, { Component } from 'react';
import './style.css';
import API from "../../js/api"

class App extends Component {

  state = {
    theme: API.getTheme(),
    toggleUserOptions: false
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
    let handle = API.user ? API.user.username ? API.user.username : API.user.email.split("@")[0] : API.anonymousUser.username;

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
        <p className="version">Memo App v{API.version} {API.version[0] == "0" && "Beta"}</p>
        <div className="myaccount">
          {API.isOnline() &&
            <div>
              <div className="subUser">
                <img src={API.user.avatar} style={{width: 40, height: 40}}/>
                <div>
                  <div className="userName">{API.user.name ? API.user.name : handle[0].toUpperCase() + handle.substr(1)}</div>
                  <div className="userHandle">@{handle}</div>
                </div>
                <div className={this.state.toggleUserOptions ? "toggleIcon toggleIconActive" : "toggleIcon"} onClick={() => {
                    let toggleUserOptions = this.state.toggleUserOptions;
                    this.setState({toggleUserOptions: !toggleUserOptions});
                  }}>
                  <svg viewBox="0 0 24 24" width="24" height="24"><path d="M15.3 9.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4l3.3 3.29 3.3-3.3z"/></svg>
                </div>
              </div>
              <div className="userOptions" style={{maxHeight: this.state.toggleUserOptions ? 110 : 0}}>
                <ul>
                  <li><a href="https://github.com/settings/applications" target="_blank">Manage Permissions</a></li>
                  <li><a href={"https://gist.github.com/"+ API.user.gist_id + "/"} target="_blank">Your Data on GitHub</a></li>
                  <li><a href="https://usememo.com/privacy-policy/" target="_blank">Privacy Policy</a></li>
                  <li><span style={{cursor: "pointer"}} onClick={() => API.githubLogout()}>Logout</span></li>
                </ul>
              </div>
            </div>
          }
          {!API.isOnline() &&
            <p className="sub" style={{paddingLeft: 5}}>
              <span>You are in offline mode.</span>
              <br/>
              <span className="userHandle">
                You can login the app when you have internet. <br/>
                <span style={{cursor: "pointer", fontWeight: 500}} onClick={() => window.location.reload()}>Try to login?</span>
              </span>
            </p>
          }
        </div>
      </div>
    );
  }
}

export default App;
