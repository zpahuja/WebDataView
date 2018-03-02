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
      this.class = query.class;
      this.jQuerySelector = query.jQuerySelector;
    }
  }

  /**
   * execute query and return list of matches
   */
  execute() {
    if (this.jQuerySelector) {
      // console.log($(this.jQuerySelector).toArray());
      return $(this.jQuerySelector).toArray();
    }
  }

  /**
   * highlights elements that match query
   */
  highlightSelectedElements() {
    let matches = this.execute();
    for (var i = 0; i < matches.length; i++) {
      let element = matches[i];
      if (typeof element != 'undefined') {
        element.style.border = '2px solid red';
      }
    }
  }

  /**
   * prepend to body of iFrame
   * @param {string} jQuerySelector jQuery selector of iFrame
   * @param {string} HTML html to prepend to body tag
   */
  static prepend(jQuerySelector, HTML) {
    Query.find(jQuerySelector).prepend(HTML);
  }

  /**
   * find element in all Query iFrames
   * @param {string} elementSelector jQuery selector of element to find
   * @returns {Array} jQuery element corresponding to body tag within iFrame
   */
  static findElements(elementSelector) {
    return $('content-frame-default-iframe').contents().find(elementSelector);
  }

  /**
   * rewrite element in all Query iFrames
   * @param {string} elementSelector jQuery selector of element to rewrite
   * @param {string} HTML new html of element to rewrite
   */
  static rewriteElements(elementSelector, HTML) {
    Query.findElements(elementSelector).html(HTML);
  }

  /**
   * append to element in all Query iFrames
   * @param {string} elementSelector jQuery selector of element to append to
   * @param {string} HTML html to append to element
   */
  static appendElements(elementSelector, HTML) {
    Query.findElements(elementSelector).append(HTML);
  }

  /**
   * prepend to element in all Query iFrames
   * @param {string} elementSelector jQuery selector of element to prepend to
   * @param {string} HTML html to prepend to element
   */
  static prependElements(elementSelector, HTML) {
    Query.findElements(elementSelector).prepend(HTML);
  }

  /**
   * find element in a specific Query
   * @param {string} elementSelector jQuery selector of element to find
   * @param {string} jQuerySelector jQuery selector of iFrame
   * @returns {Array} jQuery element corresponding to element within iFrame
   */
  static findElementInQuery(elementSelector, jQuerySelector) {
    return $(jQuerySelector).contents().find(elementSelector);
  }

  /**
   * rewrite element in a specific Query
   * @param {string} elementSelector jQuery selector of element to rewrite
   * @param {string} jQuerySelector jQuery selector of iFrame
   * @param {string} HTML html
   */
  static rewriteElementInQuery(elementSelector, jQuerySelector, HTML) {
    Query.findElementInQuery(elementSelector, jQuerySelector).html(HTML);
  }

  /**
   * append HTML to element in a specific Query
   * @param {string} elementSelector jQuery selector of element to append
   * @param {string} jQuerySelector jQuery selector of iFrame
   * @param {string} HTML html
   */
  static appendElementInQuery(elementSelector, jQuerySelector, HTML) {
    Query.findElementInQuery(elementSelector, jQuerySelector).append(HTML);
  }

  /**
   * prepend HTML to element in a specific Query
   * @param {string} elementSelector jQuery selector of element to prepend
   * @param {string} jQuerySelector jQuery selector of iFrame
   * @param {string} HTML html
   */
  static prependElementInQuery(elementSelector, jQuerySelector, HTML) {
    Query.findElementInQuery(elementSelector, jQuerySelector).prepend(HTML);
  }
}

// How will you conjunct?
// Notation names?