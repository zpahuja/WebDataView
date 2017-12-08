/**
 * Created by Herbert on 11/3/2017.
 */
/*
 // html for popover buttons
 let popover_html = '<i class="fa fa-tag fa-fw-lg" id="web-view-assign-label"></i>' +
 '<i class="fa fa-object-group fa-fw-lg" id="web-view-select-similar"></i>' +
 '<i class="fa fa-link fa-fw-lg" id="web-view-merge"></i>' +
 '<i class="fa fa-trash-o fa-fw-lg" id="web-view-remove"></i>';
 // set popover attributes
 for (let i = 0; i < globalBlocks.length; i++) {
 let box = globalBlocks[i]['-att-box'];
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

var COLORS = ["(2,63,165)","(125,135,185)","(190,193,212)","(214,188,192)","(187,119,132)","(142,6,59)","(74,111,227)","(133,149,225)","(181,187,227)","(230,175,185)","(224,123,145)","(211,63,106)","(17,198,56)","(141,213,147)","(198,222,199)","(234,211,198)","(240,185,141)","(239,151,8)","(15,207,192)","(156,222,214)","(213,234,231)","(243,225,235)","(246,196,225)","(247,156,212)"];
shuffle(COLORS);

let web_data_view_query = document.createElement('div');
web_data_view_query.id = 'webdataview-floating-query';
document.body.appendChild(web_data_view_query);

let cfq = new ContentFrame({
    'id':'webview-query',
    // 'appendTo': '#webdataview-floating-widget',
    'css': ['lib/font-awesome/css/font-awesome.css'],
    'inlineCss': {"width": "375px", "height": "550px", "position": "fixed", "right": "10px", "top": "1px", "z-index": 2147483647, "border-radius": 6, "background": "transparent"}
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
                cfq.loadCSS('lib/bootstrap/css/bootstrap.min.css', function() {
                    cfq.loadCSS('assets/css/content-frame-internal.css', function() {
                        cfq.body.load(chrome.extension.getURL("app/contentScript/webView/index.html"), function () {
                            cfq_iframe.ready(function() {
                                let socket = io.connect('http://127.0.0.1:5353/');
                                // let socket = io.connect('http://kite.cs.illinois.edu:5355/');
                                socket.on("hello",function(data){
                                    console.log(data);
                                    chrome.runtime.sendMessage({msg:"socket",text:data.text},function(response){});
                                });

                                let $messageForm = $('#messageForm');
                                let $messageFormDesc = $('#messageFormDesc');
                                let $message;
                                let $messageDesc;
                                let $domain = $('#domain');
                                let $currentdomain = $('#currentdomain');
                                let $domainForm = $('#domainForm');
                                let $newdomain = $('#newdomain');
                                let $chat;
                                let $userForm = $('#userForm');
                                let $userFormArea = $('#userFormArea');
                                let $messageArea = $('#messageArea');
                                let $users;
                                let $username;
                                let $feedback = $('#domain-feedback');
                                let $xpath;
                                let login = false;
                                let target = [];
                                let $visib = ContentFrame.findElementInContentFrame('#visib_button','#webview-query');

                                let current_domain = location.hostname;
                                let domain_html = '<h5 id="currentdomain" style="font-weight: 700">Your Current Domain Name: <br><p style="color: blue; font-weight: 300;">&#9755 &nbsp;'+current_domain+'</p></h5>';
                                ContentFrame.findElementInContentFrame('#currentdomain','#webview-query').replaceWith(domain_html);

                                window.onbeforeunload = function(e) {
                                    e.preventDefault();
                                    if($username !== undefined) {
                                        socket.emit('leave', {username: $username, domain_name: location.hostname});
                                    }
                                };

                                ContentFrame.findElementInContentFrame('#userForm','#webview-query').submit(function(e){
                                    e.preventDefault();
                                    $username = ContentFrame.findElementInContentFrame('#username','#webview-query').val();
                                    let login_html;
                                    if($username === ''){
                                        login_html = $.parseHTML('<input style="width: 200px; font-weight: 600; overflow: hidden;  display: inline-block; background-color: #ff0000" class="form-control" id="username" value="Please Enter a Valid Name"/>');
                                        ContentFrame.findElementInContentFrame('#username','#webview-query').replaceWith(login_html);
                                    }
                                    else if(login === false){
                                        socket.emit('new user', {username: $username, domain_name: location.hostname});
                                        // ContentFrame.findElementInContentFrame('#username','#webview-query').val('');
                                        login_html = $.parseHTML('<input style="width: 200px; font-weight: 600; overflow: hidden;  display: inline-block; background-color: #0bbd27" class="form-control" id="username" value="Logged In as: '+$username+'"/>');
                                        ContentFrame.findElementInContentFrame('#username','#webview-query').replaceWith(login_html);
                                        login = true;
                                    }
                                });

                                socket.on('get users', function(data){
                                    // let user_html = '<ul class="list-group" id="users">';
                                    // console.log(data);
                                    // for(i = 0; i < data.length; i++){
                                    //     user_html += '<li class="list-group-item">'+data[i]+'</li>';
                                    // }
                                    // user_html += '</ul>';
                                    // ContentFrame.findElementInContentFrame('#users','#webview-query').replaceWith(user_html);
                                    $users = ContentFrame.findElementInContentFrame('#users','#webview-query');
                                    let user_html = '<ul class="nav" id="users" style="max-height: 40px; overflow-y:auto; list-style: none;">';
                                    console.log(data);
                                    for(i = 0; i < data.length; i++){
                                        user_html += '<li>'+data[i]+'</li>';
                                    }
                                    user_html += '</ul>';
                                    ContentFrame.findElementInContentFrame('#users','#webview-query').replaceWith(user_html);
                                    $users.animate({scrollTop: $users.prop("scrollHeight")}, 500);
                                });

                                ContentFrame.findElementInContentFrame('#messageForm','#webview-query').submit(function(e){
                                    e.preventDefault();
                                    if($username === undefined){
                                        let login_html = $.parseHTML('<input style="width: 200px; overflow: hidden;  display: inline-block; background-color: #f92672" class="form-control" id="username" value="Please enter name first!"/>');
                                        ContentFrame.findElementInContentFrame('#username','#webview-query').replaceWith(login_html);
                                    }
                                    else {
                                        $message = ContentFrame.findElementInContentFrame('#message', '#webview-query').val();
                                        console.log($message);
                                        socket.emit('send message', {
                                            username: $username,
                                            message: $message,
                                            domain_name: location.href
                                        });
                                        ContentFrame.findElementInContentFrame('#message', '#webview-query').val('');
                                    }
                                });

                                socket.on('new message', function(data){
                                    $chat = ContentFrame.findElementInContentFrame('#chat','#webview-query');
                                    $chat.append('<li><strong>'+data.users+'</strong>: '+data.msg+'</li>');
                                    $chat.animate({scrollTop: $chat.prop("scrollHeight")}, 1000);
                                    $xpath = data.msg;
                                    $xpath = JSON.parse($xpath);
                                    let temp;
                                    let fake = {};
                                    fake["prices"] = "sx-price-whole";
                                    let array = Object.values(fake);
                                    let dummy;
                                    let labels;
                                    let labels_dic = {}
                                    let tool_color;
                                    for(i=0; i < array.length; i++) {
                                        //----------Adding the label and color to widget---------
                                        if (array[i] in class_to_color_idx){
                                            tool_color = "rgb" + COLORS[class_to_color_idx[array[i]]];
                                            labels = ntc.name(rgb2hex(tool_color))[1];
                                            labels_dic[array[i]] = labels;
                                            console.log("This label already exists in dictionary!");
                                        }
                                        else{
                                            class_to_color_idx[array[i]] = used_col_idx;
                                            tool_color = "rgb" + COLORS[used_col_idx];
                                            used_col_idx = used_col_idx + 1;
                                            labels = ntc.name(rgb2hex(tool_color))[1];
                                            labels_dic[array[i]] = labels;
                                            appendLabel2Widget(labels, tool_color);
                                        }
                                    }

                                    // let array = Object.values($xpath.fields);
                                    for(i = 0; i < $xpath.boxes.length; i++){
                                        temp = document.evaluate($xpath.boxes[i], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                                        if(temp !== null){
                                            for(j = 0; j < array.length; j++){
                                                let selection = temp.getElementsByClassName(array[j]);

                                                if(selection.length !== 0)
                                                {
                                                    target.push(selection);
                                                    let data_to_push = {};  //dic label name ->
                                                    data_to_push[labels_dic[array[j]]] = selection;
                                                    collected_data.push(data_to_push);
                                                    dummy = new TestTooltip(selection, COLORS[class_to_color_idx[array[j]]]);
                                                }
                                            }
                                        }
                                    }

                                    if(target.length !== 0){
                                        $visib.css('visibility','visible');
                                        $visib.click(function(e){
                                            e.preventDefault();
                                            for(i=0; i < target.length; i++){
                                                target[i][0].style.backgroundColor = "yellow";
                                            }
                                        });
                                    }






                                    // chrome.runtime.sendMessage({msg:"xpath", text: $xpath.boxes[0]},function(response){});
                                    // console.log(temp.getElementsByClassName($xpath.fields.price));
                                    // .style.backgroundColor = "yellow";
                                });

                                ContentFrame.findElementInContentFrame('#messageFormDesc','#webview-query').submit(function(e){
                                    e.preventDefault();
                                    if($username === undefined){
                                        let login_html = $.parseHTML('<input style="width: 200px; overflow: hidden;  display: inline-block; background-color: #ff338b" class="form-control" id="username" value="Please enter name first!"/>');
                                        ContentFrame.findElementInContentFrame('#username','#webview-query').replaceWith(login_html);
                                    }
                                    else {
                                        $messageDesc = ContentFrame.findElementInContentFrame('#messageDesc', '#webview-query').val();
                                        socket.emit('send message by desc', {
                                            username: $username,
                                            message: $messageDesc,
                                            domain_name: location.href
                                        });
                                        ContentFrame.findElementInContentFrame('#messageDesc', '#webview-query').val('');
                                    }
                                });


                                ContentFrame.findElementInContentFrame('#domainForm','#webview-query').submit(function(e){
                                    e.preventDefault();
                                    socket.emit('change domain', {username: $username.val(), domain_name: $newdomain.val()});
                                });

                                socket.on('new domain', function(data){
                                    let html = '<strong  style="color: green">'+'Domain Changed Successfully!!!'+'</strong>';
                                    $feedback.html(html);
                                    let newdomain = '<li class="list-group-item" style="color: blue">'+data+'</li>';
                                    $currentdomain.html(newdomain);
                                });

                                // socket.on('get domains', function(data){
                                //     let html = '<li class="list-group-item" style="color: blue">'+data+'</li>';
                                //     $currentdomain.html(html);
                                // });

                                function rgb2hex(rgb){
                                    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
                                    return (rgb && rgb.length === 4) ? "#" +
                                        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                                        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
                                        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
                                }

                            });
                        });
                    });
                });
            });
        });
    });
});

