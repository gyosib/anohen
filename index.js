//MACRO
var IP = '192.168.0.5';
var HTTP_PORT = 3000;
var HTTPS_PORT = 3100;

//Requires
var https = require("https");
var http = require("http");
var socketio = require("socket.io");
var fs = require("fs");
var express = require("express");
var app = express();
var apps = express();
var constants = require('constants');
var mysql = require('mysql');
var mongoose_usr = require('mongoose');
var mongoose_msg = require('mongoose');

//MongoDB setting
//**********
var UsrSchema = new mongoose_usr.Schema({
	id:Number,
	name:String,
	pass:String,
	x:Number,
	y:Number
});
var MsgSchema = new mongoose_msg.Schema({
	id:Number,
	date:Date,
	who:String,
	msg:String
});

mongoose_usr.Promise = global.Promise;
mongoose_msg.Promise = global.Promise;
var usrmode = mongoose_usr.createConnection("mongodb://"+"localhost"+":27017/usr",function(err){
	if(err){
		console.log(err);
	}else{
		console.log('connection success!');
	}
});
var msgmode = mongoose_msg.createConnection("mongodb://"+"localhost"+":27017/msg",function(err){
	if(err){
		console.log(err);
	}else{
		console.log('connection success!');
	}
});
var Usr = usrmode.model('usr',UsrSchema);
var Msg = msgmode.model('test_user_',MsgSchema);

var message = new Msg({
	id:0,date:new Date(),who:"administractor",msg:"test"
});
/*message.id = 0;
message.date = new Date();
message.who = "administractor";
message.msg = "test";*/
//message.comments.push({title: 'comment title', body: 'comment body'});
message.save(function(err){
	if(err) { 
		console.log(err);
	}else{
		console.log(message);
	 }
});
Msg.find({},function(err,docs){
	if(!err){
		console.log("num of item =>"+docs.length);
		for(var i=0;i<docs.length;i++){
			console.log(docs[i]);
		}
		mongoose_usr.disconnect();
		process.exit();
	}else{
		console.log("find error");
	}
});

mongoose_usr.disconnect();
mongoose_msg.disconnect();

//**********

//MySQL setting
/*
var client = mysql.createConnection(
	{user:'root',password:'Ss40mysql71132019'});
client.query('USE'+" anohen;");
*/
		
//Server Basic Setting
//**********
var options = {
	key:fs.readFileSync('server.key'),
	cert:fs.readFileSync('server.crt'),
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

//**********

//socket io connection
//**********
var io = socketio.listen(server);
 
//Defining Events
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

	//When get sendmsg request
	/*socket.on("sendmsg",function(){
		accept;
	});*/
});

//**********

//Open html file
function readfile(req,res,type,name){
     res.writeHead(200, {"Content-Type":"text/"+type});
     var output = fs.readFileSync("./"+name, "utf-8");
     res.end(output);
}

//mysql request -> return x^2+y^2
/*
var accept = client.query("select x,y,x*x+y*y from users;",function(err,result){
	//console.log(result);
});
*/
