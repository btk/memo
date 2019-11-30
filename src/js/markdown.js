import API from './api';

class Markdown {
  async getSheetMarkdown(sheetId){
    let sheet = await API.getSheet(sheetId);

    console.log(sheet);
    let sheetMarkdown = `---
id: ${sheet.id}
title: ${sheet.title}
active: ${sheet.active}
created_at: ${sheet.created_at}
accessed_at: ${sheet.accessed_at}
---
`;
    sheet.lines.forEach(line => {
      sheetMarkdown += `${line.text}

`;
    });
    return sheetMarkdown;
  }
}

const _md = new Markdown();
export default _md;
