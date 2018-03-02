/**
 * Web data extraction notation library
 *
 * @class
 * @requires jQuery
 * @param {Object[]} notation
 * @param {string} notation.label label name of the data field
 * @param {Object} notation.rule rule for matching DOM elements to the data field
 * @param {string} notation.rule.class name of class of elements to match
 * @param {string} notation.rule.id id of elements to match
 * @param {string} notation.rule.xpath xpath of elements to match
 * @param {Array} notation.rule.tag array of string representation of HTML tags ["div", "img", "p", "h1", "a"]
 * @param {string} notation.rule.jQuery_selector jQuery selector of elements to match
 * @param {Array} notation.rule.css list of dictionary of CSS style properties of elements to match
 * @param {string} notation.rule.regex regular expression of text of HTML element to match
 * @param {Function} notation.rule.function custom function by developer
 * @example
 * // example below shows how to create a fixed position footer
 * const example_notation = new WebDataExtractionNotation([{
 *  'label': 'price',
 *  'rule': {
 *    'id': 'price',
 *    'class': 'price-class',
 *    'tag': ["div"],
 *    'css': [ {"background-color":"rgb(255,0,0)"},
 *    'regex': "^\S+@\S+$",
 *    'function': function() {}
 *  }
 * ]);
 * example_notation.extract();
 */
class WebDataExtractionNotation {
    constructor(notation) {

    }

    /**
     * extract data by matching rules with DOM elements on the webpage and label data
     */
    extract() {
    }

    /**
     * match DOM elements with notation rule
     * @returns list of DOM elements matching the notation rule
     */
    matchRule() {

    }

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
}