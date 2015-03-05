/* global getEl, initGlobalMDFunctions, initMDSnackBar, initMDButton, initMDInputSubmit, initMDInput, initMDList, initMDIcon, initMDSidemenu, initMDIconButton, initMDGreylayer, initMDMenu, initMDTabBar, initMDToolBar, initMDSwitch, initMDFab, initMDPager */
/* exported transitionend, isMobile, executeFunctionByName */

/**
 * TODO: Documentation
 */
var Paperkit = function() {
  /* Current path */
  this.path = "";

  /* Init function */
  this.initFuncs = [];

  /* Elements */
  this.greylayer = null;

  /* Side menu */
  this.sidemenu = null;

  /* Main fab button */
  this.fab = null;

  /* Main content element */
  this.content = null;

  /* Paperkit observer */
  this.observer = null;

  /* TODO: Review ??? */
  this.tmpDiv = null;
};

/**
 * TODO: Documentation
 *
 * @param func
 */
Paperkit.prototype.initListener = function(func) {
  this.initFuncs.push(func);
};

/**
 * TODO: Documentation
 *
 * @param tag
 * @returns
 */
Paperkit.prototype.createElement = function(tag) {
  var element = document.createElement(tag);
  this.addMDMethods(element);
  return element;
};

/**
 * TODO: Documentation
 */
Paperkit.prototype.init = function() {
  // Init paperkit path
  var url = document.querySelector("link[href*='paperkit.css']").href;
  this.path = url ? url.substring(0, url.indexOf("paperkit.css")) : "";

  // Init elements
  if (!document.querySelector("md-greylayer")) {
    document.body.appendChild(document.createElement("md-greylayer"));
  }

  // Init paperkit objects
  var elements = document.getElementsByTagName("*");
  var length = elements.length;
  for (var i = 0; i < length; i++) {
    var el = elements[i];
    if (el.tagName.indexOf("MD") === 0) {
      this.addMDMethods(el);
    }
  }

  // Mutation observer initializing...
  this.observer = new MutationObserver(this.observeMDElements);
  var config = {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true
  };
  this.observer.observe(document.body, config);

  this.initFuncs.forEach(function(initFunc) {
    initFunc();
  });
};

/**
 * TODO: Documentation
 * @param element
 */
Paperkit.prototype.addMDMethods = function(element) {
  var tag = element.tagName.toLowerCase();

  if (tag.indexOf("md-") >= 0) {
    if (element.alreadyInitialized) {
      return;
    }
    // INCICIALIZACION DE FUNCIONES GENERALES
    initGlobalMDFunctions(element, this);

    if (tag === "md-snackbar") {
      initMDSnackBar(element, this);
    } else if (tag === "md-button") {
      initMDButton(element, this);
    } else if (tag === "md-input-submit") {
      initMDInputSubmit(element, this);
    } else if (tag === "md-input") {
      initMDInput(element, this);
    } else if (tag === "md-list") {
      initMDList(element, this);
    } else if (tag === "md-icon" || tag === "md-avatar") {
      initMDIcon(element, this);
    } else if (tag === "md-sidemenu") {
      initMDSidemenu(element, this);
      this.sidemenu = element;
    } else if (tag === "md-icon-button") {
      initMDIconButton(element, this);
    } else if (tag === "md-greylayer") {
      initMDGreylayer(element, this);
      this.greylayer = element;
    } else if (tag === "md-menu") {
      initMDMenu(element, this);
    } else if (tag === "md-tabbar") {
      initMDTabBar(element, this);
    } else if (tag === "md-toolbar") {
      initMDToolBar(element, this);
      if (element.parentNode.tagName.toLowerCase() === "body") {
        this.toolbar = element;
      }
    } else if (tag === "md-switch") {
      initMDSwitch(element, this);
    } else if (tag === "md-fab") {
      initMDFab(element, this);
      this.fab = element;
    } else if (tag === "md-content") {
      this.content = element;
    } else if (tag === "md-pager") {
      initMDPager(element, this);
    }
  }
};

/**
 * TODO: Documentation
 * @param what
 * @param opt
 */
