//var express = require('express');
var http = require('http');
var app = express();

http.createServer(function (request,response){
	response.writeHead(200,{'Content-Type': 'test/plain'});
}).listen(8124);
	
app.get('/',function(req,res){
	res.sendFile(__dirname+'index.html');
});

console.log('Server running at http://127.0.0.1:8124');
