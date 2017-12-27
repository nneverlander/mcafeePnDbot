var bittrex = require('node-bittrex-api');

bittrex.options({
  'apikey': '',
  'apisecret': '',
  'baseUrl': 'https://bittrex.com/api/v1.1'
});

var myArgs = process.argv.slice(2);
var last = myArgs[0];
var currency = myArgs[1];
var market = 'BTC-' + currency;

placesells();

function placesells() {
  bittrex.getbalance({
    currency: currency
  }, function(data, err) {
    if (err) {
      console.log('Error occured while getting available balance: ' + JSON.stringify(err));
    } else {
      var quantity = data.result.Available;
      console.log('Balance is ' + quantity);
      var l60 = 1.6 * last;
      var l70 = 1.7 * last;
      var l80 = 1.8 * last;
      var l90 = 1.9 * last;

      var q60 = 0.2 * quantity;
      var q70 = 0.4 * quantity;
      var q80 = 0.3 * quantity;
      var q90 = 0.1 * quantity;
      selllimit(q60, l60);
      selllimit(q70, l70);
      selllimit(q80, l80);
      selllimit(q90, l90);
    }
  });
}

function selllimit(quantity, rate) {
  bittrex.selllimit({
    market: market,
    quantity: quantity,
    rate: rate
  }, function(data, err) {
    if (err) {
      console.log('Error occured while placing sell limit order: ' + JSON.stringify(err));
    } else {
      console.log('Sold ' + quantity + ' at ' + rate + ' ' + data);
    }
  });
}