Paperkit.prototype.create = function(what, opt) {
  if (what === "snackbar") {
    var newSnackbar = document.createElement("md-snackbar");
    if (opt.text) {
      var text = document.createElement("md-text");
      text.contentText = opt.text;
      newSnackbar.appendChild(text);
    }
    if (opt.position) {
      newSnackbar.setAttribute("md-position", opt.position);
    } else {
      newSnackbar.setAttribute("md-position", "bottom right");
    }
    document.body.appendChild(newSnackbar);
    initMDSnackBar(newSnackbar);
  }
};

/**
 * TODO: Documentation
 * @param mutations
 */
Paperkit.prototype.observeMDElements = function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === "childList") {
      [].forEach.call(mutation.addedNodes, function(node) {
        if (!node.tagName) {
          return;
        }
        if (node.tagName.indexOf("MD-") === 0) {
          Paperkit.prototype.addMDMethods(node);
        }
      });
    }
  });
};

/**
 * Calculates text width when it's rendered with the given style.
 * It has the cost of rendering and removing a hidden div element.
 *
 * @param {string}  string              The string to calculate width
 * @param {style}   CSSStyleDeclaration The style to apply to string
 * @return {object} Metrics object containing width and height properties.
 */
Paperkit.prototype.calcTextMetrics = function(string, style) {
  if (!this.tmpDiv) {
    this.tmpDiv = document.createElement("div");
    document.body.appendChild(this.tmpDiv);
  }

  this.tmpDiv.style.position = "absolute";
  this.tmpDiv.style.visibility = "hidden";
  this.tmpDiv.style.top = "0px";
  this.tmpDiv.style.left = "0px";
  this.tmpDiv.style.zIndex = "-1";
  this.tmpDiv.style.height = "auto";
  this.tmpDiv.style.width = "auto";
  this.tmpDiv.style.whiteSpace = "nowrap";
  this.tmpDiv.style.fontSize = style.fontSize;
  this.tmpDiv.textContent = string;

  var metricsWidth = this.tmpDiv.clientWidth;
  var metricsHeight = this.tmpDiv.clientHeight;
  // document.body.removeChild(tmpDiv);
  return {
    "width": metricsWidth,
    "height": metricsHeight
  };
};

/**
 * Initializes an element and all it's subelements by
 * applying material initialization to this element, and all it's
 * subelements.
 *
 * @param {object} element The element to initialize.
 */
Paperkit.prototype.initElement = function(element) {
  // first init this element
  this.addMDMethods(element);

  // then init child elements
  for (var i = 0; i < element.children.length; i++) {
    this.initElement(element.children[i]);
  }
};

/**
 * TODO: Documentation
 * @param dowhat
 */
Paperkit.prototype.justInCase = function(dowhat) {
  if (dowhat === "reload") {
    var elements = document.getElementsByTagName("*");
    var length = elements.length;
    for (var i = 0; i < length; i++) {
      var el = elements[i];
      if (el.tagName.indexOf("MD") === 0) {
        this.addMDMethods(el);
      }
    }
  }
};

/**
 * TODO: Documentation
 * @param what
 * @param where
 * @param onload
 * @param param
 */
Paperkit.prototype.ajaxInsert = function(what, where, onload) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", what);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.addEventListener("load", function() {
    getEl(where).innerHTML = xhr.responseText;
    onload(xhr.responseText, where);
  });
  xhr.send();
};

/**
 *
 */
Paperkit.prototype.consoleBanner = "M! ";

/**
 *
 */
function transitionEndEventName() {
  var i;
  var el = document.createElement("div");
  var transitions = {
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
}

/**
 *
 */
var transitionend = transitionEndEventName();

/**
 *
 */
function executeFunctionByName(functionName, context, args) {
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

/**
 *
 */
function getViewport() {
  var e = window;
  var a = "inner";
  if (!("innerWidth" in window)) {
    a = "client";
    e = document.documentElement || document.body;
  }

  return {
    width: e[a + "Width"],
    height: e[a + "Height"]
  };
}

/**
 *
 */
function isMobile() {
  if (getViewport().width < 768) {
    return true;
  } else {
    return false;
  }
}
