
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
var ident = false, connected = false;


function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function getID() {
	if (!ident) {
		ident = "client_" + makeid();
		console.log("send id", ident);
	}
	return ident;
}



sp.on('data', function(input) {

	if (connected) {
		// console.log(input);
	    var ttype = input.substr(0,1);
	    var value = input.substr(1);
	    var message;
	    if (ttype == "A") {
	        message = { type: "device" }, { verb: "sensed" }, { type: "audio", id: value, view: "scale"};
	    } else if (ttype == "L") {
	        message = { type: "device" }, { verb: "sensed" }, { type: "light", id: value, view: "scale"};
	    } else if (ttype == "r") {
	        message = { type: "device" }, { verb: "sensed" }, { type: "range", id: value, view: "cm"};
	    } else if (ttype == "R") {
	        message = { type: "device" }, { verb: "sensed" }, { type: "range", id: value, view: "cm"};
	    } else if (ttype == "m") {
	        message = { type: "device" }, { verb: "sensed" }, { type: "motion", id: value, view: "start"};
	    } else if (ttype == "M") {
	        message = { type: "device" }, { verb: "sensed" }, { type: "motion", id: value, view: "end"};
	    }
	    if (message != null) {
	    	ws.send(JSON.stringify({userName: getID(),data: message}));
	    }
	}
	    

});


ws.on('open', function() {
    if(!ident) {
      ident = "client_" + makeid();
      ws.send(JSON.stringify({userName: getID(),data: "foo_" + makeid() + "_dynamic"}));
    }
});
ws.on('message', function(message) {
	console.log("send id", getID());
	console.log("recieve message", message);
});

// EOF