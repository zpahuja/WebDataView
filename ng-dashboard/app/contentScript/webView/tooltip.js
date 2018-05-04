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

let COLORS = ["(2,63,165)","(125,135,185)","(190,193,212)","(214,188,192)","(187,119,132)","(142,6,59)","(74,111,227)","(133,149,225)","(181,187,227)","(230,175,185)","(224,123,145)","(211,63,106)","(17,198,56)","(141,213,147)","(198,222,199)","(234,211,198)","(240,185,141)","(239,151,8)","(15,207,192)","(156,222,214)","(213,234,231)","(243,225,235)","(246,196,225)","(247,156,212)"];
shuffle(COLORS);
let collected_data = [];
let fieldname_color = {};
let field_label =  null;
labels_list = [];
let parent_collected = [];
let cap_counter = 0;
let mySet = new Set();
let tooltip_color =  null;
let cccccc =  null;
let cur_query = new Query({});
let cur_web_noti = null;
let apply_array = [];
let click_flag = false;
let port = chrome.runtime.connect({name: "knockknock"});
// port.postMessage({answer: "pre check", domain_name: location.href});
setTimeout(function(){port.postMessage({answer: "pre check", domain_name: location.href});}, 1000);
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting == "toggled"){
            $('#webview-query').toggle();
            $('#webdataview-floating-widget').toggle();
        }
    });

