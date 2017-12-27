var bittrex = require('node-bittrex-api');

bittrex.options({
  'apikey': '',
  'apisecret': '',
  'baseUrl': 'https://bittrex.com/api/v1.1'
});

var myArgs = process.argv.slice(2);
var btc = myArgs[0];
var currency = myArgs[1];
var market = 'BTC-' + currency;


bittrex.getticker({
  market: market
}, function(data, err) {
  if (err) {
    console.log('Error occured in getting ticker ' + JSON.stringify(err));
  } else {
    var last = data.result.Last;
    console.log('Last price: ' + last);
    placebuys(last);
    placesells(last);
  }
});

function placebuys(last) {
  var l5 = 1.05 * last;
  var l10 = 1.1 * last;
  var l15 = 1.15 * last;
  var l20 = 1.2 * last;

  var quantity = (1 / l20) * btc;

  var q5 = 0.2 * quantity;
  var q10 = 0.4 * quantity;
  var q15 = 0.3 * quantity;
  var q20 = 0.1 * quantity;

  buylimit(q5, l5);
  buylimit(q10, l10);
  buylimit(q15, l15);
  buylimit(q20, l20);
}

function placesells(last) {
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

function buylimit(quantity, rate) {
  bittrex.buylimit({
    market: market,
    quantity: quantity,
    rate: rate
  }, function(data, err) {
    if (err) {
      console.log('Error occured while placing buy limit order: ' + JSON.stringify(err));
    } else {
      console.log('Bought ' + quantity + ' at ' + rate + ' ' + data);
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
