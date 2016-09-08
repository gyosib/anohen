var express = require('express');
var http = require('http');
var app = express();
var fs = require('fs');
var io = require('socket.io').listen(server);

var server = http.createServer();
server.on('request',doRequest);
server.listen(8124);
console.log('Server running!');

function doRequest(req,res){
	fs.readFile('./index.html','UTF-8',
		function(err,data){
			res.writeHead(200, {'Content-Type':'text/html'});
			res.write(data);
			res.end();
		});
}
io.sockets.on('connection',function(socket){
	console.log("connection");
socket.on('connected',function(data){
	console.log("data");
	io.sockes.emit('publish',{value:data.value});
});
});
