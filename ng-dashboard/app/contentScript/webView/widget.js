/*
 * add container div
 * this container has class 'webdataview' so prefixed CSS can be applied to its descendants
 */
var web_data_view_widget_container = document.createElement('div');
web_data_view_widget_container.className = 'webdataview';
web_data_view_widget_container.id = 'webdataview-widget-container';
document.body.appendChild(web_data_view_widget_container);

// add div containing iframe
var web_data_view_widget = document.createElement('div');
web_data_view_widget.id = 'webdataview-floating-widget';
document.getElementById('webdataview-widget-container').appendChild(web_data_view_widget);

// add floating widget iframe
var widget_iframe_cf = new ContentFrame({
    'id':'webdataview-widget-iframe',
    'class': 'webdataview-iframe',
    'appendTo': '#webdataview-floating-widget'
});
var widget_iframe = widget_iframe_cf.body;

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
                        var widget_download_button = ContentFrame.findElementInContentFrame('#widget-download-data', '#webdataview-widget-iframe');
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

                        var widget_label_selector = ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe');

                        // set widget label width
                        function setWidgetLabelsWidth() {
                            var vert_sep_selector = ContentFrame.findElementInContentFrame('.widget-vertical-separator', '#webdataview-widget-iframe');
                            var scroll_btn_selector = ContentFrame.findElementInContentFrame('.widget-scroll-buttons', '#webdataview-widget-iframe');
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
                        var widget_labels_shadow_box = ContentFrame.findElementInContentFrame('.widget-labels-shadow-box', '#webdataview-widget-iframe');
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

                        var FloatingWidgetMenu = {};

                        /**
                         * append label to floating widget
                         * params: label title and color in rgb, rgba, hex or name
                         */
                        FloatingWidgetMenu.appendLabel = function(labelName, labelColor) {
                            widget_label_selector.find('ul').append('<li class="widget-labels-li" id = '+ labelColor +'> <svg class="widget-label-circle-svg" height="10" width="10"> <circle cx="5" cy="5" r="4" stroke= '+ labelColor +' stroke-width="1.5" fill="white" /> </svg>'+ labelName +'</li>');
                        };

                        /*
                         for (var i = 0; i < 15; i++) {
                         FloatingWidgetMenu.appendLabel('redy', 'red');
                         }
                         */
                    });
                });
            });
        });
    });
});