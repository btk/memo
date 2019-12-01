import API from './api';
import LocalDB from './localdb';
import makeid from './makeid';

class Markdown {
  async getSheetMarkdown(sheetId){
    let sheet = await API.getSheet(sheetId);

    let sheetMarkdown = `---
id: ${sheet.id}
title: ${sheet.title}
active: ${sheet.active}
created_at: ${sheet.created_at}
accessed_at: ${sheet.accessed_at}
---
`;
    let currentDate = "";
    sheet.lines.forEach(line => {
      if(currentDate != line.date){
        currentDate = line.date;
        sheetMarkdown += `{{date: ${line.date}}}

`;
      }
      sheetMarkdown += `${line.text}

`;
    });
    return sheetMarkdown;
  }

  async saveMarkdownSheet(files){
    let filesArray = Object.values(files);

    for (var i = 0; i < filesArray.length; i++) {
      let file = filesArray[i];

      if(file.filename != "01_usememo.md" && file.filename != "02_metadata.md"){

        let fileMetadataYaml = file.content.split("---")[1];
        let fileContent = file.content.split("---").slice(2).join("");

        let fileMetadata = {
          id: Number(fileMetadataYaml.split("id: ")[1].split(/\n/)[0]),
          title: fileMetadataYaml.split("title: ")[1].split(/\n/)[0],
          active: Number(fileMetadataYaml.split("active: ")[1].split(/\n/)[0]),
          created_at: Number(fileMetadataYaml.split("created_at: ")[1].split(/\n/)[0]),
          accessed_at: Number(fileMetadataYaml.split("accessed_at: ")[1].split(/\n/)[0])
        };

        let fileParagraphs = fileContent.split(/\n\n/);
        await LocalDB.insert("sheet", {
          title: fileMetadata.title,
          active: fileMetadata.active,
          created_at: fileMetadata.created_at,
          accessed_at: fileMetadata.accessed_at
        });

        let newSheet = await LocalDB.select("sheet", null, {
          by: "id",
          type: "desc"
        }, 1);

        let sheetId = newSheet[0].id;

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
      }
    }
    return true;
  }
}

const _md = new Markdown();
export default _md;
