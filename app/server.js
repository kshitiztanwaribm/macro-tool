const express = require('express');
const app = express();

upload = require('express-fileupload');
app.use(upload());

const mapping = require('./mapping');

const passport = require('passport');
const { JWTStrategy } = require('@sap/xssec');
const xsenv = require('@sap/xsenv');
passport.use(new JWTStrategy(xsenv.getServices({uaa:{tag:'xsuaa'}}).uaa));
app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }));

app.post('/upload', checkScope, function (req, res) {
  let resObj = {
    cols: [],
    rows: []
  }
  try {
    let csvData = req.files.uploader.data.toString('utf8');
    csvData = csvData.split('\r\n');

    //set cols
    csvData[1].split(',').forEach(function (elem) {
      resObj.cols.push({columnName: elem});
    });
    resObj.cols.push({columnName: 'Portlet'});
    resObj.cols.push({columnName: 'Classification'});
    resObj.cols.push({columnName: 'Category'});
    resObj.cols.push({columnName: 'Resolution'});

    //set rows
    if (csvData.length > 2) {
      csvData = csvData.slice(2, csvData.length);
      csvData.forEach(function (elem) {
        let row = elem.split(',')
        let obj = {}
        for (let i = 0; i < resObj.cols.length - 4; i++) {
          obj[resObj.cols[i].columnName] = row[i];
        }
        resObj.rows.push(obj);
      });
    }

    //perform mapping
    mapping.perform(resObj);

    res.status(200);
  } catch (e) {
    res.status(500);
  }
  return res.send(resObj);
});

function checkScope(req, res, next) {
  if (req.authInfo.checkLocalScope('read')) {
    return next();
  } else {
    res.status(403).end('Forbidden');
  }
}

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('app listening on port ' + port);
});