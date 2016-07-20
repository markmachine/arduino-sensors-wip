
var serialport = require('serialport');
var portName = '/dev/ttyACM0';
var sp = new serialport.SerialPort(portName, {
    baudRate: 115200,//9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.readline("\r\n")
});
var HOST = 'ws://secure-brushlands-96373.herokuapp.com';
var WebSocket = require('ws')
  , ws = new WebSocket(HOST);
var ident = false;


function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}



sp.on('data', function(input) {
    console.log(input);
    var ttype = input.substr(0,1);
    var value = input.substr(1);
    if (ttype == "A") {
        console.log("AUDIO", { type: "device" }, { verb: "sensed" }, { type: "audio", id: value, view: "scale"});
    } else if (ttype == "L") {
        console.log("LIGHT", { type: "device" }, { verb: "sensed" }, { type: "light", id: value, view: "scale"});
    } else if (ttype == "r") {
        console.log("range", { type: "device" }, { verb: "sensed" }, { type: "range", id: value, view: "cm"});
    } else if (ttype == "R") {
        console.log("RANGE", { type: "device" }, { verb: "sensed" }, { type: "range", id: value, view: "cm"});
    } else if (ttype == "m") {
        console.log("motion", { type: "device" }, { verb: "sensed" }, { type: "motion", id: value, view: "start"});
    } else if (ttype == "M") {
        console.log("MOTION", { type: "device" }, { verb: "sensed" }, { type: "motion", id: value, view: "end"});
    }

});


// ws.on('open', function() {
//     ws.send('something');
// });
// ws.on('message', function(message) {
//     console.log('received: %s', message);
//     if(!ident) {
//       ident = "client_" + makeid();
//       console.log("send id");
//       ws.send(JSON.stringify({userName:ident,data: "foo_" + makeid() + "_dynamic"}));

//     } else {
      
//     }
// });