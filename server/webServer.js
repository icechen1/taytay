var path = require('path');
var express = require('express');

function runWebServer(app) {
  app.use(express.static(__dirname + '/static'));
  app.get('/', function(req, res){
    res.sendfile('static/index.html');
  });
  app.get('/port', function(req, res){
    res.send(process.env.PORT);
  });
}

module.exports = runWebServer;
