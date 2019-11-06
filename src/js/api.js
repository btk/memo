import makeid from './makeid';
import Event from './event';
import LocalDB from './localdb';
import Analytics from 'react-ga';

const URL = "https://api.usememo.com/";
const DB_TYPE = "local"; //cloud

class API {
  constructor(){
    Analytics.initialize('UA-138987685-1');
		this.event = Event;
    this.analytics = Analytics;
    this.logged = false;
    this.loginInterval = false;
    console.log("API: init");

    if(DB_TYPE == "local"){
      LocalDB.initDB().then(res => {
        console.log("LocalDB: init");
      });
    }

  }

  renderLogin(){
    this.loginInterval = setInterval(() => {
      if(window.gapi){
        if(window.gapi.signin2){
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
                  token: googleUser.getAuthResponse().id_token,
                  email: profile.getEmail(),
                  name: profile.getName(),
                  avatar: profile.getImageUrl()
                });
              }
            }
          });
          clearInterval(this.loginInterval);
        }
      }
    }, 200);
  }

  login(user, sheetId){
    this.analytics.pageview("/login");
    if(user == "refresh"){
      this.logged = true;

      var url = URL + "login.php";
      var formData = new FormData();
      formData.append('id', "refresh");
      formData.append('token', this.user.token);
      formData.append('email', this.user.email);
      formData.append('name', this.user.name);
      formData.append('avatar', this.user.avatar);
      formData.append('time', Math.round((new Date()).getTime() / 1000));

      fetch(url, { method: 'POST', body: formData })
      .then(res => res.json())
      .then((res) => {
        this.user.id = res.id;
        this.user.session_id = res.session_id;
        console.log("new auth initiated, asked sheet is mounting");
        this.event.emit("sheet", sheetId);
      });
    }else{
      if(user.id){
        this.logged = true;
        this.user = user;

        var url = URL + "login.php";
        var formData = new FormData();
        formData.append('id', user.id);
        formData.append('token', user.token);
        formData.append('email', user.email);
        formData.append('name', user.name);
        formData.append('avatar', user.avatar);
        formData.append('time', Math.round((new Date()).getTime() / 1000));

        fetch(url, { method: 'POST', body: formData })
        .then(res => res.json())
        .then((res) => {
          this.user.id = res.id;
          this.user.session_id = res.session_id;
          this.event.emit("sheet", "LAST_ACCESSED");
        });

        this.event.emit("login", true);
        console.log("API: Logged in");
      }
    }
  }

  getTheme(){
    return this.getData("theme") || "light";
  }

  getSheet(sheetId){
    this.analytics.pageview("/sheet/"+sheetId);

    let today = new Date();
    let formattedTime = String(today.getDate()).padStart(2, '0') + "/" + String(today.getMonth() + 1).padStart(2, '0') + "/" + today.getFullYear();

    if(DB_TYPE == "cloud"){
      var url = URL + "sheet.php";
      var formData = new FormData();
      formData.append('id', sheetId);
      formData.append('formatted_time', formattedTime);

      let time = Math.round((new Date()).getTime() / 1000);
      formData.append('time', time);
      formData.append('session_id', this.user.session_id);

      return fetch(url, { method: 'POST', body: formData })
      .then(res => res.json());
    }else if(DB_TYPE == "local"){

      let id = sheetId;
      let time = Math.round((new Date()).getTime() / 1000);
      let where, order;
      let action = "";

      if(action == "archive"){
        // `sheet` SET `active` = 0 WHERE `id` = $id AND owner_id = $user_id
        return LocalDB.update("sheet", {id}, {active: 0});
      }else if(action == "active"){
        return LocalDB.update("sheet", {id}, {active: 1});
      }else if(action == "rm"){
        //DELETE FROM `sheet` WHERE `id` = $id AND owner_id = $user_id
        //DELETE FROM `line` WHERE `sheet_id` = $id
        return LocalDB.delete("sheet", {id}).then((res) => {
          return LocalDB.delete("line", {sheet_id: id});
        });
      }else{
        if(id == "NEW_SHEET"){
          // INTO `sheet` (`id`, `owner_id`, `title`, `active`, `created_at`, `accessed_at`) VALUES (NULL, '$user_id', 'Untitled Sheet', 1, '$time', '$time
          return LocalDB.insert("sheet", {
            title: "Untitled Sheet",
            active: 1,
            created_at: time,
            accessed_at: time
          }).then(res => {
            if(res){
              //SELECT id FROM `sheet` WHERE owner_id = $user_id Order by accessed_at desc LIMIT 1
              return LocalDB.select("sheet", null, {
                by: "accessed_at",
                type: "desc"
              }, 1).then(res => {
                let newAddedId = res[0].id;
                let newLineKey = makeid(5);
                //INSERT INTO `line` (`id`, `sheet_id`, `line_key`, `date`, `text`, `pos`) VALUES (NULL, '$id', '".uniqid()."', '$formatted_time', '', '0')
                return LocalDB.insert("line", {
                  sheet_id: newAddedId,
                  line_key: newLineKey,
                  date: formattedTime,
                  text: "",
                  pos: 0
                }).then(res => {
                  return LocalDB.select("sheet", {id: newAddedId}, null, 1).then((sheet) => {
                    let newSheet = sheet[0];
                    return LocalDB.select("line", {sheet_id: newAddedId}, {by: "pos", type: "asc"}).then(lines => {
                      newSheet.lines = lines;
                      return newSheet;
                    })
                  })
                })
              });
            }
          })

        }else if(id == "LAST_ACCESSED"){

          return LocalDB.select("sheet", {active: 1}, {
            by: "accessed_at",
            type: "desc"
          }, 1).then(res => {
            if(res[0]){
              let lastSheet = res[0];
              return LocalDB.select("line", {sheet_id: lastSheet.id}, {by: "pos", type: "asc"}).then(lines => {
                lastSheet.lines = lines;
                return lastSheet;
              });
            }else{
              // Add a new sheet for the new user!

              return LocalDB.insert("sheet", {
                title: "Untitled Sheet",
                active: 1,
                created_at: time,
                accessed_at: time
              }).then(res => {
                if(res){
                  //SELECT id FROM `sheet` WHERE owner_id = $user_id Order by accessed_at desc LIMIT 1
                  return LocalDB.select("sheet", null, {
                    by: "accessed_at",
                    type: "desc"
                  }, 1).then(res => {
                    let newAddedId = res[0].id;
                    let newLineKey = makeid(5);
                    //INSERT INTO `line` (`id`, `sheet_id`, `line_key`, `date`, `text`, `pos`) VALUES (NULL, '$id', '".uniqid()."', '$formatted_time', '', '0')
                    return LocalDB.insert("line", {
                      sheet_id: newAddedId,
                      line_key: newLineKey,
                      date: formattedTime,
                      text: "",
                      pos: 0
                    }).then(res => {
                      return LocalDB.select("sheet", {id: newAddedId}).then((sheet) => {
                        let newSheet = sheet[0];
                        console.log("newS", newSheet)
                        return LocalDB.select("line", {sheet_id: newAddedId}, {by: "pos", type: "asc"}).then(lines => {
                          newSheet.lines = lines;
                          return newSheet;
                        })
                      })
                    })
                  });
                }
              });

            }
          })

        }else{
          // id is a Number
          return LocalDB.select("sheet", {id}).then((sheet) => {
            let idSheet = sheet[0];
            return LocalDB.select("line", {sheet_id: idSheet.id}, {by: "pos", type: "asc"}).then(lines => {
              console.log(lines);
              idSheet.lines = lines;
              LocalDB.update("sheet", {id}, {accessed_at: time});
              return idSheet;
            });
          });
        }
      }
    }
  }

  getConversions(){
    return fetch("https://api.exchangeratesapi.io/latest?base=USD")
    .then(res => res.json());
  }

  getSheets(active){
    if(DB_TYPE == "cloud"){
      var url = URL + "sheets.php";
      var formData = new FormData();
      formData.append('id', this.user.id);
      formData.append('active', active);
      formData.append('session_id', this.user.session_id);

      return fetch(url, { method: 'POST', body: formData })
      .then(res => res.json());
    }else if(DB_TYPE == "local"){
      return LocalDB.select("sheet", {active: 1}, {
        by: "accessed_at",
        type: "desc"
      }).then(res => {
        return res;
      })
    }
  }

  updateLine(id, pos, text, action, hint){
    if(DB_TYPE == "cloud"){
      var url = URL + "line.php";
      var formData = new FormData();
      formData.append('id', id);
      formData.append('pos', pos);
      formData.append('text', text);
      formData.append('action', action ? action : "");
      formData.append('hint', hint ? hint : "");
      formData.append('session_id', this.user.session_id);

      return fetch(url, { method: 'POST', body: formData })
      .then(res => res.json());
    }else if(DB_TYPE == "local"){

      // pos, text, action, hint
      let date = id.split("-")[0].split("!")[1];
      let line_key = id.split("-")[1];
      let sheet_id = Number(id.split("-")[0].split("!")[0]);

      if(action == "rm"){
        //DELETE FROM `line` WHERE `date` = '$date' AND `sheet_id` = '$sheetId' AND `pos` = '$pos
        //UPDATE `line` SET pos = pos-1 WHERE `pos` >= $pos AND sheet_id = $sheetId
        return LocalDB.delete("line", {date, sheet_id, pos}).then(() => {
          return LocalDB.update("line", {
            pos: {
              '>=': pos
            },
            sheet_id
          }, {
            pos: {
              '-': 1
            }
          });
        });
      }else{
        let setFound = {text};
        let whereCheck = {date, sheet_id, pos, line_key};
        if(action == "key"){
          setFound.line_key = line_key;
          whereCheck.line_key = hint;
        }

        //SELECT id FROM `line` WHERE `date` = '$date' AND `sheet_id` = '$sheetId' AND `pos` = '$pos' AND `line_key` = '$checkKey' LIMIT 1
        return LocalDB.select("line", whereCheck, null, 1).then((line) => {
          if(line.length == 1){
            //UPDATE `line` SET `text` = '$text'$updateKey WHERE `id` = $lineId
            return LocalDB.update("line", {id: line[0].id}, setFound);
          }else{
            //UPDATE `line` SET pos = pos+1 WHERE `pos` >= $pos AND sheet_id = $sheetId

            return LocalDB.select("line", {
              pos: {
                '>=': pos
              },
              sheet_id
            }).then(res => {
              res.forEach(line => {
                LocalDB.update("line", {
                  id: line.id
                }, {
                  pos: {
                    '+': 1
                  }
                })
              });
              //INSERT INTO `line` (`id`, `sheet_id`, `line_key`, `date`, `text`, `pos`) VALUES (NULL, '$sheetId', '$key', '$date', '$text', '$pos
              return LocalDB.insert("line", {
                sheet_id,
                line_key,
                date,
                text,
                pos
              });
            });
          }
        });
      }
    }
  }

  updateTitle(text, sheetId){
    if(DB_TYPE == "cloud"){
      var url = URL + "sheet.php";
      var formData = new FormData();
      formData.append('id', sheetId);
      formData.append('title', text);
      formData.append('session_id', this.user.session_id);

      return fetch(url, { method: 'POST', body: formData })
      .then(res => res.json());
    }else if(DB_TYPE == "local"){
      return LocalDB.update("sheet", {
        id: sheetId
      }, {
        title: text
      });
    }
  }

  removeSheet(sheetId){
    if(DB_TYPE == "cloud"){
      var url = URL + "sheet.php";
      var formData = new FormData();
      formData.append('id', sheetId);
      formData.append('session_id', this.user.session_id);
      formData.append('action', "rm");

      return fetch(url, { method: 'POST', body: formData })
      .then(res => res.json());
    }else if(DB_TYPE == "local"){
      return LocalDB.delete("sheet", {
        id: sheetId
      }).then(sheet => {
        return LocalDB.delete("line", {sheet_id: sheetId});
      });
    }
  }

	// These are like kinda private;
  // But xxx it, use them in the general app, who cares.
  setData(key, data){
		// returns promise, might be useful, no need to listen tho.
		return localStorage.setItem(key, data);
  }

  getData(key){
    // returns promise
    return localStorage.getItem(key);
  }
}

const _api = new API();
export default _api;
