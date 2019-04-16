import makeid from './makeid';
import Event from './event';

const URL = "https://www.buraktokak.com/note/";

class Api {
  constructor(){
		this.event = Event;
    this.logged = false;

    console.log("API: init");

  }

  renderLogin(){
    window.gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 0,
      'height': 0,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': (googleUser) => {
        var profile = googleUser.getBasicProfile();
        if(!this.logged){
          this.login({
            id: profile.getId(),
            email: profile.getEmail(),
            name: profile.getName(),
            avatar: profile.getImageUrl()
          });
        }
      }
    });
  }

  login(user){
    console.log(user);
    if(user.id){
      this.logged = true;
      this.user = user;

      var url = URL + "login.php";
      var formData = new FormData();
      formData.append('id', user.id);
      formData.append('email', user.email);
      formData.append('name', user.name);
      formData.append('avatar', user.avatar);

      fetch(url, { method: 'POST', body: formData })
      .then(res => res.json())
      .then((res) => {
        this.user.id = res.id;
        //console.log(res);
      });

      this.event.emit("login", true);
      console.log("API: Logged in");
    }
  }

  getSheet(sheetId){
    var url = URL + "sheet.php";
    var formData = new FormData();
    formData.append('id', sheetId);

    return fetch(url, { method: 'POST', body: formData })
    .then(res => res.json());
  }

  getSheets(active){
    var url = URL + "sheets.php";
    var formData = new FormData();
    formData.append('id', this.user.id);
    formData.append('active', active);

    return fetch(url, { method: 'POST', body: formData })
    .then(res => res.json());
  }

  updateLine(id, pos, text, action, hint){
    var url = URL + "line.php";
    var formData = new FormData();
    formData.append('id', id);
    formData.append('pos', pos);
    formData.append('text', text);
    formData.append('action', action ? action : "");
    formData.append('hint', hint ? hint : "");

    return fetch(url, { method: 'POST', body: formData })
    .then(res => res.json()).then(res => console.log(res));
  }

	// These are like kinda private;
  // But xxx it, use them in the general app, who cares.
  setData(key, data){
		// returns promise, might be useful, no need to listen tho.
		//return storage.save({key, data});
  }

  getData(key){
    // returns promise
		//return storage.load({key});
  }
}

const _api = new Api();
export default _api;
