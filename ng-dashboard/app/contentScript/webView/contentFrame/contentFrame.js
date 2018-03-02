/**
 * iFrame library for Chrome Extensions to create HTML elements that do not affect or be affected by the web page's CSS
 *
 * Requires and interfaces with jQuery to allow developer to manipulate DOM of iFrame through {@link #contentframebody body}
 *
 * @class
 * @requires jQuery
 * @param {Object} options
 * @param {string} options.id id of the iFrame
 * @param {string} options.class class name of the iFrame
 * @param {string} [options.appendTo='body'] jQuery selector of DOM element to append iFrame to
 * @param {Object} options.inlineCss inline CSS for iFrame container, not the elements inside iFrame nor the body of iFrame
 * @param {Array} options.css list of CSS file paths (not Chrome extension URL)
 * @param {Array} options.js list of JS file paths (not Chrome extension URL)
 * @param {Function} callback callback function
 * @example
 * // example below shows how to create a fixed position footer
 * const example = new ContentFrame({
 *  'id': 'example_content_frame',
 *  'class': 'example-class',
 *  'css': ['lib/font-awesome/css/font-awesome.css'],
 *  'js': [
 *      'lib/jquery/jquery-3.1.1.min.js',
 *      'lib/jquery/jquery-ui.min.js'
 *      ],
 *  'inlineCss': {
 *      "bottom": 0,
 *      "width": '100%',
 *      "height": '50px',
 *      "background-color": "white",
 *      "position": "fixed"
 *      }
 *  }, function() {
 *      alert('callback called immediately after ContentFrame created');
 * });
 * example.loadCSS('lib/bootstrap/css/bootstrap.min.css');
 */
class ContentFrame {
    constructor(options, callback) {
        // create iFrame
        let attrs = {};
        if (options.id) { attrs.id = options.id; }
        attrs.class = options.class ?  "content-frame-default-iframe " +  options.class : "content-frame-default-iframe";
        this.iframe = $('<iframe />', attrs); // do not set this attr programmatically

        // append iFrame to 'appendTo' or body tag, if parent not defined in options
        if (window.self === window.top) {
            let parent = options.appendTo ? options.appendTo : 'body';
            $(parent).append(this.iframe);
        }

        // apply inline CSS to iFrame container
        if (options.inlineCss && typeof options.inlineCss ==='object' && !(options.inlineCss instanceof Array) && !(options.inlineCss instanceof Date)) {
            try {
                this.iframe.css(options.inlineCss);
            }
            catch (e) {
                console.log("inline css for ContentFrame constructor not formatted correctly");
            }
        }

        // load CSS
        this.loadCSS('app/contentScript/webView/contentFrame/contentFrame-extra.css'); // default
        if (options.css && Array.isArray(options.css)) {
            for (let i = 0; i < options.css.length; i++) {
                this.loadCSS(options.css[i]);
            }
        }

        // load JS
        if (options.js && Array.isArray(options.js)) {
            for (let i = 0; i < options.js.length; i++) {
                this.loadJS(options.js[i]);
            }
        }

        // callback
        if (callback && typeof(callback) === 'function') {
            callback();
        }
    }

    /**
     * get body of iFrame
     * @returns {Object} jQuery element corresponding to body tag of the iFrame
     */
    get body() {
        return this.iframe.contents().find("body");
    }

    /**
     * load CSS from file
     * @param {string} filepath file path of stylesheet, not the chrome extension URL
     * @param {Function} callback callback function
     */
    loadCSS(filepath, callback) {
        this.iframe.contents().find("head").append($("<link/>", {
            rel: "stylesheet",
            href: chrome.extension.getURL(filepath),
            type: "text/css"
        }));

        if (callback && typeof(callback) === 'function') {
            callback();
        }
    }

    /**
     * load JS script from file
     * @param {string} filepath file path of JavaScript, not the chrome extension URL
     * @param {Function} callback callback function
     */
    loadJS(filepath, callback) {
        this.iframe.contents().find("head").append($("<link/>", {
            href: chrome.extension.getURL(filepath),
            type: "text/javascript"
        }));

        if (callback && typeof(callback) === 'function') {
            callback();
        }
    }

