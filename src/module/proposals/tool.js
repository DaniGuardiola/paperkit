/**
 * Tools
 * @type {Object}
 */
md.tool = {
  /**
   * Checks if element matches selector
   * @param  {node} what     Element
   * @param  {string|array} selector Selector or selectors to check
   * @return {boolean}          True if succesful, false if not
   */
  matches: function(what, selector) {
    "use strict";
    if (selector.constructor === Array) {
      for (i = selector.length - 1; i >= 0; i--) {
        md.tool.matches(what, selector[i]);
      }
    } else {
      if (document.body.matches) {
        what.matches(selector);
      } else {
        var matches = (what.document || what.ownerDocument).querySelectorAll(selector);
        var i = 0;

        while (matches[i] && matches[i] !== what) {
          i++;
        }

        return matches[i] ? true : false;
      }
    }
  },
  transitionEnd: "transitionend",
  transitionEndEventName: function() {
    var i,
      undefined,
      el = document.createElement("div"),
      transitions = {
        "transition": "transitionend",
        "OTransition": "otransitionend", // oTransitionEnd in very old Opera
        "MozTransition": "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
      };

    for (i in transitions) {
      if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
        return transitions[i];
      }
    }
  },
  executeFunctionByName = function(functionName, context, args) {
    var namespaces = functionName.split(".");
    var func = namespaces.pop();

    if (!context && namespaces.length > 0) {
      context = eval(namespaces.shift());
    } else if (!context) {
      context = window;
    }

    for (var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }

    if (args) {
      return context[func].apply(context, args);
    } else {
      return context[func].apply(context, ["false"]);
    }
  }
};
