/**
 * Web data extraction notation library
 *
 * @class
 * @requires jQuery
 * @param {Object[]} notation
 * @param {string} notation.label label name of the data field
 * @param {Object} notation.query query for matching DOM elements to the data field
 * @param {string} notation.query.class name of class of elements to match
 * @param {string} notation.query.id id of elements to match
 * @param {string} notation.query.xpath xpath of elements to match
 * @param {Array} notation.query.tag array of string representation of HTML tags ["div", "img", "p", "h1", "a"]
 * @param {string} notation.query.jQuery_selector jQuery selector of elements to match
 * @param {Array} notation.query.css list of dictionary of CSS style properties of elements to match
 * @param {string} notation.query.regex regular expression of text of HTML element to match
 * @param {Function} notation.query.function custom function by developer
 * @example
 * // example below shows how to create a fixed position footer
 * const example_notation = new WebDataExtractionNotation([{
 *  'label': 'price',
 *  'query': {
 *    'id': 'price',
 *    'class': 'price-class',
 *    'tag': ["div"],
 *    'css': {"color":"rgb(0, 102, 192)"},
 *    'regex': "^\S+@\S+$",
 *    'function': function() {}
 *  }
 * ]);
 * example_notation.extract();
 * q = new Query
 * q.css = {"color":"rgb(0, 102, 192)"}
 */

class WebDataExtractionNotation {

    constructor(notation) {

        this.notations = {};

        if (!Array.isArray(notation)) {
            notation = [notation]
        }

        for (let i = 0; i < notation.length; i++) {
            let label = notation[i]['label'];
            if (typeof(notation[i]['query']) === 'string') {
                notation[i]['query'] = JSON.parse(notation[i]['query']);
            }
            let query = notation[i]['query'];
            this.notations[label] = new Query(query);
        }

        this.colors = ["(2,63,165)", "(125,135,185)", "(190,193,212)", "(214,188,192)", "(187,119,132)", "(142,6,59)", "(74,111,227)", "(133,149,225)", "(181,187,227)", "(230,175,185)", "(224,123,145)", "(211,63,106)", "(17,198,56)", "(141,213,147)", "(198,222,199)", "(234,211,198)", "(240,185,141)", "(239,151,8)", "(15,207,192)", "(156,222,214)", "(213,234,231)", "(243,225,235)", "(246,196,225)", "(247,156,212)"];
        this.color_index = 0;
        this.label2color = {};
        shuffle(this.colors);
    }

    /**
     * match DOM elements with notation query
     * @returns list of DOM elements matching the notation query
     */
    matchquery() {
        this.data = {};

        for (var label in this.notations) {
            let q = (this.notations)[label];
            this.data[label] = q.execute();
        };

        return this.data;
    }

