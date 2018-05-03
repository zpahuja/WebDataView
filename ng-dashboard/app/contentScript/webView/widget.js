/*
 * add container div
 * this container has class 'webdataview' so prefixed CSS can be applied to its descendants
 */
let web_data_view_widget_container = document.createElement('div');
web_data_view_widget_container.className = 'webdataview';
web_data_view_widget_container.id = 'webdataview-widget-container';
document.body.appendChild(web_data_view_widget_container);
// $('#webdataview-floating-widget').css('top', '0%');
// $('#webdataview-floating-widget').css('left', '75%');
// $('#webdataview-floating-widget').css('width', '25%');
// $('#webdataview-floating-widget').css('margin', '0px');
// $('#webdataview-floating-widget').css('border', '0px');

// add div containing iframe
let web_data_view_widget = document.createElement('div');
web_data_view_widget.id = 'webdataview-floating-widget';
document.getElementById('webdataview-widget-container').appendChild(web_data_view_widget);

// add floating widget iframe
let widget_iframe_cf = new ContentFrame({
    'id':'webdataview-widget-iframe',
    'class': 'webdataview-iframe',
    'appendTo': '#webdataview-floating-widget'
});
let widget_iframe = widget_iframe_cf.body;
let port_tb = chrome.runtime.connect({name: "tbtb"});
chrome.storage.local.set({'value': []});

/**
 * add scripts to widget <head> tag
 * important note: don't add any scripts here if they need to access iFrame's DOM which has not loaded yet
 * load any scripts that access iFrame DOM in callback for widget_iframe.load()
 */

