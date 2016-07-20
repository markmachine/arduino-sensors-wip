
var serialport = require('serialport');
var arduino = {};

arduino.connect = function (e) {
        var portName = '/dev/ttyACM0';
        var sp = new serialport.SerialPort(portName, {
            baudRate: 115200, //9600,
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            flowControl: false,
            parser: serialport.parsers.readline("\r\n")
        });

        sp.on('data', function(input) {
		
		var ttype = input.substr(0,1);
            	var value = input.substr(1);
		
		console.log("input", input);
	});
}

module.exports = arduino;
