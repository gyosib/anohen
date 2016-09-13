var IP = '192.168.0.2';
var HTTP_PORT = 3000;
var HTTPS_PORT = 3100;

var https = require("https");
var http = require("http");
var socketio = require("socket.io");
var fs = require("fs");
var express = require("express");
var app = express();
var apps = express();
var constants = require('constants');

/*var server = http.createServer(function(req, res) {
     res.writeHead(200, {"Content-Type":"text/html"});
     var output = fs.readFileSync("./index.html", "utf-8");
     res.end(output);
     readfile(req,res,"html","index.html");
}).listen(process.env.VMC_APP_PORT || 3000);*/
var options = {
	key:fs.readFileSync('server.key'),
	cert:fs.readFileSync('server.crt'),
	/*ciphers:[
		'ECDHE-RSA-AES256-SHA384',
		'DHE-RSA-AES256-SHA384',
		'ECDHE-RSA-AES256-SHA256',
		'DHE-RSA-AES256-SHA256',
		'EDDHE-RSA-AES128-SHA256',
		'DHE-RSA-AES128-SHA256',
		'!RC4',
		'HIGH',
		'!MD5',
		'!aNULL',
		'!EDH'
	].join(':'),*/
	honorCipherOrder:true,
	secureProtocol:'SSLv23_method',
	secureOptions:(constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_SSLv2)
};

var servers = https.createServer(options,apps);
servers.listen(HTTPS_PORT);
var server = http.createServer(app);
server.listen(HTTP_PORT);
apps.get('/',function(req,res){
	res.sendfile(__dirname+'/index.html');
});
app.get('/',function(req,res){
	res.sendfile(__dirname+'/index.html');
});

app.use('/send',express.static('send'));
apps.use('/send',express.static('send'));
app.use('/plugin',express.static('plugin'));
apps.use('/plugin',express.static('plugin'));

var io = socketio.listen(server);
 
io.sockets.on("connection", function (socket) {
  // メッセージ送信（送信者にも送られる）
  socket.on("C_to_S_message", function (data) {
    io.sockets.emit("S_to_C_message", {value:data.value});
  });
 
  // ブロードキャスト（送信者以外の全員に送信）
  socket.on("C_to_S_broadcast", function (data) {
    socket.broadcast.emit("S_to_C_message", {value:data.value});
  });
 
  // 切断したときに送信
  socket.on("disconnect", function () {
//    io.sockets.emit("S_to_C_message", {value:"user disconnected"});
  });
});


function readfile(req,res,type,name){
     res.writeHead(200, {"Content-Type":"text/"+type});
     var output = fs.readFileSync("./"+name, "utf-8");
     res.end(output);
}
