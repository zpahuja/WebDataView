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
 *    'css': [ {"background-color":"rgb(255,0,0)"},
 *    'regex': "^\S+@\S+$",
 *    'function': function() {}
 *  }
 * ]);
 * example_notation.extract();
 */

class WebDataExtractionNotation {

  constructor(notation) {

    this.notations = {};

    if (!Array.isArray(notation)) {
      notation = [notation]
    }

    for (let i = 0; i < notation.length; i++) {
      let label = notation[i]['label'];
      let query = notation[i]['query'];
      this.notations[label] = new Query(query);
    }

    this.colors = ["(2,63,165)", "(125,135,185)", "(190,193,212)", "(214,188,192)", "(187,119,132)", "(142,6,59)", "(74,111,227)", "(133,149,225)", "(181,187,227)", "(230,175,185)", "(224,123,145)", "(211,63,106)", "(17,198,56)", "(141,213,147)", "(198,222,199)", "(234,211,198)", "(240,185,141)", "(239,151,8)", "(15,207,192)", "(156,222,214)", "(213,234,231)", "(243,225,235)", "(246,196,225)", "(247,156,212)"];
    this.color_index = 0;
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
      this.appendLabel2Widget(label, color);
    };

    return data;
  }

  appendLabel2Widget(labelName, labelColor) {

    let labelId = labelColor.substring(4, labelColor.length - 1).replace(',', '-').replace(',', '-');
    ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe').find('ul').append('<li class="widget-labels-li" id = ' + labelId + '> <svg class="widget-label-circle-svg" height="10" width="10"> <circle cx="5" cy="5" r="4" stroke= ' + labelColor + ' stroke-width="1.5" fill="white" /> </svg>' + labelName + '</li>');
    ContentFrame.findElementInContentFrame('.widget-labels', '#webdataview-widget-iframe').find('ul').find('li#' + labelId).click(function(e) {
      let circle = $(e.target).find('svg').find('circle');
      let circle_fill_color = circle.css("fill") == "rgb(255, 255, 255)" ? labelColor : "rgb(255, 255, 255)";
      circle.css({
        "fill": circle_fill_color
      });

      // toggle fields
      for (let i = 0; i < collected_data.length; i++) {
        let field_label = ntc.name(rgb2hex(labelColor))[1];
        if (field_label in collected_data[i]) {
          if (circle_fill_color == "rgb(255, 255, 255)") {
            collected_data[i][field_label].style.outline = "none";
          } else {
            collected_data[i][field_label].style.outline = '2px solid ' + circle_fill_color;
          }
        }
      }
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
      Object.defineProperty(this.data, newLabelName,
        Object.getOwnPropertyDescriptor(this.data, oldLabelName));
      delete(this.data)[oldLabelName];

      // change notation-query
      Object.defineProperty(this.notations, newLabelName,
        Object.getOwnPropertyDescriptor(this.notations, oldLabelName));
      delete(this.notations)[oldLabelName];
    }
  }

  // highlightLabel

  toJSON() {
    var jsonNotations = [];

    for (var label in this.notations) {
      jsonNotations.push({
        'label': label,
        'query': this.notations[label].toJSON()
      });
    };

    return JSON.stringify(jsonNotations);
  }
}