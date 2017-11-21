/**
 * Created by Herbert on 11/3/2017.
 */
/*
 // html for popover buttons
 var popover_html = '<i class="fa fa-tag fa-fw-lg" id="web-view-assign-label"></i>' +
 '<i class="fa fa-object-group fa-fw-lg" id="web-view-select-similar"></i>' +
 '<i class="fa fa-link fa-fw-lg" id="web-view-merge"></i>' +
 '<i class="fa fa-trash-o fa-fw-lg" id="web-view-remove"></i>';
 // set popover attributes
 for (var i = 0; i < globalBlocks.length; i++) {
 var box = globalBlocks[i]['-att-box'];
 if (box.nodeType == 1) { // check node is DOM element, not text
 box.setAttribute("data-toggle", "popover");
 box.setAttribute("data-content", popover_html);
 box.setAttribute("data-html", true);
 box.setAttribute("data-placement", "top");
 box.setAttribute("data-trigger", "focus");
 box.setAttribute("data-animation", true);
 box.setAttribute("block-index", i);
 }
 }
 */
let web_data_view_query = document.createElement('div');
web_data_view_query.id = 'webdataview-floating-query';
document.body.appendChild(web_data_view_query);

let cfq = new ContentFrame({
    'id':'webview-query',
    // 'appendTo': '#webdataview-floating-widget',
    'css': ['lib/font-awesome/css/font-awesome.css'],
    'inlineCss': {"width": "275px", "height": "270px", "position": "fixed", "right":0, "top": "140px", "z-index": 2147483647, "border-radius": 6, "background-color": "green"}
}, function(){
    // alert('callback called immediately after ContentFrame created');
    console.log("cf created successfully!");
});

let cfq_iframe = cfq.body;

// let note_html = $.parseHTML('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">' +
//     '<div class="webdataview" id="iframe-fullsize-container">' +
//     ' <div class="widget" id="web-view-widget">' +
//     '<div class="widget-buttons widget-float-left" style="height: 30px;">' +
//     '<p><b>Hi Het,</b>  </p> <p><b>Would you like to get notification next time? </b></p>' +
//     ' <button type="button" class="btn btn-success" id="note_accept">Yes, Please</button>&nbsp;&nbsp;&nbsp; ' +
//     '<button type="button" class="btn btn-info" id="note_reject">Maybe Later</button>' +
//     '</div></div> </div>');
// cfq.body.append(note_html);

ContentFrame.findElementInContentFrame('#note_accept', '#webview-query').click(function() {

});
// reject notification
ContentFrame.findElementInContentFrame('#note_reject', '#webview-query').click(function() {

});
$(document).ready(function() {
    $('#webdataview-floating-query').draggable({
        containment: 'window',
        scroll: false,
        stop: function() {
            $(this).css("left", parseFloat($(this).css("left")) / ($(window).width() / 100)+"%");
            $(this).css("top", parseFloat($(this).css("top")) / ($(window).height() / 100)+"%");
        }
    }).resizable({
        handles: 'e,w',
        minWidth: 250,
        stop: function() {
            $(this).css("left", parseFloat($(this).css("left")) / ($(window).width() / 100)+"%");
            $(this).css("width", parseFloat($(this).css("width")) / ($(window).width() / 100)+"%");
        }
    });

    cfq.loadJS('lib/jquery/jquery-3.1.1.min.js', function() {
        cfq.loadJS('lib/socket.io', function() {
            cfq.loadCSS('lib/font-awesome/css/font-awesome.css', function() {
                cfq.loadCSS('assets/css/content-frame-internal.css', function() {
                    cfq.body.load(chrome.extension.getURL("app/contentScript/webView/index.html"), function () {
                        cfq_iframe.ready(function() {
                            let socket = io.connect('http://localhost:5000/');
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
                                console.log('not working!');
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
                        });
                    });
                });
            });
        });
    });
});