    /**
     * load HTML from filepath
     * @param {string} filepath file path of HTML, not the chrome extension URL
     * @param {Function} callback callback function
     */
    loadHTML(filepath, callback) {
        self.body.load(chrome.extension.getURL(filepath), function () {
            if (callback && typeof(callback) === 'function') {
                callback();
            }
        });
    }

    /**
     * find iFrame using corresponding jQuery selector
     * @param {string} iFrameSelector jQuery selector of iFrame
     * @returns {Object} jQuery element corresponding to body tag within iFrame
     */
    static find(iFrameSelector) {
        return $(iFrameSelector).contents().find('body');
    }

    /**
     * rewrite body of iFrame
     * @param {string} iFrameSelector jQuery selector of iFrame
     * @param {string} HTML html of body tag
     */
    static rewrite(iFrameSelector, HTML) {
        ContentFrame.find(iFrameSelector).html(HTML);
    }

    /**
     * append to body of iFrame
     * @param {string} iFrameSelector jQuery selector of iFrame
     * @param {string} HTML html to append to body tag
     */
    static append(iFrameSelector, HTML) {
        ContentFrame.find(iFrameSelector).append(HTML);
    }

    /**
     * prepend to body of iFrame
     * @param {string} iFrameSelector jQuery selector of iFrame
     * @param {string} HTML html to prepend to body tag
     */
    static prepend(iFrameSelector, HTML) {
        ContentFrame.find(iFrameSelector).prepend(HTML);
    }

    /**
     * find element in all ContentFrame iFrames
     * @param {string} elementSelector jQuery selector of element to find
     * @returns {Array} jQuery element corresponding to body tag within iFrame
     */
    static findElements(elementSelector) {
        return $('content-frame-default-iframe').contents().find(elementSelector);
    }

    /**
     * rewrite element in all ContentFrame iFrames
     * @param {string} elementSelector jQuery selector of element to rewrite
     * @param {string} HTML new html of element to rewrite
     */
    static rewriteElements(elementSelector, HTML) {
        ContentFrame.findElements(elementSelector).html(HTML);
    }

    /**
     * append to element in all ContentFrame iFrames
     * @param {string} elementSelector jQuery selector of element to append to
     * @param {string} HTML html to append to element
     */
    static appendElements(elementSelector, HTML) {
        ContentFrame.findElements(elementSelector).append(HTML);
    }

    /**
     * prepend to element in all ContentFrame iFrames
     * @param {string} elementSelector jQuery selector of element to prepend to
     * @param {string} HTML html to prepend to element
     */
    static prependElements(elementSelector, HTML) {
        ContentFrame.findElements(elementSelector).prepend(HTML);
    }

    /**
     * find element in a specific ContentFrame
     * @param {string} elementSelector jQuery selector of element to find
     * @param {string} iFrameSelector jQuery selector of iFrame
     * @returns {Array} jQuery element corresponding to element within iFrame
     */
    static findElementInContentFrame(elementSelector, iFrameSelector) {
        return $(iFrameSelector).contents().find(elementSelector);
    }

    /**
     * rewrite element in a specific ContentFrame
     * @param {string} elementSelector jQuery selector of element to rewrite
     * @param {string} iFrameSelector jQuery selector of iFrame
     * @param {string} HTML html
     */
    static rewriteElementInContentFrame(elementSelector, iFrameSelector, HTML) {
        ContentFrame.findElementInContentFrame(elementSelector, iFrameSelector).html(HTML);
    }

    /**
     * append HTML to element in a specific ContentFrame
     * @param {string} elementSelector jQuery selector of element to append
     * @param {string} iFrameSelector jQuery selector of iFrame
     * @param {string} HTML html
     */
    static appendElementInContentFrame(elementSelector, iFrameSelector, HTML) {
        ContentFrame.findElementInContentFrame(elementSelector, iFrameSelector).append(HTML);
    }

    /**
     * prepend HTML to element in a specific ContentFrame
     * @param {string} elementSelector jQuery selector of element to prepend
     * @param {string} iFrameSelector jQuery selector of iFrame
     * @param {string} HTML html
     */
    static prependElementInContentFrame(elementSelector, iFrameSelector, HTML) {
        ContentFrame.findElementInContentFrame(elementSelector, iFrameSelector).prepend(HTML);
    }
}