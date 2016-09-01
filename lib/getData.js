const fs = require('fs');
const url = 'http://www.iso15022.org/MIC/ISO10383_MIC.xls';
const rp = require('request-promise-native');
const xlsx = require('xlsx');


rp({url: url, encoding: null})
  .then(res => {
      try {
        fs.writeFileSync('./lib/data.js', 'module.exports = ' , 'utf-8');
        fs.writeFileSync('./lib/mics.js', 'module.exports = ' , 'utf-8');

        const data = new Uint8Array(res);
        let arr = new Array();
        for(let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        const bstr = arr.join("");
        const workbook = xlsx.read(bstr, {type:"binary"});
        const micList = xlsx.utils.sheet_to_json(workbook.Sheets['MICs List by MIC']);


        let micObj = {};
        let mics = [];
        micList.forEach(x => {micObj[x.MIC] = x; mics.push(x.MIC)});
        fs.appendFileSync('./lib/data.js', JSON.stringify(micObj, null, 2) , 'utf-8');
        fs.appendFileSync('./lib/mics.js', JSON.stringify(mics, null, 2) , 'utf-8');
      } catch(e) {
        console.log(e);
      }
  })
  .catch(console.log);
