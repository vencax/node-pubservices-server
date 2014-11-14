var request = require('request');


omittedVarSymbs = JSON.parse(process.env.OMITTED_VAR_SYMBS || '[]');
var fioRest = 'https://www.fio.cz/ib_api/rest/';
var url = fioRest + "last/" + process.env.BANKTOKEN + "/transactions.json";


function processFioData(data, done) {
  var trList = data.accountStatement.transactionList;
  var rv = [];

  if(trList === null) {
    return;
  }
  trList.transaction.forEach(function(l) {
    if(l.column5) {
      var varSym = l.column5.value;
      var desc = l.column16 ? l.column16.value : '';
      var date = l.column0.value;
      var amount = l.column1.value;

      if(amount > 0 && omittedVarSymbs.indexOf(varSym) === -1) {
        rv.push({uid: varSym, amount: amount, date: date, desc: desc});
      }
    }
  });

  done(rv);
};


module.exports = function(done) {

  //TODO: redo with streaming
  var c = '';

  request.get(url)
  .on('response', function(response) {
    if (response.statusCode === 200) {
    }
  })
  .on('data', function(chunk) {
    c = c + chunk.toString();
  })
  .on('end', function() {
    var parsed = JSON.parse(c);
    processFioData(parsed, done)
  });

};
