import Octokit from '@octokit/rest';
import API from './api';
import Markdown from './markdown';

class Github {
  async init(token){
    this.client = new Octokit({
      auth: "token "+token
    })

    if(!API.user.gist_id){
      return await this.setup();
    }else{
      return true;
    }
  }

  list(){
    return this.client.gists.list().then(gists => {
      return gists;
    });
  }

  setup(){
    // create an empty memo gist
    let files = {};
    files["01_usememo.md"] = {
      filename: "01_usememo.md",
      content: `# Created by Memo App

This gist was created by note taking app; memo ([usememo.com](https://www.usememo.com)) and is not intended to be editted.

To read your notes and make changes, please go to [usememo.com](https://www.usememo.com) and use either our browser app or desktop app. Also you can see your notes in MD format in the following sub gists, by their sheet ids.
`
    };

    files["02_metadata.md"] = {
      filename: "02_metadata.md",
      content: `---
created_at: ${Math.round((new Date()).getTime() / 1000)}
accessed_at: ${Math.round((new Date()).getTime() / 1000)}
theme: ${API.getTheme()}
currency: USD
addons: |write-good||conversion||links||calculator|
---

Please don't edit this file, as this is vital for cache validation and version control.
`
    };

    files["sheet-1.md"] = {
      filename: "sheet-1.md",
      content: `---
id: 1
title: Welcome to Memo 👋
active: 1
created_at: 1576786353
accessed_at: 1576789529
---
{{date: 19/12/2019}}

This so exiting.
Thank you for checking out memo!

Memo has no bold, italic or subtitles, minimal and plain. Great for really focusing and creating your own formatting. It's totally free, and uses private Github Gists as cloud storage.

Let me tell you about how memo works;
	- There are separated paragraphs
	- A double new line creates a paragraph
	- Every paragraph has its own insights ✨
	- Enable which insights you want in addons 🧩
	- Use offline, push your changes to cloud later

Now, archive or remove this sheet or create a new sheet from sidebar sheets tab and start taking notes.

Also share your experience with memo over twitter about your experience.
Don't forget to tag me @buraktokak

Again, welcome to memo! 😊🥳`
    };

    return this.client.gists.create({
      files
    }).then(res => {
      API.setGistId(res.data.id);
      return this.sync();
    })
  }

  fetch(){
    API.event.emit("fetching");
    return this.client.gists.get({gist_id: API.user.gist_id}).then(gist => {
      let files = gist.data.files;

      //cloud stored preference data in effect on
      let theme = files["02_metadata.md"].content.split("theme: ")[1].split(/\n/)[0];
      API.setData("theme", theme);
      API.event.emit("theme", theme);

      let currency = files["02_metadata.md"].content.split("currency: ")[1].split(/\n/)[0];
      API.setData("currency", currency);

      let addons = files["02_metadata.md"].content.split("addons: ")[1].split(/\n/)[0];
      API.setData("addons", addons);
      API.event.emit("addons", addons);


      return API.truncateDb().then(res => {
        return Markdown.saveMarkdownSheet(files).then(res => {
          API.addToStaging("flush");
          API.event.emit("fetched");
          return res;
        });
      })
    })
  }

  checkUpdate(){
    API.event.emit("checkingUpdates");

    return this.client.gists.get({gist_id: API.user.gist_id}).then(gist => {
      let files = gist.data.files;
      let accessed_at = Number(files["02_metadata.md"].content.split("accessed_at: ")[1].split(/\n/)[0]);
      if(accessed_at != Number(API.getData("updated_at"))){
        console.log("Local data is not valid, starting a forced fetch");
        return this.fetch();
      }else{
        console.log("Gists and local data is already synced");
        return true;
      }
    }, err => {
      console.log("Error: Gist is not valid, creating a new one.");
      return this.setup().then(res => {
        return this.fetch();
      });
    })
  }

  sync(){
    let staging = API.getData("staging");
    if(staging){

      let stagedArray = [];
      staging.split(",").forEach(staged => {
        stagedArray.push(Number(staged.replace(/\|/g, "")));
      });

      let memoGistId = API.user.gist_id;

      return this.client.gists.get({gist_id: memoGistId}).then(async gist => {
        let files = gist.data.files;

        let currentClientTime = Math.round((new Date()).getTime() / 1000);
        API.setData("updated_at", currentClientTime);

        let metadata = files[`02_metadata.md`].content;

        let metadataHead = metadata.split("accessed_at: ")[0];
        let metadataFoot = metadata.split("accessed_at: ")[1].split(/\n/).slice(1).join("\n");

        let metadataContent = metadataHead + "accessed_at: " + currentClientTime + "\n" + metadataFoot;

        files[`02_metadata.md`] = {
          filename: `02_metadata.md`,
          content: metadataContent
        };

        for (var i = 0; i < stagedArray.length; i++) {
          let stagedSheetId = stagedArray[i];
          let markdownContent = await Markdown.getSheetMarkdown(stagedSheetId);
          if(markdownContent == ""){
            if(files[`sheet-${stagedSheetId}.md`]){
              files[`sheet-${stagedSheetId}.md`] = {
                filename: `sheet-${stagedSheetId}.md`,
                content: ""
              };
            }
          }else{
            files[`sheet-${stagedSheetId}.md`] = {
              filename: `sheet-${stagedSheetId}.md`,
              content: markdownContent
            };
          }
        }

        return this.client.gists.update({
          gist_id: memoGistId,
          files: files
        });
      }, err => {
        API.event.emit("syncError", err);
        return err;
      })

    }else {
      return "no files on staging";
    }
  }

  pushPreference(preference, updateTo){
    let memoGistId = API.user.gist_id;

    return this.client.gists.get({gist_id: memoGistId}).then(async gist => {
      let files = gist.data.files;

      let metadata = files[`02_metadata.md`].content;

      let metadataHead = metadata.split(preference+": ")[0];
      let metadataFoot = metadata.split(preference+": ")[1].split(/\n/).slice(1).join("\n");

      let metadataContent = metadataHead + preference +": " + updateTo + "\n" + metadataFoot;

      files[`02_metadata.md`] = {
        filename: `02_metadata.md`,
        content: metadataContent
      };

      return this.client.gists.update({
        gist_id: memoGistId,
        files: files
      });
    })
  }
}

const _gh = new Github();
export default _gh;
