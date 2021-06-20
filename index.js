const fs = require('fs')
var http = require('http');

var schedule = require('node-schedule');

let getData = (callback) => {
    let url = 'http://192.168.20.55:2025/getSystemData';
    let request = http.request(url, response => {
        let rawData = '';
        response.on('data', part => { rawData += part; });
        response.on('end', () => {
            callback(rawData.toString())
        });
    });
    request.end();
}


let writeData = (rawData) => {
  let jsonData = JSON.parse(rawData);
  let date = new Date();
  let line = new Intl.DateTimeFormat('en-AU').format(date) + ',' + date.getHours() + ':' + date.getMinutes() + ',' +
      jsonData.aircons.ac1.zones.z01.measuredTemp +
      ',' + jsonData.aircons.ac1.zones.z02.measuredTemp +
      ',' + jsonData.aircons.ac1.zones.z03.measuredTemp + '\n';
  fs.appendFileSync('myair.csv',line, 'utf8');
}

var j = schedule.scheduleJob('*/15 * * * *', function() { //run every hour at minute 1
    console.log('Monitoring myAir temps.');
    getData(writeData);
});