class TestTooltip {
    constructor(referenceElement, color) {
        self.instance = new Tooltip(referenceElement, {
            title: '<div id="webview-popper-container"></div>',
            trigger: "click",
            placement: "auto-top",
            html: true,
            container: 'body',
        });
        self.instance.show();
        let cf = new ContentFrame({
            'id':'webview-tooltip',
            'appendTo': '#webview-popper-container',
            'css': ['lib/font-awesome/css/font-awesome.css', 'lib/bootstrap/css/bootstrap.3.3.7.min.css'],
            'js': ['app/contentScript/webView/tooltipHandler.js'],
            'inlineCss':  {"width": "90px", "height": "40px", "z-index": 2147483640, "border": "none", "border-radius": 6, "overflow": "visible", "display": "display"}
    });
        let tooltip_html = $.parseHTML('<div class="webdataview" id="webdataview_id" style="background-color: ' + color + '; width: 100%; height: auto; overflow: visible; z-index: 2147483647 !important; ">' +
            // '<i class="fa fa-tag fa-fw-lg" id="web-view-assign-label" style="margin-left: 15px"></i> ' +
            // '<i class="fa fa-object-group fa-fw-lg" id="web-view-select-similar" style="color: black;"></i>' +
            '<i class="fa fa-trash-o fa-fw-lg" id="web-view-remove"  style="color: black;" title="Delete"></i>' +
            '<i class="fa fa-angle-double-down fa-fw-lg" id="cap_toggle"  style="color: black; font-weight: 100;" title="Select Capabilities"></i>' +
            '<br><div id="cap_target" style="display: none;">' +
            '<input type="checkbox" id="filter_class" name="subscribe" value="0">'+
            '<label for="subscr ibeNews">Filter by ClassName</label>' +
            '<br><input type="checkbox" id="filter_id" name="subscribe" value="0">'+
            '<label for="subscribeNews">Filter by Id</label>' +
            '<br><input type="checkbox" id="filter_fontsize" name="subscribe" value="0">'+
            '<label for="subscribeNews">Filter by Fontsize</label>' +
            '<br><input type="checkbox" id="filter_fontcolor" name="subscribe" value="0">'+
            '<label for="subscribeNews">Filter by Fontcolor</label>' +
            '<br><input type="checkbox" id="filter_backcolor" name="subscribe" value="0">'+
            '<label for="subscribeNews">Filter by Background-color</label>' +
            '<br><input type="checkbox" id="filter_style" name="subscribe" value="0">'+
            '<label for="subscribeNews">Filter by Font-style</label>' +
            '<br><input type="checkbox" id="filter_weight" name="subscribe" value="0">'+
            '<label for="subscribeNews">Filter by Font-weight</label>' +
            // '<br><input type="checkbox" id="filter_child" name="subscribe" value="0">' +
            // '<label for="subscribeNews">Remove Parent Element</label>' +
            '<br><input type="checkbox" id="filter_left" name="subscribe" value="0">'+
            '<label for="subscribeNews">Align Left</label>' +
            // '<br><input type="checkbox" id="filter_height" name="subscribe" value="0">'+
            // '<label for="subscribeNews">Filter by Height</label>' +
            // '<br><input type="checkbox" id="filter_width" name="subscribe" value="0">'+
            // '<label for="subscribeNews">Filter by Width</label>' +
            '</div>'+
            '</div>');
        cf.body.append(tooltip_html);

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

        port.onMessage.addListener(function(msg) {
            if (msg.question === "feedback"){
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
                    console.log(new_model);
                    chrome.storage.local.get("value", function(items) {
                        if (!chrome.runtime.error) {
                            chrome.storage.local.set({'value': new_model});
                        }
                    });
                    for(let i = 0; i < new_model.length; i++){
                        cur_query = new_model[i].query;   //query text
                        cur_label = new_model[i].label;   //query labels
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
                    // let new_desp_html = $.parseHTML(' <textarea style="height: 90px;" class="form-control" id="messageDesc" >'+ stored_query[index_pos].query_text +'</textarea>');
                    // ContentFrame.findElementInContentFrame('#messageDesc','#webview-query').replaceWith(new_desp_html);

                }
                ContentFrame.findElementInContentFrame('#note_result', '#webview-note').click(function(e) {
                    e.preventDefault();
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
        });

        ContentFrame.findElementInContentFrame('#cap_toggle', '#webview-tooltip').click(function(e) {
            e.preventDefault();
            let arrow_target = ContentFrame.findElementInContentFrame('#webdataview_id', '#webview-tooltip').find('#cap_toggle');
            arrow_target.toggleClass("fa fa-angle-double-up fa-fw-lg fa fa-angle-double-down fa-fw-lg");

            let stretch = "110px";
            let width_stretch = "195px";
            let x = ContentFrame.findElementInContentFrame('#cap_target', '#webview-tooltip')[0];
            if (x.style.display === "none") {
                x.style.display = "block";
                $("#webview-tooltip")[0].style.height = stretch;
                $("#webview-tooltip")[0].style.width = width_stretch;
            } else {
                x.style.display = "none";
                $("#webview-tooltip")[0].style.height = "40px";
                $("#webview-tooltip")[0].style.width = "90px";

            }
        });

        function helper(referenceElement, cur_query, flag_val){
            if(flag_val === 0){
                tooltip_color = "rgb" + COLORS[class_to_color_idx[referenceElement.className]]; // classname to color
                cur_query.highlightSelectedElements(tooltip_color);
                field_label = ntc.name(rgb2hex(tooltip_color))[1]; //any color -> close name to it
                fieldname_color[field_label] = tooltip_color;
                let dom_elements = cur_query.execute();
                let data_to_push = null;
                for(let i = 0; i < dom_elements.length; i++){
                    data_to_push = {};  //dic label name ->
                    data_to_push[field_label] = dom_elements[i];
                    collected_data.push(data_to_push);
                }
            }
            else{
                cur_query.highlightSelectedElements(tooltip_color);
                let new_collect = [];
                let target_class = referenceElement.className;
                for (let j=0; j < collected_data.length; j++) {
                    let kval = Object.values(collected_data[j])[0];
                    if(kval.className !== target_class){
                        new_collect.push(collected_data[j]);
                    }
                }
                collected_data = new_collect;
            }
        }

        // ContentFrame.findElementInContentFrame('#filter_left', '#webview-tooltip').click(function(e) {
        //     if(jQuery(referenceElement).offset().left === '' || jQuery(referenceElement).offset().left === undefined ){
        //         alert("This element has no left offset!");
        //         ContentFrame.findElementInContentFrame('#filter_left', '#webview-tooltip').attr("disabled","true");
        //         return;
        //     }
        //     let cur = e.target;
        //     if(cur.value === "0"){  //Add model to collection
        //         cur.value = "1";
        //         mySet.add("filter_left");
        //         let target_weight = jQuery(referenceElement).css("font-weight");
        //         cur_query.css = {"font-weight": target_weight};
        //         helper(referenceElement, cur_query, 0);
        //     }
        //     else{  //Take model off collection
        //         cur.value = "0";
        //         mySet.delete("filter_left");
        //         delete cur_query.css["font-weight"];
        //         helper(referenceElement, cur_query, 1);
        //     }
        // });

        ContentFrame.findElementInContentFrame('#filter_class', '#webview-tooltip').click(function(e) {
            if (referenceElement.className === '' || referenceElement.className === undefined) {
                alert("This element has no Class attribute!");
                ContentFrame.findElementInContentFrame('#filter_class', '#webview-tooltip').attr("disabled","true");
                return;
            }
            let cur = e.target;
            if (cur.value === "0") {  //Add model to collection
                cur.value = "1";
                mySet.add("filter_class");

                let target_class = referenceElement.className;
                cur_query.class = target_class;
                helper(referenceElement, cur_query, 0);
            }

            else{  //Take model off collection
                cur.value = "0";
                mySet.delete("filter_class");
                cur_query.class = false;
                helper(referenceElement, cur_query, 1);
            }
        });

        ContentFrame.findElementInContentFrame('#filter_id', '#webview-tooltip').click(function(e) {
            if(referenceElement.id === '' || referenceElement.id === undefined ){
                alert("This element has no Id attribute!");
                ContentFrame.findElementInContentFrame('#filter_id', '#webview-tooltip').attr("disabled","true");
                return;
            }
            let cur = e.target;
            if(cur.value === "0"){  //Add model to collection
                cur.value = "1";
                mySet.add("filter_id");

                let target_id = referenceElement.id;
                cur_query.id = target_id;
                helper(referenceElement, cur_query, 0);
            }

            else{  //Take model off collection
                cur.value = "0";
                mySet.delete("filter_id");
                cur_query.id = false;
                helper(referenceElement, cur_query, 1);
            }
        });

        ContentFrame.findElementInContentFrame('#filter_fontsize', '#webview-tooltip').click(function(e) {
            if(jQuery(referenceElement).css("font-size") === '' || jQuery(referenceElement).css("font-size") === undefined ){
                alert("This element has no Font-Size attribute!");
                ContentFrame.findElementInContentFrame('#filter_fontsize', '#webview-tooltip').attr("disabled","true");
                return;
            }
            let cur = e.target;
            if(cur.value === "0"){  //Add model to collection
                cur.value = "1";
                mySet.add("filter_fontsize");
                let target_font = jQuery(referenceElement).css("font-size");
                cur_query.css = {"fontSize": target_font};
                helper(referenceElement, cur_query, 0);
            }
            else{  //Take model off collection
                cur.value = "0";
                mySet.delete("filter_fontsize");
                delete cur_query.css["fontSize"];
                helper(referenceElement, cur_query, 1);
            }
        });

        ContentFrame.findElementInContentFrame('#filter_fontcolor', '#webview-tooltip').click(function(e) {
            if(jQuery(referenceElement).css("color") === '' || jQuery(referenceElement).css("color") === undefined ){
                alert("This element has no Font-Color attribute!");
                ContentFrame.findElementInContentFrame('#filter_fontcolor', '#webview-tooltip').attr("disabled","true");
                return;
            }
            let cur = e.target;
            if(cur.value === "0"){  //Add model to collection
                cur.value = "1";
                mySet.add("filter_fontcolor");
                let target_fontcolor = jQuery(referenceElement).css("color");
                cur_query.css = {"color": target_fontcolor};
                helper(referenceElement, cur_query, 0);
            }
            else{  //Take model off collection
                cur.value = "0";
                mySet.delete("filter_fontcolor");
                delete cur_query.css["color"];
                helper(referenceElement, cur_query, 1);
            }
        });

        ContentFrame.findElementInContentFrame('#filter_backcolor', '#webview-tooltip').click(function(e) {
            if(jQuery(referenceElement).css("background-color") === '' || jQuery(referenceElement).css("background-color") === undefined ){
                alert("This element has no Background-Color attribute!");
                ContentFrame.findElementInContentFrame('#filter_backcolor', '#webview-tooltip').attr("disabled","true");
                return;
            }
            let cur = e.target;
            if(cur.value === "0"){  //Add model to collection
                cur.value = "1";
                mySet.add("filter_backcolor");
                let target_backcolor = jQuery(referenceElement).css("background-color");
                cur_query.css = {"background-color": target_backcolor};
                helper(referenceElement, cur_query, 0);
            }
            else{  //Take model off collection
                cur.value = "0";
                mySet.delete("filter_backcolor");
                delete cur_query.css["background-color"];
                helper(referenceElement, cur_query, 1);
            }
        });

        ContentFrame.findElementInContentFrame('#filter_style', '#webview-tooltip').click(function(e) {
            if(jQuery(referenceElement).css("font-style") === '' || jQuery(referenceElement).css("font-style") === undefined ){
                alert("This element has no Font-Style attribute!");
                ContentFrame.findElementInContentFrame('#filter_style', '#webview-tooltip').attr("disabled","true");
                return;
            }
            let cur = e.target;
            if(cur.value === "0"){  //Add model to collection
                cur.value = "1";
                mySet.add("filter_style");
                let target_style = jQuery(referenceElement).css("font-style");
                cur_query.css = {"font-style": target_style};
                helper(referenceElement, cur_query, 0);
            }
            else{  //Take model off collection
                cur.value = "0";
                mySet.delete("filter_style");
                delete cur_query.css["font-style"];
                helper(referenceElement, cur_query, 1);
            }
        });

        ContentFrame.findElementInContentFrame('#filter_weight', '#webview-tooltip').click(function(e) {
            if(jQuery(referenceElement).css("font-weight") === '' || jQuery(referenceElement).css("font-weight") === undefined ){
                alert("This element has no Font-Weight attribute!");
                ContentFrame.findElementInContentFrame('#filter_weight', '#webview-tooltip').attr("disabled","true");
                return;
            }
            let cur = e.target;
            if(cur.value === "0"){  //Add model to collection
                cur.value = "1";
                mySet.add("filter_weight");
                let target_weight = jQuery(referenceElement).css("font-weight");
                cur_query.css = {"font-weight": target_weight};
                helper(referenceElement, cur_query, 0);
            }
            else{  //Take model off collection
                cur.value = "0";
                mySet.delete("filter_weight");
                delete cur_query.css["font-weight"];
                helper(referenceElement, cur_query, 1);
            }
        });

        ContentFrame.findElementInContentFrame('#web-view-select-similar', '#webview-tooltip').click(function(e) {
            if (referenceElement.className === '' || referenceElement.className === undefined) {
                alert("This element has no Class attribute!");
                return;
            }
            let cur = e.target;
            if (cur.value === "0") {  //Add model to collection
                cur.value = "1";
                mySet.add("filter_class");

                let target_class = referenceElement.className;
                cur_query.class = target_class;
                helper(referenceElement, cur_query, 0);
            }

            else{  //Take model off collection
                cur.value = "0";
                mySet.delete("filter_class");
                cur_query.class = false;
                helper(referenceElement, cur_query, 1);
            }

        });

        ContentFrame.findElementInContentFrame('#web-view-remove', '#webview-tooltip').click(function(e) {
            e.preventDefault();
            $('#webview-popper-container').remove();
            referenceElement.style.outline = null;
            let new_collect = [];
            for (let j=0; j < collected_data.length; j++) {
                let kval = Object.values(collected_data[j])[0];
                if(kval !== referenceElement){
                    new_collect.push(collected_data[j]);
                }
            }
            collected_data = new_collect;
        });
        // assign
        ContentFrame.findElementInContentFrame('#web-view-assign-label', '#webview-tooltip').click(function() {
            cf.body.empty();
            let assign_color_html = "<table style=\"width:100%; height:100%; background-color: rgb(255,255,255)\">";
            for (let i=0; i<4; i++) {
                assign_color_html += "<tr>"
                for (let j=0; j<6; j++) {
                    assign_color_html += "<td class=\"web-view-assign-color\" style=\"cursor:pointer;background-color: rgb(255,255,255)" + COLORS[i*6+j]+ "\"></td>"
                }
                assign_color_html += "</tr>"
            }
            assign_color_html += "</table>";
            cf.iframe.css({"height":"100px"});
            cf.body.append($.parseHTML(assign_color_html));
            self.instance.show();
            let assigned_color = undefined;
            ContentFrame.findElementInContentFrame('.web-view-assign-color', '#webview-tooltip').click(function(e) {
                let assigned_color = e.target.style.backgroundColor;
                let assigned_color_label_name = ntc.name(rgb2hex(assigned_color))[1];
                if (labels_list.indexOf(assigned_color_label_name) == -1) {
                    appendLabel2Widget(assigned_color_label_name, assigned_color_label_name);
                }
                let tooltip_html = $.parseHTML('<div class="webdataview" style="background-color: ' + assigned_color + '; width: 100%; height: 100%">' +
                    // '<i class="fa fa-object-group fa-fw-lg" id="web-view-select-similar"></i>' +
                    '<i class="fa fa-trash-o fa-fw-lg" id="web-view-remove" title="Delete"></i>' +
                    '<i class="fa fa-angle-double-down fa-fw-lg" id="cap_toggle" title="Select Capabilities"></i>' +
                    '</div>');
                cf.iframe.css({"height":"40px"});
                cf.body.empty();
                cf.body.append(tooltip_html);


                // change field_label of selected nodes or add them to collected_data
                for (let idx = 0; idx < selected_nodes.length; idx++) {
                    selected_nodes[idx].style.outline = "2px solid " + assigned_color;
                    for (let j=0; j < collected_data.length; j++) {
                        let found = false;
                        let keys = Object.keys(collected_data[j]);
                        keys.forEach(function(key) {
                            if (collected_data[j][key] == selected_nodes[idx]) {
                                collected_data[j][assigned_color_label_name] = collected_data[j][key];
                                delete collected_data[j][key];
                                found = true;
                            }
                        });
                        if (!found) {
                            let data_to_push = {};
                            data_to_push[assigned_color_label_name] = selected_nodes[idx];
                            collected_data.push(data_to_push);
                        }
                    }
                }
            });
        });
    }

    show() {
        self.instance.show();
    }

    hide() {
        self.instance.hide();
    }
}

// list of selected VIPS blocks
let selected_nodes = [];
let tooltip_node = undefined;
let alignSelectionWithClusterClassFlag = false;
let used_col_idx = 0;
let class_to_color_idx = {};

// let TOOLTIP_IDS_ARRAY = ["web-view-select-similar", "web-view-remove"];
let TOOLTIP_IDS_ARRAY = ["web-view-remove"];
let prev;
document.addEventListener("click", selectionHandler, true);

let css_title = null;
let css_store = null;
function greeting(name) {
    let hover_message = "";
    if(mySet.has("filter_class")){
        hover_message = hover_message + " className: ";
        hover_message = hover_message + name.attr('class');
        hover_message = hover_message + "\n";
    }
    if(mySet.has("filter_id")){
        hover_message = hover_message + " id: ";
        hover_message = hover_message + name.attr('id');
        hover_message = hover_message + "\n";
    }
    if(mySet.has("filter_fontsize")){
        hover_message = hover_message + " Fontsize: ";
        hover_message = hover_message + name.css("font-size");
        hover_message = hover_message + "\n";
    }
    if(mySet.has("filter_fontcolor")){
        hover_message = hover_message + " Fontcolor: ";
        hover_message = hover_message + name.css("color");
        hover_message = hover_message + "\n";
    }
    // name.prop('title', hover_message);
}

function doWhenEnterDOM(node, count) {
    if (node.data('wdv_original')===undefined) {
        // if ($.now() % 5 == 0) { // use it to reduce cost
        //     removeAllSelections(); //pretty expensive
        // }
        removeAllSelections(); //pretty expensive, use the method above to reduce cost
        node.data('wdv_original',{title:node.prop('title'),border:node.css('border')});
        node.css('border', '1px dotted black');
        greeting(node);
    }
    // else if (count < 10) {
    //     setTimeout(doWhenEnterDOM(node,count+1),250);
    // }
}

function doWhenExitDOM(node, count) {
    if (node.data('wdv_original')!==undefined) {
        node.prop('title', node.data('wdv_original')['title']);
        node.css('border', node.data('wdv_original')['border']);
        node.removeData('wdv_original');
    }
    // else if (count < 10) {
    //     setTimeout(doWhenExitDOM(node,count+1),250);
    // }
}

function removeAllSelections() {
    var elements = $('*').filter(function(){return $(this).data('wdv_original') !== undefined;});
    for (i = 0; i < elements.length; i++) {
        doWhenExitDOM($(elements[i]),0)
    }
}

$('*').hover(
    function(e){
        // The condition is to prevent the case when moving the mouse too fast
        // that it re-enters the element before finishing the previous entering
        doWhenEnterDOM($(this),0);
        e.preventDefault();
        e.stopPropagation();
        return false;
    },function(e){
        // console.log($(this).css('border'));
        // console.log($(this).data('wdv_original'));
        // css_title = $(this).data('wdv_original_title');
        // css_store = $(this).data('wdv_original_css');
        // The condition is to prevent the case when moving the mouse too fast
        // that it goes out of the element before finishing the previous going out
        doWhenExitDOM($(this),0);
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
);

function selectionHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    mySet.clear();
    let event_target = event.target;
    apply_array.push(event_target);
    if (TOOLTIP_IDS_ARRAY.indexOf(event.target.id ) != -1) {
        // console.log(event.target.id);
        tooltipHandler(event.target.id);
        return;
    }
    /*
     let idx = getVipsIndexFromBoxId(event.target.id);
     // if click outside of view, then deselect all elements, hide tooltip, empty selectedBlockIndices and return
     if (!idx) {
     deselectVipsBlockArray(selectedBlockIndices);
     destroyTooltip();
     selectedBlockIndices = [];
     return;
     }
     let selectIndexColor = getClusterColorFromIndex(idx);
     if (alignSelectionWithClusterClassFlag) {
     alignWithSelectedBlockCluster(idx, selectIndexColor);
     return;
     }
     // toggle Selection for an index that is already selected
     if(selectedBlockIndices.indexOf(idx) != -1) {
     deselectVipsBlock(idx);
     // if no selected box, destroy tooltip
     if (isEmptyArray(selectedBlockIndices))
     destroyTooltip();
     }
     else {
     event.target.style.border = "2px solid " + selectIndexColor;
     selectedBlockIndices.push(idx);
     updateTooltip(idx, selectIndexColor);
     }
     */
    $('#webview-popper-container').remove();

    let tooltip_color;
    // if (event.target.className in class_to_color_idx) {
    //     tooltip_color = "rgb" + COLORS[class_to_color_idx[event.target.className]];
    // }
    // else {
    //     tooltip_color = "rgb" + COLORS[used_col_idx];
    //     class_to_color_idx[event.target.className] = used_col_idx;
    //     used_col_idx = used_col_idx + 1;
    //     appendLabel2Widget(ntc.name(rgb2hex(tooltip_color))[1], tooltip_color);
    // }
    // else {
        if(!click_flag){ //first time click
            click_flag = true;
            class_to_color_idx[event.target.className] = used_col_idx;
            tooltip_color = "rgb" + COLORS[used_col_idx];
            used_col_idx = used_col_idx + 1;
            appendLabel2Widget(ntc.name(rgb2hex(tooltip_color))[1], tooltip_color);
        }
        else{
            tooltip_color = "rgb" + COLORS[used_col_idx-1];
        }
    // }
    cccccc = tooltip_color;
    let tip = new TestTooltip(event.target, tooltip_color);

    if (!tooltip_node || event.target.className != tooltip_node.className) {
        for (let i = 0; i < selected_nodes.length; i++) {
            selected_nodes[i].style.outline = "none";
        }
        selected_nodes = [];
    }
    selected_nodes.push(event.target);
    tooltip_node = event.target;
    event.target.style.outline = '3px dotted ' + tooltip_color;
    tooltip_node.style['outline-offset'] = '-3px';
    let field_label = ntc.name(rgb2hex(tooltip_color))[1];
    let data_to_push = {};
    data_to_push[field_label] = event_target;
    collected_data.push(data_to_push);
}

function updateTooltip(idx, color) {
    if(tooltipBoxIdx)
        destroyTooltip();
    tooltipBoxIdx = idx;
    let box = globalBlocks[idx]['-att-box'];
    $(box).popover("show");
    $('.popover').css('background-color', color);
    //$('.popover.top .arrow').css('border-top-color', color);
}

function destroyTooltip() {
    let box = globalBlocks[tooltipBoxIdx]['-att-box'];
    $(box).popover("hide");
    tooltipBoxIdx = undefined;
}

function isEmptyArray(arr) {
    if (arr && arr.length==0)
        return true;
    return false;
}

function deselectVipsBlock(idx) {
    let idxClusterColor = getClusterColorFromIndex(idx);
    let box = globalBlocks[idx]['-att-box'];

    // reset border
    box.style.border = "2px solid rgba(0,0,0,0)";
    box.style.borderLeft = "2.5px solid " + idxClusterColor;

    // remove from selectedBlockIndices
    selectedBlockIndices.splice(selectedBlockIndices.indexOf(idx), 1);

    // hide tooltip
    $(box).popover("hide");
}

function deselectVipsBlockArray(arrayIndices) {
    for (let i = 0; i < arrayIndices.length; i++) {
        deselectVipsBlock(arrayIndices[i]);
    }
}

/*
 * returns color corresponding to cluster of block 'idx' from CSS_COLOR_NAMES in wdvKMeans.js
 */
function getClusterColorFromIndex(idx) {
    return CSS_COLOR_NAMES[id2cluster[idx]];
}

/*
 * returns vips globalBlocks Index for box id if validation succeeds
 */
function getVipsIndexFromBoxId(strIdx) {
    // validate vips block
    let vipsBoxIdPattern =  /vips(\d+)$/i;
    let regMatch = strIdx.match(vipsBoxIdPattern);
    if(regMatch) {
        // parse index
        let idx = parseInt(regMatch[1]);
        return idx;
    }
    // false for error checking
    return false;
}

function assignLabel() {
    for (let i = 0; i < selectedBlockIndices.length; i++) {
        let idx = selectedBlockIndices[i];
        labels[idx] = label;
        // change colors & cluster & id2cluster
    }
}

function deleteSubtreeOfSelectedBlocks() {
    destroyTooltip();
    for(let i = 0; i < selectedBlockIndices.length; i++) {
        let idx = selectedBlockIndices[i];
        let box = globalBlocks[idx]['-att-box'];
        box.style.visibility = "hidden";
    }
    selectedBlockIndices = [];
}

function removeFromClusterClass() {
    destroyTooltip();
    for(let i = 0; i < selectedBlockIndices.length; i++) {
        let idx = selectedBlockIndices[i];
        let box = globalBlocks[idx]['-att-box'];
        box.style.border = "none";
        let clusterid = id2cluster[idx];
        if (clusters[clusterid].indexOf(idx) > -1)
            clusters[clusterid].splice(idx, 1);
        id2cluster[idx] = undefined;
    }
    selectedBlockIndices = [];
}

function selectCluster() {
    let clusterid = id2cluster[tooltipBoxIdx];
    let clusterColor = getClusterColorFromIndex(tooltipBoxIdx);
    if(clusterid){
        for (let i = 0; i < clusters[clusterid].length; i++) {
            let idx = clusters[clusterid][i];
            if(selectedBlockIndices.indexOf(idx) < 0)
                selectedBlockIndices.push(idx);
            let box = globalBlocks[idx]['-att-box'];
            box.style.border = "2px solid " + clusterColor;
        }
    }
}

function alignSelectionWithClusterClass() {
    for(let i = 0; i < selectedBlockIndices.length; i++) {
        let idx = selectedBlockIndices[i];
        let box = globalBlocks[idx]['-att-box'];
        box.style.borderStyle = "dotted";
    }

    destroyTooltip();
    alignSelectionWithClusterClassFlag = true;
}

function alignWithSelectedBlockCluster(idx, clusterColor) {
    let clusterId = id2cluster[idx];

    for(let i = 0; i < selectedBlockIndices.length; i++) {
        let idx = selectedBlockIndices[i];
        let currentClusterId = id2cluster[idx];
        if (clusters[currentClusterId].indexOf(idx) > -1)
            clusters[currentClusterId].splice(idx, 1);
        clusters[clusterId].push(idx);
        id2cluster[idx] = clusterId;
    }
    deselectVipsBlockArray(selectedBlockIndices);
    alignSelectionWithClusterClassFlag = false;
}

// function to convert hex format to a rgb color
function rgb2hex(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

let appendbox = [];
 appendLabel2Widget = function(labelName, labelColor) {
    labels_list.push(labelName);
    let labelId = labelColor.substring(4, labelColor.length - 1).replace(',','-').replace(',','-');
    ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe').find('ul').append('' +
        '<li class="widget-labels-li" id = '+ labelId +'> ' +
        '<svg class="widget-label-circle-svg" height="10" width="10"> ' +
        '<circle cx="5" cy="5" r="4" stroke= '+ labelColor +' stroke-width="1.5" fill="white" />' +
        ' </svg>'+ labelName +'</li>');

    ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe').find('ul').find('li#'+labelId).click(function(e) {
        // $(e.target).hide();

        let current = e;
        let label_name = current.target.innerText;
        // console.log(ContentFrame.findElementInContentFrame('#delete_label_id', '#webdataview-floating-widget').length);
        for(i = 0; i < appendbox.length; i++){
            $('#'+appendbox[i]).remove();
        }
        appendbox = [];
        appendbox.push(labelId);

        let widget_delete_label = new ContentFrame({
            'id': labelId,
            'class':'delete_label_class',
            'appendTo': '#webdataview-floating-widget',
            'css': ['lib/font-awesome/css/font-awesome.css'],
            'js': ['app/contentScript/webView/label_delete.js'],
            'inlineCss': {"width": "200px", "height": "165px", "border": "none", "border-radius": 6,
                "margin-top": "60px", "background-color": "black",  "position": "fixed", "z-index": 2147483647, "overflow-y": "hidden"}
        });
        let tooltip_html = $.parseHTML('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">' +
            '<div>' +
            '<input type="text" name="searchTxt" id="searchTxt" maxlength="10" value="' + label_name + '" />' +
            '<label for="text"> Change label name here:</label> ' +
            '<div>'+
            '<button style="display: inline-block" type="button" class="btn btn-warning" id="label_delete">Delete</button>'+
            '<button style="display: inline-block" type="button" class="btn btn-info" id="label_change">Change</button><br>' +
            '<button style="display: inline-block" type="button" class="btn btn-danger" id="label_close">Closed</i></button>' +
            '<button style="display: inline-block" type="button" class="btn btn-success" id="label_records">Records</i></button>' +
            '</div>'+
            '</div>');

        widget_delete_label.body.append(tooltip_html);
        // ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe').find('ul').append('' +
        //     '<li class="widget-labels-li" id = '+ labelId +'> ' +
        //     '<svg class="widget-label-circle-svg" height="10" width="10"> ' +
        //     '<circle cx="5" cy="5" r="4" stroke= '+ labelColor +' stroke-width="1.5" fill="white" />' +
        //     ' </svg>'+ 'not working' +'</li>');
        ContentFrame.findElementInContentFrame('#label_delete', '#'+labelId).click(function(e) {
            $(current.target).hide();
            for(d = 0; d < apply_array.length; d++) {
                apply_array[d].style.outline = null;
            }
            apply_array = [];
            click_flag = false;
            $('#webview-popper-container').remove();
            ContentFrame.findElementInContentFrame('#' + e.target.id, '#'+labelId).hide();
            for(i = 0; i < labels_list.length; i++){
                if(labels_list[i] === label_name){
                    labels_list.splice(i, 1);
                }
            }
            let new_collect = [];
            for(i = 0; i < collected_data.length; i++){
                if(Object.keys(collected_data[i])[0] === label_name){
                    continue;
                }
                else{
                    new_collect.push(collected_data[i]);
                }
            }
            $('#'+labelId).remove();
            collected_data = new_collect;
            chrome.storage.local.get("value", function(items) {
                if (!chrome.runtime.error) {
                    let array = items["value"];
                    let new_array = [];
                    for(let i = 0; i < array.length; i++){
                        let cur_json = JSON.parse(array[i]);
                        if(cur_json.label !== label_name){
                            new_array.push(JSON.stringify(cur_json))
                        }
                    }
                    chrome.storage.local.set({'value': new_array});
                }
            });
        });

        let close_action = ContentFrame.findElementInContentFrame('#label_close', '#'+labelId);
        close_action.click(function(e) {
            e.preventDefault();
            $('#'+labelId).remove();
        });
        let records_action = ContentFrame.findElementInContentFrame('#label_records', '#'+labelId);
        records_action.click(function(e) {
            e.preventDefault();

            records_html = $.parseHTML('<input type="text" name="searchTxt" id="searchTxt" maxlength="10" value="records" />');
            noti_records = ContentFrame.findElementInContentFrame('#searchTxt', '#'+labelId);
            noti_records.replaceWith(records_html);
            let input_label = "records";
            let old = current.target.innerHTML;
            let first = old.substring(0, old.lastIndexOf(">")+1);
            current.target.innerHTML = first + input_label;

            for(i = 0; i < labels_list.length; i++){
                if(labels_list[i] === label_name){
                    labels_list[i] = input_label;
                }
            }
            for(i = 0; i < collected_data.length; i++){
                if(Object.keys(collected_data[i])[0] === label_name){
                    let new_pair = {};
                    new_pair[input_label] = Object.values(collected_data[i])[0];
                    collected_data[i] = new_pair;
                }
            }

            chrome.storage.local.get("value", function(items) {
                if (!chrome.runtime.error){
                    let array = items["value"];
                    let new_array = [];
                    for(let i = 0; i < array.length; i++){
                        let cur_json = array[i];
                        if(cur_json.label === label_name){
                            cur_web_noti.changeLabelName(label_name, input_label);
                            new_array.push(JSON.stringify(cur_web_noti.toJSON()))
                        }
                        else{
                            new_array.push(cur_json);
                        }
                    }
                    chrome.storage.local.set({'value': new_array});
                    let new_noti = new WebDataExtractionNotation(JSON.parse(new_array[0])[0]);
                    console.log(new_noti.matchquery());
                }
            });
        });

        let change_action = ContentFrame.findElementInContentFrame('#label_change','#'+labelId);
        change_action.click(function(e) {
            e.preventDefault();
            let input_label = ContentFrame.findElementInContentFrame('#searchTxt', '#'+labelId);
            input_label = input_label.get(0).value;
            let old = current.target.innerHTML;
            let first = old.substring(0, old.lastIndexOf(">")+1);
            current.target.innerHTML = first + input_label;

            for(i = 0; i < labels_list.length; i++){
                if(labels_list[i] === label_name){
                    labels_list[i] = input_label;
                }
            }
            for(i = 0; i < collected_data.length; i++){
                if(Object.keys(collected_data[i])[0] === label_name){
                    let new_pair = {};
                    new_pair[input_label] = Object.values(collected_data[i])[0];
                    collected_data[i] = new_pair;
                }
            }
            // if(input_label === "records"){return;}

            chrome.storage.local.get("value", function(items) {
                if (!chrome.runtime.error){
                    let array = items["value"];
                    let new_array = [];
                    for(let i = 0; i < array.length; i++){
                        let cur_json = array[i];
                        if(cur_json.label === label_name){
                            cur_web_noti.changeLabelName(label_name, input_label);
                            new_array.push(JSON.stringify(cur_web_noti.toJSON()))
                        }
                        else{
                            new_array.push(cur_json);
                        }
                    }
                    chrome.storage.local.set({'value': new_array});
                    // let new_noti = new WebDataExtractionNotation(JSON.parse(new_array[0])[0]);
                    // console.log(new_noti.matchquery());
                }
            });
        });
    });
};

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
}
