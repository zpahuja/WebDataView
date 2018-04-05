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

let web_data_view_query = document.createElement('div');
web_data_view_query.id = 'webdataview-floating-query';
document.body.appendChild(web_data_view_query);
// let port = chrome.runtime.connect({name: "query"});

let cfq = new ContentFrame({
    'id':'webview-query',
    // 'appendTo': '#webdataview-floating-widget',
    'css': ['lib/font-awesome/css/font-awesome.css'],
    'inlineCss': {"width": "375px", "height": "575px", "position": "fixed", "right": "10px", "top": "1px", "z-index": 2147483647, "border-radius": 6, "background": "transparent", "display": "none"}
}, function(){
    // alert('callback called immediately after ContentFrame created');
    console.log("cf created successfully!");
});
let show_me_flag = false;
let cfq_iframe = cfq.body;
// let port = chrome.runtime.connect({name: "knockknock"});

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

                                let $messageForm = $('#messageForm');
                                let $messageFormDesc = $('#messageFormDesc');
                                let $message;
                                let $messageDesc;
                                let $messageName;
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


                                port.onMessage.addListener(function(msg) {
                                    if (msg.question === "get users"){
                                        let data = msg.data;
                                        $users = ContentFrame.findElementInContentFrame('#users','#webview-query');
                                        let user_html = '<ul class="nav" id="users" style="max-height: 40px; overflow-y:auto; list-style: none;">';
                                        console.log(data);
                                        for(i = 0; i < data.length; i++){
                                            user_html += '<li>'+data[i]+'</li>';
                                        }
                                        user_html += '</ul>';
                                        ContentFrame.findElementInContentFrame('#users','#webview-query').replaceWith(user_html);
                                        $users.animate({scrollTop: $users.prop("scrollHeight")}, 500);
                                    }
                                    else if (msg.question === "feedback"){
                                        let data = msg.data;
                                        let stored_query = data.output;
                                        let k = (145+(stored_query.length-2)*25).toString() + 'px';
                                        // console.log( ContentFrame.findElementInContentFrame('#webview-note', '#webview-note'));
                                        // ContentFrame.findElementInContentFrame('#webview-note', '#webview-note').css('height', k);

                                        let noti_question = ContentFrame.findElementInContentFrame('#question', '#webview-note');
                                        let noti_accept = ContentFrame.findElementInContentFrame('#note_accept', '#webview-note');
                                        let noti_reject = ContentFrame.findElementInContentFrame('#note_reject', '#webview-note');
                                        let question_html;
                                        if(data.output.length !== 0){
                                            question_html = $.parseHTML('<p id="question"><b>There are existing models with the current url, would you like to see it?</b></p>');
                                            noti_question.replaceWith(question_html);
                                            noti_reject.css('visibility','hidden');
                                            let accept_html = $.parseHTML(' <button type="button" class="btn btn-success" id="note_result">Show Me</button>&nbsp;&nbsp;&nbsp;');
                                            noti_accept.replaceWith(accept_html);
                                        }
                                        else{
                                            question_html = $.parseHTML('<p id="question"><b>There is no model, please write your own.Would you like to get notification in the future?</b></p>');
                                            noti_question.replaceWith(question_html);
                                        }
                                        function dynamicEvent() {
                                            let index_pos = parseInt((this.id).slice(-1));
                                            new_model = stored_query[index_pos].model_text;
                                            chrome.storage.local.get("value", function(items) {
                                                if (!chrome.runtime.error) {
                                                    chrome.storage.local.set({'value': new_model});
                                                }
                                            });
                                            for(let i = 0; i < new_model.length; i++){
                                                cur_query = new_model[i].query;
                                                cur_label = new_model[i].label;
                                                let new_web_noti = new WebDataExtractionNotation(new_model[i]);
                                                new_web_noti.extract();
                                                let dom_list = new_web_noti.matchquery()[cur_label];
                                                // new_web_noti.changeLabelName();
                                                let tooltip_color = new_web_noti.label2color[cur_label];
                                                new_web_noti.notations[cur_label].applySelectedElements(tooltip_color);
                                                for(let j = 0; j < dom_list.length; j++){
                                                    data_to_push = {};  //dic label name ->
                                                    data_to_push[cur_label] = dom_list[j];
                                                    collected_data.push(data_to_push);
                                                }
                                            }
                                            console.log(collected_data);
                                            // let new_desp_html = $.parseHTML(' <textarea style="height: 90px;" class="form-control" id="messageDesc" >'+ stored_query[index_pos].query_text +'</textarea>');
                                            // ContentFrame.findElementInContentFrame('#messageDesc','#webview-query').replaceWith(new_desp_html);

                                        }
                                        ContentFrame.findElementInContentFrame('#note_result', '#webview-note').click(function(e) {
                                            e.preventDefault();
                                            if(show_me_flag === false){
                                                show_me_flag = true;
                                            }
                                            else{return;}
                                            ContentFrame.findElementInContentFrame('#question', '#webview-note').css('display', 'none');
                                            for(i = 0; i < stored_query.length; i++) {
                                                let li = document.createElement('li');
                                                li.id = 'pop' + i;
                                                li.innerHTML = '<li><b>' + stored_query[i].model_name + ': &nbsp;&nbsp;&nbsp;</b><button type="button" class="btn btn-success"  style="background-color: #f92672 !important;">populate</button></li>';
                                                ContentFrame.findElementInContentFrame('#query_pair', '#webview-note').append(li);
                                                li.onclick = dynamicEvent;
                                            }

                                        });
                                    }
                                    else if(msg.question === "no_connection"){
                                        let noti_question = ContentFrame.findElementInContentFrame('#question', '#webview-note');
                                        let question_html;
                                        question_html = $.parseHTML('<p id="question"><b>There is NO connection to server!</b></p>');
                                        noti_question.replaceWith(question_html);

                                    }
                                    else if (msg.question === "new message") {
                                        let data = msg.data;
                                        $chat = ContentFrame.findElementInContentFrame('#chat','#webview-query');
                                        $chat.append('<li><strong>'+data.users+'</strong>: '+data.msg+'</li>');
                                        $chat.animate({scrollTop: $chat.prop("scrollHeight")}, 1000);
                                        $xpath = data.msg;
                                        $xpath = JSON.parse($xpath);
                                        let temp;
                                        let fake = {};
                                        fake["prices"] = "sx-price-whole";
                                        fake["titles"] = "a-size-medium s-inline s-access-title a-text-normal";
                                        // fake["titles"] = "a-size-medium.s-inline.s-access-title.a-text-normal";
                                        let array = Object.values(fake);
                                        let dummy;
                                        let labels;
                                        let labels_dic = {};
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

                                        ContentFrame.findElementInContentFrame('#messageDesc','#webview-query').css('height','50px');
                                        // let array = Object.values($xpath.fields);
                                        for(i = 0; i < $xpath.boxes.length; i++){
                                            temp = document.evaluate($xpath.boxes[i], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                                            if(temp !== null){
                                                for(j = 0; j < array.length; j++){
                                                    let selection = temp.getElementsByClassName(array[j]);
                                                    if(selection.length !== 0)
                                                    {
                                                        target.push([array[j], selection[0]]);
                                                        let data_to_push = {};  //dic label name ->
                                                        data_to_push[labels_dic[array[j]]] = selection[0];
                                                        collected_data.push(data_to_push);
                                                        // dummy = new TestTooltip(selection[0], COLORS[class_to_color_idx[array[j]]]);
                                                    }
                                                }
                                            }
                                        }
                                        let current_field;
                                        if(target.length !== 0){
                                            $visib.css('visibility','visible');
                                            $visib.click(function(e){
                                                e.preventDefault();
                                                for(i=0; i < target.length; i++){
                                                    current_field = target[i][0];
                                                    target[i][1].style.outline = '2px solid ' + rgb2hex("rgb" + COLORS[class_to_color_idx[current_field]]);
                                                    // target[i][1].style.outline = '2px solid ' + COLORS[class_to_color_idx[current_field]];
                                                }
                                                console.log(collected_data);
                                            });
                                        }

                                        // console.log(temp.getElementsByClassName($xpath.fields.price));
                                        // .style.backgroundColor = "yellow";
                                    }
                                });

                                window.onbeforeunload = function(e) {
                                    e.preventDefault();
                                    // if($username !== undefined) {
                                    //     port.postMessage({answer: "leave", username: $username, domain_name: location.hostname});
                                    // }
                                    chrome.storage.sync.get("value", function(items) {
                                        if (!chrome.runtime.error) {
                                            let array = items["value"];
                                            port.postMessage({answer: "leave", domain_name: location.hostname, capa: array});
                                        }
                                    });
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
                                        // socket.emit('new user', {username: $username, domain_name: location.hostname});
                                        port.postMessage({answer: "new user", username: $username, domain_name: location.hostname});
                                        // ContentFrame.findElementInContentFrame('#username','#webview-query').val('');
                                        login_html = $.parseHTML('<input style="width: 200px; font-weight: 600; overflow: hidden;  display: inline-block; background-color: #0bbd27" class="form-control" id="username" value="Logged In as: '+$username+'"/>');
                                        ContentFrame.findElementInContentFrame('#username','#webview-query').replaceWith(login_html);
                                        login = true;
                                    }
                                });

                                ContentFrame.findElementInContentFrame('#messageForm','#webview-query').submit(function(e){
                                    e.preventDefault();
                                    if($username === undefined){
                                        let login_html = $.parseHTML('<input style="width: 200px; overflow: hidden;  display: inline-block; background-color: #f92672" class="form-control" id="username" value="Please enter name first!"/>');
                                        ContentFrame.findElementInContentFrame('#username','#webview-query').replaceWith(login_html);
                                    }
                                    else {
                                        $message = ContentFrame.findElementInContentFrame('#message', '#webview-query').val();

                                        port.postMessage({answer: "send message", username: $username, message: $message,domain_name: location.href});

                                        // socket.emit('send message', {
                                        //     username: $username,
                                        //     message: $message,
                                        //     domain_name: location.href
                                        // });
                                        ContentFrame.findElementInContentFrame('#message', '#webview-query').val('');
                                    }
                                });
                                ContentFrame.findElementInContentFrame('#messageFormDesc','#webview-query').submit(function(e){
                                    e.preventDefault();
                                    if($username === undefined){
                                        let login_html = $.parseHTML('<input style="width: 200px; overflow: hidden;  display: inline-block; background-color: #ff338b" class="form-control" id="username" value="Please enter name first!"/>');
                                        ContentFrame.findElementInContentFrame('#username','#webview-query').replaceWith(login_html);
                                    }
                                    else {
                                        $messageDesc = ContentFrame.findElementInContentFrame('#messageDesc', '#webview-query').val();
                                        $messageName = ContentFrame.findElementInContentFrame('#messageName', '#webview-query').val();
                                        port.postMessage({answer: "send message by desc", username: $username, message: $messageDesc, name: $messageName, domain_name: location.href});
                                        // socket.emit('send message by desc', {
                                        //     username: $username,
                                        //     message: $messageDesc,
                                        //     domain_name: location.href
                                        // });
                                        ContentFrame.findElementInContentFrame('#messageDesc', '#webview-query').val('');
                                    }
                                });

                                // ContentFrame.findElementInContentFrame('#domainForm','#webview-query').submit(function(e){
                                //     e.preventDefault();
                                //     socket.emit('change domain', {username: $username.val(), domain_name: $newdomain.val()});
                                // });
                                //
                                // socket.on('new domain', function(data){
                                //     let html = '<strong  style="color: green">'+'Domain Changed Successfully!!!'+'</strong>';
                                //     $feedback.html(html);
                                //     let newdomain = '<li class="list-group-item" style="color: blue">'+data+'</li>';
                                //     $currentdomain.html(newdomain);
                                // });
                                //
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

