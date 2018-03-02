/**
 * Extensible domain-specific language for querying DOM nodes that match given pattern.
 *
 * Query object can be serialized to JSON, and vice-versa.
 * It facilitates concise summarization of user interactions
 * and enables crowd-sourcing for web data extraction.
 *
 * @class
 * @requires jQuery
 * @param {Object} query
 * @param {(string|string[])} query.class
 * @param {(string|string[])} query.id
 * @param {(string|string[])} query.tag
 * @param {(string|string[])} query.XPath
 * @param {(string|string[])} query.jQuerySelector
 * @param {(Object|Object[])} query.css
 * @param {(string|string[])} query.RegExp
 * @param {(Object|Object[])} query.contains
 * @param {Object} query.position
 * @param {Function} query.function
 * @param {Object} query.bool
 * @example
 * const example_query = new Query({
 *    'class': 'price-class',
 *    'jQuerySelector': ".price-class",
 *  });
 * example_query.execute();
 * example_query.highlightSelectedElements("blue");
 * example_query.toJSON();
 */
class Query {
  constructor(query) {
    if (query.jQuerySelector) {
      this.jQuerySelector = query.jQuerySelector;
    }
    if (query.class) {
      this.class = query.class;
    }

    this.attrs = ["class", "id", "tag", "XPath", "jQuerySelector", "css", "RegExp", "contains", "position", "function", "bool"];
  }

  /**
   * execute query and return list of matches
   */
  execute() {

    if (this.class) {
      if (!this.jQuerySelector) {
        this.jQuerySelector = "";
      }
      this.jQuerySelector = ".".concat(this.class, this.jQuerySelector);
    }
    if (this.jQuerySelector) {
      return $(this.jQuerySelector).toArray();
    }
  }

  /**
   * highlights elements that match query
   */
  highlightSelectedElements(color) {
    if (!color) {
      color = "red";
    }
    let matches = this.execute();
    for (var i = 0; i < matches.length; i++) {
      let element = matches[i];
      if (typeof element != 'undefined') {
        element.style.outline = '2px solid ' + color;
      }
    }
  }

  /**
   * convert to JSON
   */
  toJSON() {
    let j = {}
    for (let i = 0; i < this.attrs.length; i++) {
      let attr = this.attrs[i];
      let val = this[attr];
      if (val) {
        j[attr] = val;
      }
    }
    return JSON.stringify(j);
  }

}

// How will you conjunct?
// Notation names?