$(document).ready(function(){

    // make widget draggable and resizable
    // stop callback very important for responsive-ness
    $('#webdataview-floating-widget').draggable({
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

    /**
     * make iframe responsize to window resize
     * takes optional callback function parameter
     */
    function setIframeDimensions(callback) {
        $('#webdataview-widget-iframe').css({
            "top": Math.abs(parseFloat($('#webdataview-floating-widget').height()) - parseFloat($('#webdataview-widget-iframe').height()))/2.0,
            "width": Math.abs(parseFloat($('#webdataview-floating-widget').width()) - 40)
        });
        typeof callback === 'function' && callback();
    }
    setIframeDimensions();
    $(window).resize(setIframeDimensions);

    // make sure JS libraries and CSS load before body's HTML using callbacks
    widget_iframe_cf.loadJS('lib/jquery/jquery-3.1.1.min.js', function() {
        widget_iframe_cf.loadCSS('lib/font-awesome/css/font-awesome.css', function() {
            widget_iframe_cf.loadCSS('assets/css/content-frame-internal.css', function() {

                /**
                 * load widget html
                 * note: only load the body, not the entire html
                 */
                widget_iframe.load(chrome.extension.getURL("app/contentScript/webView/widget.html"), function() {
                    widget_iframe.ready(function() {
                        // hide left menu buttons (scroll buttons and download button)

                        let widget_download_button = ContentFrame.findElementInContentFrame('#widget-download-data', '#webdataview-widget-iframe');
                        widget_download_button.hide();

                        // hide/show download button on hover
                        $('#webdataview-floating-widget').hover(
                            function() {
                                widget_download_button.show(0, '', function() {
                                    // important for responsiveness
                                    // TODO use callback
                                    setWidgetLabelsWidth(/*function() {
                                     console.log('callback called on hover end');
                                     setTimeout(function() { positionShadowOnWidgetLabels(); }, 100);
                                     }*/);
                                    setTimeout(function() { positionShadowOnWidgetLabels(); }, 100);
                                });
                            }, function() {
                                widget_download_button.hide(0, '', function() {
                                    // TODO use callback
                                    setWidgetLabelsWidth(/*function() {
                                     console.log('callback called on hover end');
                                     setTimeout(function() { positionShadowOnWidgetLabels(); }, 100);
                                     }*/);
                                    setTimeout(function() { positionShadowOnWidgetLabels(); }, 100);
                                });
                            }
                        );
                        function isEmpty(obj) {
                            for(let key in obj) {
                                if(obj.hasOwnProperty(key))
                                    return false;
                            }
                            return true;
                        }

                        function isDescendant(parent, child) {
                            let node = child.parentNode;
                            while (node != null) {
                                if (node == parent) {
                                    return true;
                                }
                                node = node.parentNode;
                            }
                            return false;
                        }
                        let query_view = ContentFrame.findElementInContentFrame('#search-btn', '#webdataview-widget-iframe');
                        query_view.click(function(e){
                            e.preventDefault();
                            $('#webview-query').toggle();
                        });
                        let widget_label_selector = ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe');
                        let grid_view = ContentFrame.findElementInContentFrame('#grid-view', '#webdataview-widget-iframe');
                        let select_apply = ContentFrame.findElementInContentFrame('#select-apply', '#webdataview-widget-iframe');
                        let record_flag = false;
                        let tb_output = [];
                        let record_dom = [];
                        let non_record = [];
                        select_apply.click(function(e){
                            e.preventDefault();
                            mySet.clear();
                            click_flag = false;
                            if(Object.keys(cur_query).length === 1){
                                for(d = 0; d < apply_array.length; d++) {
                                    apply_array[d].style.outline = '2px solid ' + cccccc;
                                }
                            }
                            else{
                                cur_query.applySelectedElements(tooltip_color);
                                let n = {'label':field_label};
                                n['query'] = JSON.parse(cur_query.toJSON());
                                cur_web_noti = new WebDataExtractionNotation(n);
                                chrome.storage.local.get("value", function(items) {
                                    if (!chrome.runtime.error) {
                                        let array = items["value"];
                                        // console.log(typeof(cur_web_noti.toJSON()[0])['query']);
                                        let output = cur_web_noti.toJSON()[0];
                                        output['query'] = JSON.parse((cur_web_noti.toJSON()[0])['query']);
                                        array[array.length] = output;
                                        // array[array.length] = cur_web_noti.toJSON()[0];
                                        chrome.storage.local.set({'value': array});
                                    }
                                });
                            }
                            apply_array = [];
                            cur_query = new Query({});
                            cccccc = null;
                            tooltip_color = null;
                        });

                        grid_view.click(function(e){
                            e.preventDefault();
                            for(i = 0; i < collected_data.length; i++) {
                                if(collected_data[i] === {}){
                                    console.log("Find one");
                                    console.log(i);
                                    collected_data.splice(i, 1);
                                }
                                else if (Object.keys(collected_data[i])[0] === "records") {
                                    record_flag = true;
                                    break;
                                }
                            }
                            if(!record_flag){
                                alert("Please select boxs and change the label to <records>!");
                            }
                            else{
                                for(i = 0; i < collected_data.length; i++){
                                    if(Object.keys(collected_data[i])[0] === "records"){
                                        record_dom.push(Object.values(collected_data[i])[0]);
                                    }
                                    else{
                                        non_record.push(collected_data[i]);
                                        // console.log(c.textContent);
                                    }
                                }
                                let pair = {};
                                let currentParent;
                                let potential_child;
                                let textName;
                                for(i = 0; i < record_dom.length; i++){
                                    currentParent = record_dom[i];
                                    for(j =0; j < non_record.length; j++){
                                        potential_child = Object.values(non_record[j])[0];
                                        if(isDescendant(currentParent, potential_child)){
                                            textName = Object.values(non_record[j])[0];
                                            textName = textName.textContent;
                                            pair[Object.keys(non_record[j])[0]] = textName;
                                        }
                                    }
                                    if( Object.keys(pair).length > 0){
                                        tb_output.push(pair);
                                        pair = {};
                                    }
                                }
                                port_tb.postMessage({answer: "table view", tb_output: tb_output});
                                chrome.storage.local.get("value", function(items) {
                                    if (!chrome.runtime.error) {
                                        let array = items["value"];
                                        let new_array = [];
                                        for(let j = 0; j < array.length; j++){
                                            if(typeof(array[j]) === 'string'){
                                                let currentout = JSON.parse(array[j])[0];
                                                currentout["query"] = JSON.parse(currentout["query"]);
                                                new_array.push(currentout);
                                            }
                                            else{
                                                new_array.push(JSON.parse(JSON.stringify(array[j])));
                                            }
                                        }
                                        console.log(new_array);
                                        port_tb.postMessage({answer: "leave", domain_name: location.href, capa: new_array});
                                        // chrome.storage.local.clear(function() {
                                        //     let error = chrome.runtime.lastError;
                                        //     if (error) {
                                        //         console.error(error);
                                        //     }
                                        // });
                                    }
                                });
                            }
                        });
                        // set widget label width
                        function setWidgetLabelsWidth() {
                            let vert_sep_selector = ContentFrame.findElementInContentFrame('.widget-vertical-separator', '#webdataview-widget-iframe');
                            let scroll_btn_selector = ContentFrame.findElementInContentFrame('.widget-scroll-buttons', '#webdataview-widget-iframe');
                            widget_label_selector.width(parseFloat(scroll_btn_selector.offset().left) - (parseFloat(vert_sep_selector.offset().left) + parseFloat(vert_sep_selector.outerWidth()) + parseFloat(vert_sep_selector.css('margin-right'))) -2);
                        }
                        setTimeout(function() { setWidgetLabelsWidth(); }, 100);
                        $(window).resize(setWidgetLabelsWidth);

                        // show/ hide scrollbar
                        widget_label_selector.on("scrollstart", function() {
                            ContentFrame.findElementInContentFrame('#web-view-widget', '#webdataview-widget-iframe').addClass('show-scrollbar');
                        });
                        widget_label_selector.on("scrollstop", function() {
                            ContentFrame.findElementInContentFrame('#web-view-widget', '#webdataview-widget-iframe').removeClass('show-scrollbar');
                        });

                        // position shadow inset on top of widget labels
                        let widget_labels_shadow_box = ContentFrame.findElementInContentFrame('.widget-labels-shadow-box', '#webdataview-widget-iframe');
                        function positionShadowOnWidgetLabels() {
                            widget_labels_shadow_box.css({
                                'top': parseFloat(widget_label_selector.offset().top) - 20,
                                'left': parseFloat(widget_label_selector.offset().left),
                                'width': widget_label_selector.width(),
                                'height': 75});
                        }
                        setTimeout(function() { positionShadowOnWidgetLabels(); }, 300);
                        $(window).resize(positionShadowOnWidgetLabels);

                        /******************************** Floating Widget Menu API ********************************/

                        let FloatingWidgetMenu = {};

                        /**
                         * append label to floating widget
                         * params: label title and color in rgb, rgba, hex or name
                         */
                        FloatingWidgetMenu.appendLabel = function(labelName, labelColor) {
                            widget_label_selector.find('ul').append('<li class="widget-labels-li" id = '+ labelColor +'>' +
                                ' <svg class="widget-label-circle-svg" height="10" width="10"> ' +
                                '<circle cx="5" cy="5" r="4" stroke= '+ labelColor +' stroke-width="1.5" fill="white" /> ' +
                                '</svg>'+ labelName +'</li>');
                        };

                        /*
                         for (let i = 0; i < 15; i++) {
                         FloatingWidgetMenu.appendLabel('redy', 'red');
                         }
                         */
                    });
                });
            });
        });
    });
});