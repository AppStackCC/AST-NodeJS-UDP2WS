/**
 * Receive UDP and forward to websocket client 
 * Credit : http://www.siamhtml.com/real-time-chat-with-node-js-and-socket-io/
 */

var express = require('express');
var app = express();
var path = require('path');

var ws_port = 8081;
var udp_port = 33333;

// ----------------------- UDP [Receive from esp8266] ------------------------
var dgram = require('dgram');
var udp_server = dgram.createSocket('udp4');

udp_server.on('listening', function () {
    var address = udp_server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

udp_server.on('message', function (message, remote) {
    console.log("UDP Receive " + remote.address + ':' + remote.port +' - ' + message);
    io.emit('data', message);   // Forward to websockket
});

udp_server.on("error", function (err) {
  console.log("udp server error:\n" + err.stack);
  udp_server.close();
});

udp_server.bind(udp_port);



// ----------------------- Web Socket  ------------------------
var ws_server = app.listen(ws_port, function() {
    console.log('Web Socket Listening on port: ' + ws_port);
});

var io = require('socket.io').listen(ws_server);

app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

io.on('connection', function(socket) {
    socket.on('data', function(data) {
        io.emit('data', data);  // Forward data to another ws client
    });
});