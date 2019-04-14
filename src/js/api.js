import makeid from './makeid';
import Event from './event';

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
      this.event.emit("login", true);
      console.log("API: Logged in");
    }
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
