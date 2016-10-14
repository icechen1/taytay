var Particle = require('particle-api-js');
var particle = new Particle();

var token;
var deviceId;

var DIRECTIONS = {
  left: 'left',
  right: 'right',
  forward: 'forward',
  backward: 'backward',
  stop: 'stop'
};

var INTENSITIES = {
  LOW: '3',
  HIGH: '230',
  MEDIUMHIGH: '200',
  MEDIUMLOW: '170'
};

var PORTS = {
  left: 'D2',
  right: 'D3'
}

var lock = false;

function init() {
  return particle.login({username: 'jonathan_boulanger@hotmail.com', password: 'BigPark'}).then(
    function(data){

      deviceId = '3c0034000447343337373739';
      token = data.body.access_token;

      return Promise.resolve(move);

    },
    function(err) {
      console.log('API call completed on promise fail: ', err);
    }
  );
}

function move(direction) {
  if (!lock) {
    lock = true;
    var analogSignals = getAnalogSignalsFromDirection(direction);
    var movePromiseFactory = function(analogSignal) {
      return particle.callFunction({ deviceId: deviceId, name: 'analogWrite', argument: analogSignal, auth: token});
    };

    Promise.all(analogSignals.map(movePromiseFactory)).then(function(data) {
      lock = false;
      console.log('Moving ' + direction + '!');
    });
  }
}

function getAnalogSignalsFromDirection(direction) {
  switch (direction) {
    case DIRECTIONS.forward:
      return [ PORTS.left+',234', PORTS.right+',56'];
      break;
    case DIRECTIONS.backward:
      return [ PORTS.left+','+INTENSITIES.HIGH, PORTS.right+','+INTENSITIES.LOW ];
      break;
    case DIRECTIONS.left:
      return [ PORTS.left+','+INTENSITIES.LOW, PORTS.right+','+INTENSITIES.LOW ];
      break;
    case DIRECTIONS.right:
      return [ PORTS.left+','+INTENSITIES.HIGH, PORTS.right+','+INTENSITIES.HIGH ];
      break;
    case DIRECTIONS.stop:
      return [ PORTS.left+',0', PORTS.right+',0' ];
      break;
    default:
      return [ 'shit' ];

  }
}

module.exports = init;
