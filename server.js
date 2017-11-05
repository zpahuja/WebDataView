var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];
var dict = [];

server.listen(process.env.PORT || 3030);
console.log('Server Running ...');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html')
});

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);
	
	//Disconnect
	socket.on('disconnect', function(data){
		// if(!socket.username){
		// 	return
		// };
		users.splice(users.indexOf(socket.username));
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected : %s sockets connected', connections.length);
	});
	
	socket.on('send query', function(data){
		console.log(dict[socket.id]);
		io.socket.emit('new query', {qry: data, users: socket.querys})

		// for(i = 0; i < dict.length; i++){
		// 	if(dict[i].key === socket.id){
		// 		io.sockets.connected[socketid].emit('message', 'for your eyes only');
		// 	};
		// };

	});
	// socketid ------> domain name
	socket.on('change domain', function(data){
		for(i = 0; i < dict.length; i++){
			if(dict[i].key === socket.id){
				dict[i].value = data;
			};
		};
		io.sockets.connected[socket.id].emit('new domain', data)
	});


	//Send Message
	socket.on('send message', function(data){
		var mydomain;
		for(i = 0; i < dict.length; i++){
			if(dict[i].key === socket.id){
				mydomain = dict[i].value;
			};
		};
		for(i = 0; i < dict.length; i++){
			if(dict[i].value === mydomain){
				io.sockets.connected[dict[i].key].emit('new message', {msg: data, users: socket.username});
			};
		};

	});
	function updateUsernames(){
		io.sockets.emit('get users', users);
	};

	function updateDomainnames(data, cid){
		// io.sockets.emit('get domains', data);
		io.sockets.connected[cid].emit('get domains', data);
	};
	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data.inputname;
		dict.push({
		    key:   socket.id,
		    value: data.inputdomain
		});
		users.push(socket.username);
		updateUsernames();
		updateDomainnames(data.inputdomain, socket.id);
	});
	
});
