var express = require('express'),
    bodyParser = require('body-parser'),
    request = require('request'),
    Cylon = require('cylon');

// Configure the server
var app = express();
app.use(bodyParser.urlencoded({ extended: false })); // tell Express to parse request bodies containing application/x-www-form-urlencoded content

function IFTTT(){
  
  var post = function(url){
    request.post(
      url,
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    });
  }

  // Add methods like this.  All Person objects will be able to invoke this
  var text = function(){
    post('https://maker.ifttt.com/trigger/text/with/key/oF1EehoMeGrVxDnKW6XQwRqyMOim6K0sCUgTvfmvYC4');
  }

  // Add methods like this.  All Person objects will be able to invoke this
  var email = function(){
    post('https://maker.ifttt.com/trigger/email/with/key/oF1EehoMeGrVxDnKW6XQwRqyMOim6K0sCUgTvfmvYC4');
  }

  var call = function(){
    post('https://maker.ifttt.com/trigger/callwith/key/oF1EehoMeGrVxDnKW6XQwRqyMOim6K0sCUgTvfmvYC4');
  }

  var tweet = function(){
    post('https://maker.ifttt.com/trigger/tweet/with/key/oF1EehoMeGrVxDnKW6XQwRqyMOim6K0sCUgTvfmvYC4');
  } 

  this.execute = function(commands){
    for (var i = 0; i < commands.length; i++){
      switch (commands[i]){
        case "text" :
          text();
          break;
        case "email" :
          email();
          break;
        case "call" :
          call();
          break;
        case "tweet" :
          tweet();
          break;
        default :
          break;
      }
    }
  }
}

// Define a class like this
function Sphero(){
  var command;
  var sphero = Cylon.robot({
    connections: {
      sphero: { adaptor: 'sphero', port: '/dev/rfcomm0' }
    },

    devices: {
      sphero: { driver: 'sphero' }
    },

    work: function(me) {
      switch (command){
        case "left":
          me.sphero.roll(60, Math.floor(180))
          break;
        case "right":
          me.sphero.roll(60, Math.floor(0))
          break;
        case "forward":
          me.sphero.roll(60, Math.floor(90))
          break;
        case "backward":
          me.sphero.roll(60, Math.floor(270))
          break;
        case "stop":
          me.sphero.roll(0, Math.floor(180));
          break;
      }
    }
  });

  this.execute = function(commands){
    for (var i = 0; i < commands.length; i++){
      switch (commands[i]){
        case "left" :
          left();
          break;
        case "right" :
          right();
          break;
        case "forward" :
          forward();
          break;
        case "backward" :
          backward();
          break;
        case "stop" :
          stop();
          break;
        default :
          break;
      }
    }
  }

  var left = function(){
    command = "left";
    sphero.start();
  }

  var right = function(){
    command = "right";
    sphero.start();
  }

  var forward = function(){
    command = "forward";
    sphero.start();
  }

  var backward = function(){
    command = "backward";
    sphero.start();
  }

  var stop = function(){
    command = "stop";
    sphero.start();
  }
}

var getDevice = function(deviceName){
  var device;
  switch (deviceName){
    case "ardrone" :
      device = new ARDrone();
      break;
    case "sphero" :     
      device = new Sphero();
      break;
    case "phillipshue" : 
      device = new PhillipsHue();
      break;
    case "rccar" : 
      device = new RCCar();
      break;
    case "ifttt" :
      device = new IFTTT();
    default:
      break;
  }
  return device;
}

// process scratch request
app.post('/uploadProgram', function (req, res){
  var data = JSON.parse(req.body.data);
  var device = getDevice(data.device);
  device.execute(data.commands);
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end("Scratchblocks Server:  Post request processed.");
});

app.get('*', function(req, res){
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end("Scratchblocks Server");
});

// listen for connection on port 8080 at domain localhost
app.listen(8080, function(){
	console.log("Listening on port 8080 ");
});