    /**
     * extract data by matching querys with DOM elements on the webpage and label data
     */
    extract() {
        let data = this.matchquery();

        // add label and color using color pallette
        for (var label in data) {
            let color = "rgb" + this.colors[this.color_index];
            this.color_index += 1;
            this.label2color[label] = color;
            this.appendLabel2Widget(label, color);
        };

        return data;
    }
    // appendLabel2Widget = function(labelName, labelColor) {
    //     let labelId = labelColor.substring(4, labelColor.length - 1).replace(',','-').replace(',','-');
    //     ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe').find('ul').append('' +
    //         '<li class="widget-labels-li" id = '+ labelId +'> ' +
    //         '<svg class="widget-label-circle-svg" height="10" width="10"> ' +
    //         '<circle cx="5" cy="5" r="4" stroke= '+ labelColor +' stroke-width="1.5" fill="white" />' +
    //         ' </svg>'+ labelName +'</li>');
    //     ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe').find('ul').find('li#'+labelId).click(function(e) {
    //         // $(e.target).hide();
    //         let current = e;
    //         let label_name = current.target.innerText;
    //         function changeFunction(e){
    //             console.log("not working");
    //         }
    //         // console.log(ContentFrame.findElementInContentFrame('#delete_label_id', '#webdataview-floating-widget').length);
    //         let widget_delete_label = new ContentFrame({
    //             'id': labelId,
    //             'class':'delete_label_class',
    //             'appendTo': '#webdataview-floating-widget',
    //             'css': ['lib/font-awesome/css/font-awesome.css'],
    //             'js': ['app/contentScript/webView/label_delete.js'],
    //             'inlineCss': {"width": "200px", "height": "165px", "border": "none", "border-radius": 6,
    //                 "margin-top": "60px", "background-color": "black"}
    //         });
    //         let tooltip_html = $.parseHTML('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">' +
    //             '<div>' +
    //             '<input type="text" name="searchTxt" id="searchTxt" maxlength="10" value="' + label_name + '" />' +
    //             '<label for="text"> Change label name here:</label> ' +
    //             '<div>'+
    //             '<button style="display: inline-block" type="button" class="btn btn-warning" id="label_delete">Delete</button>'+
    //             '<button style="display: inline-block" type="button" class="btn btn-info" id="label_change">Change</button><br>' +
    //             '<button style="display: inline-block" type="button" class="btn btn-danger" id="label_close">Close</i></button>' +
    //             '<button style="display: inline-block" type="button" class="btn btn-success" id="label_records">Records</i></button>' +
    //             '</div>'+
    //             '</div>');
    //
    //         widget_delete_label.body.append(tooltip_html);
    //         // ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe').find('ul').append('' +
    //         //     '<li class="widget-labels-li" id = '+ labelId +'> ' +
    //         //     '<svg class="widget-label-circle-svg" height="10" width="10"> ' +
    //         //     '<circle cx="5" cy="5" r="4" stroke= '+ labelColor +' stroke-width="1.5" fill="white" />' +
    //         //     ' </svg>'+ 'not working' +'</li>');
    //         ContentFrame.findElementInContentFrame('#label_delete', '#'+labelId).click(function(e) {
    //             $(current.target).hide();
    //             ContentFrame.findElementInContentFrame('#' + e.target.id, '#'+labelId).hide();
    //             for(i = 0; i < labels_list.length; i++){
    //                 if(labels_list[i] === label_name){
    //                     labels_list.splice(i, 1);
    //                 }
    //             }
    //             let new_collect = [];
    //             for(i = 0; i < collected_data.length; i++){
    //                 if(Object.keys(collected_data[i])[0] === label_name){
    //                     continue;
    //                 }
    //                 else{
    //                     new_collect.push(collected_data[i]);
    //                 }
    //             }
    //             collected_data = new_collect;
    //             chrome.storage.local.get("value", function(items) {
    //                 if (!chrome.runtime.error) {
    //                     let array = items["value"];
    //                     let new_array = [];
    //                     for(let i = 0; i < array.length; i++){
    //                         let cur_json = JSON.parse(array[i]);
    //                         if(cur_json.label !== label_name){
    //                             new_array.push(JSON.stringify(cur_json))
    //                         }
    //                     }
    //                     chrome.storage.local.set({'value': new_array});
    //                 }
    //             });
    //         });
    //
    //         let close_action = ContentFrame.findElementInContentFrame('#label_close', '#'+labelId);
    //         close_action.click(function(e) {
    //             e.preventDefault();
    //             $('#'+labelId).remove();
    //         });
    //         let records_action = ContentFrame.findElementInContentFrame('#label_records', '#'+labelId);
    //         records_action.click(function(e) {
    //             e.preventDefault();
    //             let input_label = "records";
    //             let old = current.target.innerHTML;
    //             let first = old.substring(0, old.lastIndexOf(">")+1);
    //             current.target.innerHTML = first + input_label;
    //
    //             for(i = 0; i < labels_list.length; i++){
    //                 if(labels_list[i] === label_name){
    //                     labels_list[i] = input_label;
    //                 }
    //             }
    //             for(i = 0; i < collected_data.length; i++){
    //                 if(Object.keys(collected_data[i])[0] === label_name){
    //                     let new_pair = {};
    //                     new_pair[input_label] = Object.values(collected_data[i])[0];
    //                     collected_data[i] = new_pair;
    //                 }
    //             }
    //         });
    //
    //         let change_action = ContentFrame.findElementInContentFrame('#label_change','#'+labelId);
    //         change_action.click(function(e) {
    //             e.preventDefault();
    //             let input_label = ContentFrame.findElementInContentFrame('#searchTxt', '#'+labelId);
    //             input_label = input_label.get(0).value;
    //             let old = current.target.innerHTML;
    //             let first = old.substring(0, old.lastIndexOf(">")+1);
    //             current.target.innerHTML = first + input_label;
    //
    //             for(i = 0; i < labels_list.length; i++){
    //                 if(labels_list[i] === label_name){
    //                     labels_list[i] = input_label;
    //                 }
    //             }
    //             for(i = 0; i < collected_data.length; i++){
    //                 if(Object.keys(collected_data[i])[0] === label_name){
    //                     let new_pair = {};
    //                     new_pair[input_label] = Object.values(collected_data[i])[0];
    //                     collected_data[i] = new_pair;
    //                 }
    //             }
    //             // if(input_label === "records"){return;}
    //
    //             chrome.storage.local.get("value", function(items) {
    //                 if (!chrome.runtime.error){
    //                     let array = items["value"];
    //                     let new_array = [];
    //                     for(let i = 0; i < array.length; i++){
    //                         let cur_json = array[i];
    //                         if(cur_json.label === label_name){
    //                             cur_web_noti.changeLabelName(label_name, input_label);
    //                             new_array.push(JSON.stringify(cur_web_noti.toJSON()))
    //                         }
    //                         else{
    //                             new_array.push(cur_json);
    //                         }
    //                     }
    //                     chrome.storage.local.set({'value': new_array});
    //                     let new_noti = new WebDataExtractionNotation(JSON.parse(new_array[0])[0]);
    //                     console.log(new_noti.matchquery());
    //                 }
    //             });
    //         });
    //     });
    // };
    disappendLabel2Widget(){
        let widget_new_html = $.parseHTML('<div class="widget-labels widget-float-left" id="widget-labels"><ul class="widget-labels-ul"></ul></div>');
        ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe').replaceWith(widget_new_html);
    }
    appendLabel2Widget(labelName, labelColor) {

        let labelId = labelColor.substring(4, labelColor.length - 1).replace(',', '-').replace(',', '-');
        ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe').find('ul').append('<li class="widget-labels-li" id = ' + labelId + '> <svg class="widget-label-circle-svg" height="10" width="10"> <circle cx="5" cy="5" r="4" stroke= ' + labelColor + ' stroke-width="1.5" fill="white" /> </svg>' + labelName + '</li>');
        // ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe').find('ul').find('li#' + labelId).click(function(e) {
        //     let circle = $(e.target).find('svg').find('circle');
        //     let circle_fill_color = circle.css("fill") == "rgb(255, 255, 255)" ? labelColor : "rgb(255, 255, 255)";
        //     circle.css({
        //         "fill": circle_fill_color
        //     });
        //
        //     // toggle fields
        //     for (let i = 0; i < collected_data.length; i++) {
        //         let field_label = ntc.name(rgb2hex(labelColor))[1];
        //         if (field_label in collected_data[i]) {
        //             if (circle_fill_color == "rgb(255, 255, 255)") {
        //                 collected_data[i][field_label].style.outline = "none";
        //             } else {
        //                 collected_data[i][field_label].style.outline = '2px solid ' + circle_fill_color;
        //             }
        //         }
        //     }
        // });
        ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe').find('ul').find('li#'+labelId).click(function(e) {
            // $(e.target).hide();
            let current = e;
            let label_name = current.target.innerText;
            function changeFunction(e){
                console.log("not working");
            }
            // console.log(ContentFrame.findElementInContentFrame('#delete_label_id', '#webdataview-floating-widget').length);
            let widget_delete_label = new ContentFrame({
                'id': labelId,
                'class':'delete_label_class',
                'appendTo': '#webdataview-floating-widget',
                'css': ['lib/font-awesome/css/font-awesome.css'],
                'js': ['app/contentScript/webView/label_delete.js'],
                'inlineCss': {"width": "200px", "height": "165px", "border": "none", "border-radius": 6,
                    "margin-top": "60px", "background-color": "black"}
            });
            let tooltip_html = $.parseHTML('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">' +
                '<div>' +
                '<input type="text" name="searchTxt" id="searchTxt" maxlength="10" value="' + label_name + '" />' +
                '<label for="text"> Change label name here:</label> ' +
                '<div>'+
                '<button style="display: inline-block" type="button" class="btn btn-warning" id="label_delete">Delete</button>'+
                '<button style="display: inline-block" type="button" class="btn btn-info" id="label_change">Change</button><br>' +
                '<button style="display: inline-block" type="button" class="btn btn-danger" id="label_close">Close</i></button>' +
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
                        let new_noti = new WebDataExtractionNotation(JSON.parse(new_array[0])[0]);
                        console.log(new_noti.matchquery());
                    }
                });
            });
        });

    };

    /**
     * show selection of DOM elements on the web page
     */
    selectElements() {

    }

    /**
     * append matching elements to selected nodes and show selection of DOM elements on the web page
     */
    appendElementsToSelection() {

    }

    // changeLabelName
    changeLabelName(oldLabelName, newLabelName) {
        if (oldLabelName !== newLabelName) {
            // change matched elements
            // Object.defineProperty(this.data, newLabelName,
            //     Object.getOwnPropertyDescriptor(this.data, oldLabelName));
            // delete(this.data)[oldLabelName];

            // change notation-query
            Object.defineProperty(this.notations, newLabelName,
                Object.getOwnPropertyDescriptor(this.notations, oldLabelName));
            delete(this.notations)[oldLabelName];
        }
    }

    /**
     * highlights elements that match a label
     */
    highlightLabel(label) {
        let label_color = this.label2color[label];
        this.notations[label].highlightSelectedElements(label_color);
    }

    toJSON() {
        var jsonNotations = [];

        for (var label in this.notations) {
            jsonNotations.push({
                'label': label,
                'query': this.notations[label].toJSON()
            });
        };
        // return JSON.stringify(jsonNotations);
        return jsonNotations;
    }
}