const express = require('express');
const app = express();
app.use(express.static(__dirname + '/public'));
upload = require('express-fileupload');
app.use(upload());


app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/upload', function (req, res) {
  let resObj = {
    cols: [],
    rows: []
  }
  try {
    let csvData = req.files.uploader.data.toString('utf8');
    csvData = csvData.split('\r\n');

    //set cols
    csvData[1].replace(/"/g, '').split(',').forEach(function (elem) {
      resObj.cols.push({columnName: elem});
    });

    //set rows
    if (csvData.length > 2) {
      csvData = csvData.slice(2, csvData.length);
      csvData.forEach(function (elem) {
        let row = elem.replace(/"/g, '').split(',')
        let obj = {}
        for (let i = 0; i < resObj.cols.length; i++) {
          obj[resObj.cols[i].columnName] = row[i];
        }
        resObj.rows.push(obj);
      });
    }

    res.status(200);
  } catch (e) {
    res.status(500);
  }
  return res.send(resObj);
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('app listening on port ' + port);
});