// workaround jquery conflicts with other libs
$.noConflict();
jQuery( document ).ready(function( $ ) {

    // set img source for left and right chevron arrow buttons in widget
    $('#widget-left-arrow').attr('src', chrome.extension.getURL("assets/images/chevron-left.svg"));
    $('#widget-right-arrow').attr('src', chrome.extension.getURL("assets/images/chevron-right.svg"));

    // move cursor icon for widget
    $('#web-view-widget').css({ "cursor": "move" });
    $('#web-view-widget').children().css({ "cursor": "default" });

    // if bootstrap doesn't load, try again
    if (typeof $().modal != 'function') {
        console.log("bootstrap failed to load. reloading from network. internet connection required");
        var $head = $('head');
        $head.append('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
        $head.append('<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>');
        $head.append('<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>');
    }

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

    var $popover = $('[data-toggle="popover"]');
    var popover_block_index, $popover_block;
    var POPOVER_BUTTON_IDS = ["web-view-assign-label", "web-view-select-similar", "web-view-merge", "web-view-remove"];
    var selected_class, highlighted_colors = {}, used_col_idx = 0;
    var COLORS = ["(2,63,165)","(125,135,185)","(190,193,212)","(214,188,192)","(187,119,132)","(142,6,59)","(74,111,227)","(133,149,225)","(181,187,227)","(230,175,185)","(224,123,145)","(211,63,106)","(17,198,56)","(141,213,147)","(198,222,199)","(234,211,198)","(240,185,141)","(239,151,8)","(15,207,192)","(156,222,214)","(213,234,231)","(243,225,235)","(246,196,225)","(247,156,212)"];
    var class_to_color_index_map = {};
    var label_to_class_map = {};

    // prevent default on click and show/hide popover on click
    $(document).on('click', $popover, function(e) {

        $target = $(e.target);

        // handle widget label click events
        if ($target.is('li') && $target.parent().attr('class') == 'widget-labels') {
            if (highlighted_colors[$target.attr('id')]) {
                highlighted_colors[$target.attr('id')] = true;
                console.log($target.children().first().children().first());
                console.log($target.attr('id'));
                $target.children().first().children().first().attr("fill", $target.attr('id'));
            }
            else {
                highlighted_colors[$target.attr('id')] = false;
                console.log($target.children().first().children().first());
                console.log($target.attr('id'));
                $target.children().first().attr("fill", "white");
                selectSimilar();
            }


            return;
        }

        // handle popover button functions
        if (POPOVER_BUTTON_IDS.indexOf(e.target.id) != -1) {
            popoverController(e.target.id);
            return;
        }

        e.preventDefault();
        var curr_popover_block_index = getBlockIndex(e.target);
        // hide previous popover
        if ($popover_block && popover_block_index != curr_popover_block_index) {
            $popover_block.popover('hide');
            $popover_block.css({"outline": "initial"});
            if (selected_class) {
                $(selected_class).css({"outline": "initial"});
                selected_class = undefined;
            }
        }

        popover_block_index = curr_popover_block_index;
        $popover_block = $(globalBlocks[popover_block_index]['-att-box']);

        // show current popover
        $popover_block.popover('show');
        // align popover left with selected block left
        $(".popover").css({"left": $popover_block.position().left});

        // handle coloring
        var popover_color = getPopOverColor($popover_block.attr('class'));
        $popover_block.css({"outline": "rgb" + popover_color + " solid 2px"});
        return false;
    });

    // gets index of global block from DOM element, not Jquery selector
    function getBlockIndex(elem) { return parseInt(elem.getAttribute("block-index")); }

    // delegates popover button invocation to respective helper functions
    function popoverController(popover_button_id) {
        switch (popover_button_id) {
            case "web-view-assign-label":
                assignLabel();
                break;
            case "web-view-select-similar":
                selectSimilar();
                break;
            case "web-view-remove":
                removeFromSelection();
                break;
            case "web-view-merge":
                mergeElements();
                break;
        }
    }

    // function to convert hex format to a rgb color
    function rgb2hex(rgb){
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
    }

    function selectSimilar() {
        // deselect previously selected class
        if (selected_class) { $(selected_class).css({"outline": "initial"}); }

        selected_class = '.' + $popover_block.attr('class').replace(' ', '.').replace('.webViewRemoved','');
        selected_class_color = "rgb" + getPopOverColor($popover_block.attr('class'));
        $(selected_class).not('.webViewRemoved').css({"outline": selected_class_color + " solid 2px"});
    }

    function removeFromSelection() {
        $popover_block.addClass('webViewRemoved');
        $popover_block.css({"outline": "initial"});
        $popover_block.popover('hide');
    }

    function getPopOverColor(className) {
        var popover_color;

        if (className in class_to_color_index_map) {
            popover_color = COLORS[class_to_color_index_map[$popover_block.attr('class')]];
        }
        else {
            popover_color = COLORS[used_col_idx];
            class_to_color_index_map[className] = used_col_idx;
            label_name = ntc.name(rgb2hex("rgb" + popover_color))[1];
            label_to_class_map[label_name] = className;
            addLabel2Widget(label_name, "rgb" + popover_color);
            used_col_idx += 1;
        }
        return popover_color;
    }

    var addLabel2Widget = function(labelName, labelColor) {
        $(".widget-labels").append('<li class="widget-labels-li" id = ' + labelColor + '> <svg class="widget-label-circle-svg" height="10" width="10"> <circle cx="5" cy="5" r="4" stroke='+ labelColor + ' stroke-width="1.5" fill="white" /> </svg>'+labelName+'</li>');
    }

});