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
    'inlineCss': {"width": "375px", "height": "420px", "position": "fixed", "right": "10px", "top": "5px", "z-index": 2147483647, "border-radius": 6, "background": "transparent", "display": "display"}
}, function(){
    // alert('callback called immediately after ContentFrame created');
    console.log("cf created successfully!");
});
let show_me_flag = false;
let cfq_iframe = cfq.body;
let query_dom_element = null;
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
                                let login = false;
                                let $visib = ContentFrame.findElementInContentFrame('#visib_button','#webview-query');
                                let $visual_option = 0;
                                let old_web_noti = [];
                                let old_label = [];

                                let current_domain = location.hostname;
                                let domain_html = '<h5 id="currentdomain" style="font-weight: 700">Your Current Domain Name: <br><p style="color: blue; font-weight: 300;">&#9755 &nbsp;'+current_domain+'</p></h5>';
                                ContentFrame.findElementInContentFrame('#currentdomain','#webview-query').replaceWith(domain_html);

                                ContentFrame.findElementInContentFrame('#messageDesc','#webview-query').hover(function(e){
                                    if($visib.is(":visible")){
                                        $('#webview-query').css('height','645px');
                                        $('#webview-query').css('width','575px');
                                        ContentFrame.findElementInContentFrame('#messageDesc','#webview-query').css('height', '355px');
                                    }

                                },function(){
                                    if($visib.is(":visible")){
                                        $('#webview-query').css('height','440');
                                        $('#webview-query').css('width','375px');
                                        ContentFrame.findElementInContentFrame('#messageDesc','#webview-query').css('height', '140px');
                                    }
                                });

                                ContentFrame.findElementInContentFrame('#alt2','#webview-query').click(function(e) {
                                    $('#webview-query').css('height','250px');
                                    ContentFrame.findElementInContentFrame('#result_show_some','#webview-query').css('display','block');
                                    ContentFrame.findElementInContentFrame('#initial_show','#webview-query').css('display','none');
                                    ContentFrame.findElementInContentFrame('#result_show_none','#webview-query').css('display','none');
                                    ContentFrame.findElementInContentFrame('#alt1','#webview-query').css('display','none');
                                    ContentFrame.findElementInContentFrame('#alt2','#webview-query').css('display','none');
                                });

                                port.onMessage.addListener(function(msg) {
                                    if (msg.question === "get users"){
                                        let data = msg.data;
                                        $users = ContentFrame.findElementInContentFrame('#users','#webview-query');
                                        let user_html = '<ul class="nav" id="users" style="max-height: 40px; overflow-y:auto; list-style: none;">';
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
                                        let visual_array = [];
                                        let query_array = [];
                                        for(i = 0; i < stored_query.length; i++) {
                                            if(stored_query[i].model_id === 0){
                                                visual_array.push(stored_query[i]);
                                            }else{
                                                query_array.push(stored_query[i]);
                                            }
                                        }

                                        ContentFrame.findElementInContentFrame('#query_area','#webview-query').change(function(e){
                                            $('#webview-query').css('height','420px');
                                            ContentFrame.findElementInContentFrame('#initial_show','#webview-query').css('display','none');
                                            ContentFrame.findElementInContentFrame('#result_show_none','#webview-query').css('display','block');
                                            ContentFrame.findElementInContentFrame('#alt1','#webview-query').css('display','none');
                                            ContentFrame.findElementInContentFrame('#alt2','#webview-query').css('display','block');
                                            ContentFrame.findElementInContentFrame('#result_show_some','#webview-query').css('display','none');

                                            let current_index = e.target.selectedIndex;
                                            if(current_index === 1){
                                                ContentFrame.findElementInContentFrame('#messageName','#webview-query').val('');
                                                ContentFrame.findElementInContentFrame('#messageDesc','#webview-query').val('');
                                                return;
                                            }
                                            ContentFrame.findElementInContentFrame('#messageName','#webview-query').val(query_array[current_index-2].query_name);
                                            ContentFrame.findElementInContentFrame('#messageDesc','#webview-query').val(query_array[current_index-2].query_text);
                                        });

                                        ContentFrame.findElementInContentFrame('#visual_area','#webview-query').change(function(e){
                                            let current_index = e.target.selectedIndex;
                                            if($visual_option !== current_index && $visual_option !== 0){
                                                collected_data = [];
                                                chrome.storage.local.get("value", function(items) {
                                                    if (!chrome.runtime.error) {
                                                        chrome.storage.local.set({'value': {}});
                                                    }
                                                });

                                                for(p = 0; p < old_web_noti.length; p++){
                                                    old_web_noti[p].disappendLabel2Widget();
                                                    old_web_noti[p].notations[old_label[p]].disapplySelectedElements();
                                                }
                                            }
                                            $visual_option = current_index;

                                            let new_model  = visual_array[current_index-1].model_text;
                                            // console.log(new_model);

                                            chrome.storage.local.get("value", function(items) {
                                                if (!chrome.runtime.error) {
                                                    chrome.storage.local.set({'value': new_model});
                                                }
                                            });
                                            for(let i = 0; i < new_model.length; i++){
                                                cur_query = new_model[i].query;
                                                cur_label = new_model[i].label;
                                                old_label.push(cur_label);
                                                let new_web_noti = new WebDataExtractionNotation(new_model[i]);
                                                old_web_noti.push(new_web_noti);
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
                                            // console.log(collected_data);
                                        });
                                        function dynamicEvent_visual() {
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

                                        if(visual_array.length !== 0){
                                            $('#webview-query').css('height','250px');
                                            ContentFrame.findElementInContentFrame('#result_show_some','#webview-query').css('display','block');
                                            for(i = 0; i < visual_array.length; i++) {
                                                let option = document.createElement('option');
                                                option.id = ''+i;
                                                option.innerHTML = '<option style="color: red;">' + visual_array[i].model_name + '</option>';
                                                ContentFrame.findElementInContentFrame('#visual_area', '#webview-query').append(option);
                                                // option.onclick = dynamicEvent_visual;
                                            }
                                        }
                                        if(query_array.length !== 0) {
                                            $('#webview-query').css('height','250px');
                                            ContentFrame.findElementInContentFrame('#result_show_some','#webview-query').css('display','block');
                                            for(i = 0; i < query_array.length; i++) {
                                                let option = document.createElement('option');
                                                option.id = '' + i;
                                                option.innerHTML = '<option style="color: #125bde;">' + query_array[i].query_name + '</option>';
                                                ContentFrame.findElementInContentFrame('#query_area', '#webview-query').append(option);
                                                // option.onclick = dynamicEvent_query;
                                            }
                                        }
                                        if(stored_query.length === 0){
                                            $('#webview-query').css('height','420px');
                                            ContentFrame.findElementInContentFrame('#initial_show','#webview-query').css('display','none');
                                            ContentFrame.findElementInContentFrame('#result_show_none','#webview-query').css('display','block');
                                        }
                                    }
                                    else if(msg.question === "no_connection"){
                                        let noti_question = ContentFrame.findElementInContentFrame('#initial_p','#webview-query');
                                        let question_html = $.parseHTML('<p id="initial_p" style="font-size: large; color: red;"><b>There is NO connection to server...</b></p><p style="font-size: large; color: red;"><b>PLease Try Again!<b></p>');
                                        noti_question.replaceWith(question_html);
                                        ContentFrame.findElementInContentFrame('#initial_show','#webview-query').css('display','block');
                                        $('#webview-query').css('height','155px');
                                    }
                                    else if (msg.question === "new message") {
                                            let data = msg.data;
                                            $chat = ContentFrame.findElementInContentFrame('#chat','#webview-query');
                                            $chat.append('<li><strong>'+data.users+'</strong>: '+data.msg+'</li>');
                                            $chat.animate({scrollTop: $chat.prop("scrollHeight")}, 1000);
                                            let data_msg = JSON.parse(data.msg);
                                            // console.log(data_msg);
                                            let target = [];
                                            for(let cur_key in data_msg){
                                                let dom_id = data_msg[cur_key];
                                                let count = 0; let cur_class;
                                                let elems = document.body.getElementsByTagName("*");
                                                tool_color = "rgb" + COLORS[used_col_idx];
                                                used_col_idx = used_col_idx + 1;
                                                appendLabel2Widget(cur_key, tool_color);

                                                for (i = 0; i < elems.length; i++ ){
                                                    // if (elems[i].tagName != 'H2' && elems[i].tagName != 'IMG' && elems[i].tagName != 'H1' && elems[i].tagName != 'H3' && elems[i].tagName != 'H4')
                                                    // {
                                                    //     count ++;
                                                    //     continue;
                                                    // }
                                                    count++;
                                                    if(dom_id.indexOf(count) > -1) {
                                                        target.push([elems[i], tool_color]);
                                                        let data_to_push = {};  //dic label name ->
                                                        data_to_push[cur_key] = elems[i];
                                                        collected_data.push(data_to_push);
                                                    }

                                                }
                                            }

                                            ContentFrame.findElementInContentFrame('#messageDesc','#webview-query').css('height','50px');

                                            if(target.length !== 0){
                                                $visib.css('visibility','visible');
                                                $visib.click(function(e){
                                                    e.preventDefault();
                                                    for(i=0; i < target.length; i++){
                                                        // console.log(target[i][0], target[i][1]);
                                                        target[i][0].style.outline = '2px solid ' + rgb2hex(target[i][1]);
                                                    }
                                                    // console.log(collected_data);
                                                });
                                            }
                                            // $xpath = data.msg;
                                            // $xpath = JSON.parse($xpath);
                                            // let temp;
                                            // let fake = {};
                                            // fake["prices"] = "sx-price-whole";
                                            // fake["titles"] = "a-size-medium s-inline s-access-title a-text-normal";
                                            // // fake["titles"] = "a-size-medium.s-inline.s-access-title.a-text-normal";
                                            // let array = Object.values(fake);
                                            // let labels;
                                            // let labels_dic = {};
                                            // let tool_color;
                                            // for(i=0; i < array.length; i++) {
                                            //     //----------Adding the label and color to widget---------
                                            //     if (array[i] in class_to_color_idx){
                                            //         tool_color = "rgb" + COLORS[class_to_color_idx[array[i]]];
                                            //         labels = ntc.name(rgb2hex(tool_color))[1];
                                            //         labels_dic[array[i]] = labels;
                                            //         console.log("This label already exists in dictionary!");
                                            //     }
                                            //     else{
                                            //         class_to_color_idx[array[i]] = used_col_idx;
                                            //         tool_color = "rgb" + COLORS[used_col_idx];
                                            //         used_col_idx = used_col_idx + 1;
                                            //         labels = ntc.name(rgb2hex(tool_color))[1];
                                            //         labels_dic[array[i]] = labels;
                                            //         appendLabel2Widget(labels, tool_color);
                                            //     }
                                            // }
                                            // ContentFrame.findElementInContentFrame('#messageDesc','#webview-query').css('height','50px');
                                            //
                                            // for(i = 0; i < $xpath.boxes.length; i++){
                                            //     temp = document.evaluate($xpath.boxes[i], document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                                            //     if(temp !== null){
                                            //         for(j = 0; j < array.length; j++){
                                            //             let selection = temp.getElementsByClassName(array[j]);
                                            //             if(selection.length !== 0)
                                            //             {
                                            //                 target.push([array[j], selection[0]]);
                                            //                 let data_to_push = {};  //dic label name ->
                                            //                 data_to_push[labels_dic[array[j]]] = selection[0];
                                            //                 collected_data.push(data_to_push);
                                            //                 // dummy = new TestTooltip(selection[0], COLORS[class_to_color_idx[array[j]]]);
                                            //             }
                                            //         }
                                            //     }
                                            // }
                                            // let current_field;
                                            // if(target.length !== 0){
                                            //     $visib.css('visibility','visible');
                                            //     $visib.click(function(e){
                                            //         e.preventDefault();
                                            //         for(i=0; i < target.length; i++){
                                            //             current_field = target[i][0];
                                            //             target[i][1].style.outline = '2px solid ' + rgb2hex("rgb" + COLORS[class_to_color_idx[current_field]]);
                                            //             // target[i][1].style.outline = '2px solid ' + COLORS[class_to_color_idx[current_field]];
                                            //         }
                                            //         console.log(collected_data);
                                            //     });
                                            // }
                                    }
                                });

                                window.onbeforeunload = function(e) {
                                    e.preventDefault();
                                    // if($username !== undefined) {
                                    //     port.postMessage({answer: "leave", username: $username, domain_name: location.hostname});
                                    // }
                                    port.postMessage({answer: "exit", domain_name: location.href});
                                    // chrome.storage.sync.get("value", function(items) {
                                    //     if (!chrome.runtime.error) {
                                    //         let array = items["value"];
                                    //         port.postMessage({answer: "leave", domain_name: location.href, capa: array});
                                    //     }
                                    // });
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
                                        port.postMessage({answer: "new user", username: $username, domain_name: location.href});
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


                                        var modified_dom = modifyDOM();
                                        var query_dom_element = [];
                                        for (var key in Object.keys(modified_dom['idMapDomSerial'])) {
                                            query_dom_element.push(modified_dom['idMapDomSerial'][key]);
                                        }

                                        // query_dom_element = modifyDOM();
                                        $messageDesc = ContentFrame.findElementInContentFrame('#messageDesc', '#webview-query').val();
                                        $messageName = ContentFrame.findElementInContentFrame('#messageName', '#webview-query').val();
                                        port.postMessage({answer: "send message by desc", username: $username, message: $messageDesc, name: $messageName, domain_name: location.href, query_dom_element: query_dom_element});
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

