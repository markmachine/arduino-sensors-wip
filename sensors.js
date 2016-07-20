var GPIO = require('onoff').Gpio;
var serialport = require('serialport'),
    plotly = require('plotly')('revmecha','cyuheqx155'),
    token = '786yfy9ilv';

var pir_sensor = new GPIO(17, 'in', 'both');
var audio_sensor = new GPIO(27, 'in', 'both');

console.log("running...");
function exit() {
  pir_sensor.unexport();
  console.log("exiting.");
  audio_sensor.unexport();
  process.exit();
}




var portName = '/dev/dev/ttyACM0';
var sp = new serialport.SerialPort(portName,{
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.readline("\r\n")
});

// helper function to get a nicely formatted date string
function getDateString() {
    var time = new Date().getTime();
    // 32400000 is (GMT+9 Japan)
    // for your timezone just multiply +/-GMT by 36000000
    var datestr = new Date(time +32400000).toISOString().replace(/T/, ' ').replace(/Z/, '');
    return datestr;
}

var initdata = [{x:[], y:[], stream:{token:token, maxpoints: 500}}];
var initlayout = {fileopt : "extend", filename : "sensor-test"};

var stream;

function streamData(input) {
  var streamObject = JSON.stringify({ x : getDateString(), y : input });
  console.log(streamObject);
  stream.write(streamObject+'\n');
}

plotly.plot(initdata, initlayout, function (err, msg) {
    if (err) return console.log(err)

    console.log(msg);
    stream = plotly.stream(token, function (err, res) {
        console.log(err, res);
    });

    sp.on('data', function(input) {
        if(isNaN(input) || input > 1023) return;

        streamData(input);

        // var streamObject = JSON.stringify({ x : getDateString(), y : input });
        // console.log(streamObject);
        // stream.write(streamObject+'\n');
    });
});


// define the callback function
function pirState(err, state) {

  if (err) {
    console.log("err: " + err);
    throw err;
  }
  if(state == 1) {
    // turn LED on
    console.log("PIR detected");
    streamData(state);
    //led1.writeSync(1);
  } else {
    // turn LED off
    //console.log("PIR off");
    //led1.writeSync(0);
  }
}
function audioState(err, state) {

  if (err) {
    console.log("err: " + err);
    throw err;
  }
  if(state == 1) {
    // turn LED on
    console.log("audio detected");
    //elapsedTime();
    streamData(state);
    //led2.writeSync(1);
  } else {
    // turn LED off
    //console.log("audio off");
    //led2.writeSync(0);
  }
}

// pass the callback function to the
// as the first argument to watch()
pir_sensor.watch(pirState);
audio_sensor.watch(audioState);
process.on('SIGINT', exit);

