var app = require('express')();
var http = require('http').Server(app);
var particle = require('./particle');

particle().then(function(move) {
  require('./webServer')(app);
  require('./socketServer')(http, move);
  http.listen(process.env.PORT||3000, function () {
    console.log('SumoBot app listening on port 3000!');
  });
});
