/**
 * Created by Herbert on 11/21/2017.
 */
let socket = io.connect('http://localhost:5000/');
console.log('yall i am here');
let $messageForm = $('#messageForm');
let $messageFormDesc = $('#messageFormDesc');
let $message = $('#message');
let $messageDesc = $('#messageDesc');
let $domain = $('#domain');
let $currentdomain = $('#currentdomain');
let $domainForm = $('#domainForm');
let $newdomain = $('#newdomain');
let $chat = $('#chat');
let $userForm = $('#userForm');
let $userFormArea = $('#userFormArea');
let $messageArea = $('#messageArea');
let $users = $('#users');
let $username = $('#username');
let $feedback = $('#domain-feedback');

$messageForm.submit(function(e){
    e.preventDefault();
    console.log($message.val());
    socket.emit('send message', {username: $username.val(), message: $message.val(), domain_name: $domain.val()});
    $message.val(''); //message empty now
});

$messageFormDesc.submit(function(e){
    e.preventDefault();
    socket.emit('send message', {username: $username.val(), message: $messageDesc.val(), domain_name: $domain.val()});
    $messageDesc.val(''); //messageDesc empty now
});

$domainForm.submit(function(e){
    e.preventDefault();
    socket.emit('change domain', {username: $username.val(), domain_name: $newdomain.val()});
    $domain.value = $newdomain.val();
});

$userForm.submit(function(e){
    console.log('wtf');
    e.preventDefault();
    socket.emit('new user', {username: $username.val(), domain_name: $domain.val()});
    console.log('wtf');
    $userFormArea.hide();
    $messageArea.show();
});

socket.on('new domain', function(data){
    let html = '<strong  style="color: green">'+'Domain Changed Successfully!!!'+'</strong>';
    $feedback.html(html);
    let newdomain = '<li class="list-group-item" style="color: blue">'+data+'</li>';
    $currentdomain.html(newdomain);
    $domain.value = data;
});

socket.on('new message', function(data){
    $chat.append('<div class="well"><strong>'+data.users+'</strong>: '+data.msg+'</div>');
});


socket.on('get users', function(data){
    let html = '';
    for(i = 0; i < data.length; i++){
        html += '<li class="list-group-item">'+data[i]+'</li>';
    }
    $users.html(html);
});

socket.on('get domains', function(data){
    let html = '<li class="list-group-item" style="color: blue">'+data+'</li>';
    $currentdomain.html(html);
});

window.addEventListener('unload', function(event) {
    socket.emit('leave', {username: $username.val(), domain_name: $domain.val()});
});