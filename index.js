var http = require("http");
var socketio = require("socket.io");
var fs = require("fs");
var express = require("express");
var app = express();

/*var server = http.createServer(function(req, res) {
     res.writeHead(200, {"Content-Type":"text/html"});
     var output = fs.readFileSync("./index.html", "utf-8");
     res.end(output);
     readfile(req,res,"html","index.html");
}).listen(process.env.VMC_APP_PORT || 3000);*/
var server = http.createServer(app);
server.listen(3000);
app.get('/',function(req,res){
	res.sendfile(__dirname+'/index.html');
});

app.use('/send',express.static('send'));

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
