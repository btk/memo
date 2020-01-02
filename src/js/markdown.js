import API from './api';
import LocalDB from './localdb';
import makeid from './makeid';

class Markdown {
  async getSheetMarkdown(sheetId, beautified){
    let sheet = await API.getSheet(sheetId);
    if(sheet == "removed"){
      return "";
    }

    let sheetMarkdown = "";

    if(beautified){
      sheetMarkdown = `# ${sheet.title}

`;
    }else{
      sheetMarkdown = `---
id: ${sheet.id}
title: ${sheet.title}
active: ${sheet.active}
created_at: ${sheet.created_at}
accessed_at: ${sheet.accessed_at}
---
`;
    }

    let currentDate = "";
    sheet.lines.forEach(line => {
      if(currentDate != line.date){
        currentDate = line.date;

        if(beautified){
          sheetMarkdown += `${line.date}

`;
        }else{
          sheetMarkdown += `{{date: ${line.date}}}

`;
        }
      }
      sheetMarkdown += `${line.text}

`;
    });
    if(beautified){
      return {
        title: sheet.title,
        text: sheetMarkdown
      };
    }else{
      return sheetMarkdown;
    }
  }

  // removes and adds a sheet if not valid
  async saveMarkdownSheet(file){
    let fileMetadataYaml = file.content.split("---")[1];
    let fileContent = file.content.split("---").slice(2).join("---");

    let fileMetadata = {
      id: Number(fileMetadataYaml.split("id: ")[1].split(/\n/)[0]),
      title: fileMetadataYaml.split("title: ")[1].split(/\n/)[0],
      active: Number(fileMetadataYaml.split("active: ")[1].split(/\n/)[0]),
      created_at: Number(fileMetadataYaml.split("created_at: ")[1].split(/\n/)[0]),
      accessed_at: Number(fileMetadataYaml.split("accessed_at: ")[1].split(/\n/)[0])
    };

    let localSheet = await LocalDB.select("sheet", {id: fileMetadata.id }, 1);
    let removeAddAction = false;
    if(localSheet.length == 0) {
      removeAddAction = true;
    }else{
      if(localSheet[0].accessed_at != fileMetadata.accessed_at){
        removeAddAction = true;
      }
    }

    if(removeAddAction){
      //delete
      let ey = await LocalDB.delete("sheet", {id: fileMetadata.id});
      await LocalDB.delete("line", {sheet_id: fileMetadata.id});

      //insert
      let fileParagraphs = fileContent.split(/\n\n/);
      await LocalDB.insert("sheet", {
        id: fileMetadata.id,
        title: fileMetadata.title,
        active: fileMetadata.active,
        created_at: fileMetadata.created_at,
        accessed_at: fileMetadata.accessed_at
      });

      let sheetId = fileMetadata.id;
      let lineDate = "";
      let linePos = 0;
      for (var j = 0; j < fileParagraphs.length; j++) {
        let p = fileParagraphs[j];

        if(p != ""){
          if(p.includes("{{date: ")){
            lineDate = p.split("{{date: ")[1].split("}}")[0];
          }else{
            let lineKey = makeid(5);
            await LocalDB.insert("line", {
              sheet_id: sheetId,
              line_key: lineKey,
              date: lineDate,
              text: p,
              pos: linePos
            });

            linePos++;
          }
        }
      }

      if(linePos == 0){
        let newLineKey = makeid(5);
        await LocalDB.insert("line", {
          sheet_id: sheetId,
          line_key: newLineKey,
          date: lineDate,
          text: "",
          pos: 0
        });
      }
    }
    return true;
  }

  async removeCloudDeletedFiles(filesArray){
    console.log("Removing cloud deleted files...");
    let fileIdArray = []
    filesArray.forEach(file => {
      if(file.filename.includes("-")){
        fileIdArray.push(Number(file.filename.split("-")[1].split(".")[0]));
      }
    })

    let localSheets = await LocalDB.select("sheet");

    let sheetsToRemove = localSheets.filter(sheet => {
      return !fileIdArray.includes(sheet.id);
    })

    for (var i = 0; i < sheetsToRemove.length; i++) {
      await LocalDB.delete("sheet", {id: sheetsToRemove[i].id});
      await LocalDB.delete("line", {sheet_id: sheetsToRemove[i].id});
    }
  }

  async updateMarkdownSheets(files){
    let filesArray = Object.values(files).sort((a,b) => {
      a = Number(a.filename.split(".")[0].split("-")[1]);
      b = Number(b.filename.split(".")[0].split("-")[1]);
      return (a > b) ? 1 : ((b > a) ? -1 : 0);
    });

    for (var i = 0; i < filesArray.length; i++) {
      let file = filesArray[i];

      if(file.filename != "01_usememo.md" && file.filename != "02_metadata.md"){
        await this.saveMarkdownSheet(file);
      }

      if(file.filename == "02_metadata.md"){
        // set the local update validator to the cloud one.
        let accessed_at = Number(file.content.split("accessed_at: ")[1].split(/\n/)[0]);
        API.setData("updated_at", accessed_at);
      }
    }


    let localSheetCount = await LocalDB.count("sheet");
    // -2 for desc and metadata sheets
    if(localSheetCount != (filesArray.length - 2)){
      await this.removeCloudDeletedFiles(filesArray);
    }

    return true;
  }

  async offlineSetup(){
    let file = {
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
\t- There are separated paragraphs
\t- A double new line creates a paragraph
\t- Every paragraph has its own insights ✨
\t- Enable which insights you want in addons 🧩
\t- Use offline, push your changes to cloud later

Now, archive or remove this sheet or create a new sheet from sidebar sheets tab and start taking notes.

Also share your experience with memo over ProductHunt.
Using this link: https://producthunt.com/posts/memo-plain-smart-notes

Again, welcome to memo! 😊`
    };
    API.addToStaging(1);
    return await this.saveMarkdownSheet(file);
  }
}

const _md = new Markdown();
export default _md;
