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
 */
class Query {
  constructor(query) {
    if (query.jQuerySelector) {
      this.jQuerySelector = query.jQuerySelector;
    }
    if (query.class) {
      this.class = query.class;
    }
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
      // console.log($(this.jQuerySelector).toArray());
      console.log(this.jQuerySelector);
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
    return JSON.stringify(this);
  }

}

// How will you conjunct?
// Notation names?