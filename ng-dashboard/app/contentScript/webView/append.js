/**
 * Created by Herbert on 4/12/2018.
 */

appendLabel2Widget = function(labelName, labelColor) {
    labels_list.push(labelName);
    let labelId = labelColor.substring(4, labelColor.length - 1).replace(',','-').replace(',','-');
    ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe').find('ul').append('' +
        '<li class="widget-labels-li" id = '+ labelId +'> ' +
        '<svg class="widget-label-circle-svg" height="10" width="10"> ' +
        '<circle cx="5" cy="5" r="4" stroke= '+ labelColor +' stroke-width="1.5" fill="white" />' +
        ' </svg>'+ labelName +'</li>');
    // ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe').find('ul').find('li#'+labelId).click(function(e) {
    //     let circle = $(e.target).find('svg').find('circle');
    //     let circle_fill_color = circle.css("fill") == "rgb(255, 255, 255)" ? labelColor : "rgb(255, 255, 255)";
    //     circle.css({"fill": circle_fill_color});
    //     // toggle fields
    //     for (let i = 0; i < collected_data.length; i++) {
    //         let field_label = ntc.name(rgb2hex(labelColor))[1];
    //         if (field_label in collected_data[i]) {
    //             if (circle_fill_color == "rgb(255, 255, 255)") {
    //                 collected_data[i][field_label].style.outline = "none";
    //             } else {
    //
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
                    let new_noti = new WebDataExtractionNotation(JSON.parse(new_array[0])[0]);
                    console.log(new_noti.matchquery());
                }
            });
        });
    });
};