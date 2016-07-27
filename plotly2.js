var serialport = require('serialport'),
    plotly = require('plotly')('revmecha','cyuheqx155'),
    token = '786yfy9ilv';

var portName = '/dev/ttyACM0';
var sp = new serialport.SerialPort(portName,{
    baudRate: 115200, //9600,
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

function parseSensorData(type, value) {

    switch(type) {
        case "A":
            return { x : getDateString(), y : value, name: "audio" };
            break;
        case "L":
            return { x : getDateString(), y : value, name: "light" };
            break;
        case "r":
            return { x : getDateString(), y : value, name: "range" };
            break;
        case "R":
            return { x : getDateString(), y : value, name: "range" };
            break;
        case "m":
            return { x : getDateString(), y : value, name: "motion" };
            break;
        case "M":
            return { x : getDateString(), y : value, name: "motion" };
            break;
        default:
            return false;
    }
}

var initdata = [{x:[], y:[], stream:{token:token, maxpoints: 500}}];
var initlayout = {fileopt : "extend", filename : "sensor-test-newest"};
var streams = [];

plotly.plot(initdata, initlayout, function (err, msg) {
    if (err) return console.log(err)

    console.log(msg);

    function makeStream(dataObj) {

        if (dataObj.name && !streams[dataObj.name]) {
            streams[dataObj.name] = plotly.stream(token, function (err, res) {
                console.log(err, res);
            });
        }
        return streams[dataObj.name];

    }

    // var stream = plotly.stream(token, function (err, res) {
    //     console.log(err, res);
    // });

    sp.on('data', function(input) {
        // if(isNaN(input) || input > 1023) return;
        var ttype = input.substr(0,1);
        var value = input.substr(1);

        var loadData = parseSensorData(ttype, value);



        if (loadData) {
            var stream = makeStream(loadData);
            var streamObject = JSON.stringify( {x: loadData.x, y: loadData.y, name: loadData.name} );
            console.log(streamObject);
            stream.write(streamObject+'\n');
        }

            
    });
});

