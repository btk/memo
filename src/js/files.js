import API from './api';
import LocalDB from './localdb';
import Markdown from './markdown';
import makeid from './makeid';
import { saveAs } from 'file-saver';

class Files {
  listenFileDrop(){
    let dropTimer = 0;
    let root = document.getElementById('root');
    let cover = document.getElementById('cover');

    root.ondragover = function() {
      clearTimeout(dropTimer);
      dropTimer = setTimeout(function() {
          cover.className = "cover";
          return false;
      }, 1000);

      if(cover.className != "cover coverActive"){
        cover.className = "cover coverActive";
      }
      return false;
    };

    cover.ondragleave = function() {
      clearTimeout(dropTimer);
      cover.className = "cover";
      return false;
    };

    root.ondragend = function() {
      clearTimeout(dropTimer);
      cover.className = "cover";
      return false;
    };

    root.ondrop = (e) => {
        clearTimeout(dropTimer);
        e.preventDefault();
        if(e.dataTransfer.files.length){
          var file = e.dataTransfer.files[0],
              reader = new FileReader();

          reader.onload = (event) => {
            API.event.emit("importStarted", file.name);
            if(file.name.endsWith(".txt") || file.name.endsWith(".md") || file.name.endsWith(".markdown")){
              this.importFile(file.name, file.lastModified, event.target.result).then(added => {
                API.event.emit("sheet", added);
                API.event.emit("importEnded");
                cover.className = "cover";
              });
            }else{
              alert("File should be a plaintext format (.txt, .md or .markdown) in order to import in Memo");
              cover.className = "cover";
            }
          };
          reader.readAsText(file);
        }
        return false;
    };

  }

  async importFile(fileName, unixTime, text){

    if(text[text.length - 1] == "\r" || text[text.length - 1] == "\n"){
      text = text.substr(0, text.length-1)
    }

    let fileParagraphs;
    // n+r is usually typed in a windows, n+n is default
    if(text.includes("\n\r")){
      fileParagraphs = text.split(/\n\r/);
    }else{
      fileParagraphs = text.split(/\n\n/);
    }

    await LocalDB.insert("sheet", {
      title: "📃 "+fileName,
      active: 1,
      created_at: Math.floor(unixTime / 1000),
      accessed_at: Math.round((new Date()).getTime() / 1000)
    });

    let newSheet = await LocalDB.select("sheet", null, {
      by: "id",
      type: "desc"
    }, 1);

    let sheetId = newSheet[0].id;

    let today = new Date();
    let lineDate = String(today.getDate()).padStart(2, '0') + "/" + String(today.getMonth() + 1).padStart(2, '0') + "/" + today.getFullYear();

    let linePos = 0;
    for (var j = 0; j < fileParagraphs.length; j++) {
      let p = fileParagraphs[j];

      if(p[p.length - 1] == "\r" || p[p.length - 1] == "\n"){
        p = p.substr(0, p.length-1)
      }
      if(p[0] == "\r" || p[0] == "\n"){
        p = p.substr(1)
      }
      if(p != ""){
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
    API.addToStaging(sheetId);
    return sheetId;
  }

  exportFile(sheetId) {
    try {
        var isFileSaverSupported = !!new Blob;
    } catch (e) {
      alert("Your device doesn't support file saver!");
    }

    return Markdown.getSheetMarkdown(sheetId, true).then((sheet) => {
      let markdownText = sheet.text;

      var blob = new Blob([markdownText], {
        type: "text/plain;charset=utf-8"
      });

      saveAs(blob, sheet.title + '.md');
    });
  }

}

const _files = new Files();
export default _files;
