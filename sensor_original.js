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
            //console.log(input);
            var ttype = input.substr(0,1);
            var value = input.substr(1);
            if (ttype == "A") {
                e.create({ type: "device" }, { verb: "sensed" }, { type: "audio", id: value, view: "scale"});
            } else if (ttype == "L") {
                e.create({ type: "device" }, { verb: "sensed" }, { type: "light", id: value, view: "scale"});
            } else if (ttype == "r") {
                e.create({ type: "device" }, { verb: "sensed" }, { type: "range", id: value, view: "cm"});
            } else if (ttype == "R") {
                e.create({ type: "device" }, { verb: "sensed" }, { type: "range", id: value, view: "cm"});
            } else if (ttype == "m") {
                e.create({ type: "device" }, { verb: "sensed" }, { type: "motion", id: value, view: "start"});
            } else if (ttype == "M") {
                e.create({ type: "device" }, { verb: "sensed" }, { type: "motion", id: value, view: "end"});
            }
        });
}

module.exports = arduino;