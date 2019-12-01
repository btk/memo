import Octokit from '@octokit/rest';
import API from './api';
import Markdown from './markdown';

class Github {
  init(token){
    this.client = new Octokit({
      auth: "token "+token
    })

    if(!API.user.gist_id){
      return this.setup();
    }else{
      return true;
    }
  }

  list(){
    return this.client.gists.list().then(gists => {
      console.log(gists);
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
---

Please don't edit this file, as this is vital for cache validation and version control.
`
    };

    return this.client.gists.create({
      files
    }).then(res => {
      return API.setGistId(res.data.id);
    })
  }

  fetch(){
    return this.client.gists.get({gist_id: API.user.gist_id}).then(gist => {
      let files = gist.data.files;
      return API.truncateDb().then(res => {
        return Markdown.saveMarkdownSheet(files);
      })
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

        for (var i = 0; i < stagedArray.length; i++) {
          let stagedSheetId = stagedArray[i];
          let markdownContent = await Markdown.getSheetMarkdown(stagedSheetId);

          files[`sheet-${stagedSheetId}.md`] = {
            filename: `sheet-${stagedSheetId}.md`,
            content: markdownContent
          };
        }

        console.log(files)

        return this.client.gists.update({
          gist_id: memoGistId,
          files: files
        });
      })

    }else {
      return "no files on staging";
    }
  }
}

const _gh = new Github();
export default _gh;
