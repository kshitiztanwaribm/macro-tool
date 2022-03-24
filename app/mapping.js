const fs = require('fs');
const ss = require('string-similarity');

module.exports = {
    perform: function (errors) {
        let mappings = getErrorMappings();
        errors.rows.forEach(function (error) {
            let actualError = error['Errors'];
            // let bestScore = 0;
            let mappedRes = {portlet: null, classification: null, category: null, resolution: null};
            mappings.forEach(function (mapping) {
                if (actualError.toLowerCase() === mapping['error'].toLowerCase()) mappedRes = mapping;
                // let simScore = ss.compareTwoStrings(actualError.toLowerCase(), mapping['error'].toLowerCase());
                // if (simScore > bestScore) {
                //     bestScore = simScore;
                //     mappedRes = mapping;
                // }
            });
            error['Portlet'] = mappedRes.portlet;
            error['Classification'] = mappedRes.classification;
            error['Category'] = mappedRes.category;
            error['Resolution'] = mappedRes.resolution;
        });
    }
}

function getErrorMappings() {
    let mappings = [];
    let data = fs.readFileSync('./mappings.csv', 'utf8');
    data = data.split('\r\n').slice(1, data.length);
    data.forEach(function (elem) {
        let mapping = elem.split('","');
        mappings.push({
            error: mapping[0].replace(/"/g, ''),
            portlet: mapping[1].replace(/"/g, ''),
            classification: mapping[2].replace(/"/g, ''),
            category: mapping[3].replace(/"/g, ''),
            resolution: mapping[4].replace(/"/g, '')
        })
    });
    return mappings;
}