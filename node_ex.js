var http = require('http');

http.createServer(function (request,response){
	response.writeHead(200,{'Content-Type': 'test/plain'});
	response.end('Hello World\n');
}).listen(8124);

console.log('Hi! Server running at http://127.0.0.1:8124');
