var GoogleSpreadsheet = require("google-spreadsheet");
// var googleApiInfo = require('3a6885fba6e7.json');


var my_sheet = new GoogleSpreadsheet('1DEv084v7VYX3kzBs5dZPAYoE9omGCZh-zY4wQQv23-Y');

my_sheet.getRows( 1, function(err, row_data){
    console.log( 'pulled in '+row_data.length + ' rows');
});

my_sheet.useServiceAccountAuth(require('./3a6885fba6e7.json'));
