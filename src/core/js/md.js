/**
 * Core namespace initialization.
 * Sets window.md
 */
(function() {
  "use strict";
  if (window === undefined) {
    console.error("PK [core] Window is undefined. What are you doing? This is the weirdest thing that ever happened to a web framework! D: I'm scared");
    return;
  }

  // Namespace
  var md = {};

  // Module
  var moduleList = [];

  function module(input) {
    if (moduleList.indexOf(input) > -1) {
      return true;
    } else {
      return false;
    }
  }

  Object.defineProperty(module, "list", {
    "get": function() {
      return moduleList;
    },
    "set": function(value) {
      moduleList.push(value);
    }
  });

  // Component
  var componentList = [];

  function component(input) {
    if (componentList.indexOf(input) > -1) {
      return true;
    } else {
      return false;
    }
  }

  Object.defineProperty(component, "list", {
    "get": function() {
      return componentList;
    },
    "set": function(value) {
      componentList.push(value);
    }
  });

  // Utils
  function dispatchLoadEvent() {
    var loadEvent = new Event("md-load");
    window.dispatchEvent(loadEvent);
  }

  // Core functions

  function load() {
    // Init body
    if (document.body.classList.contains("md-init")) {
      // md.init(document.body);
    }
    md.log("[core] Loaded", "info");
    dispatchLoadEvent();
  }

  Object.defineProperties(md, {
    "load": {
      "value": load
    },
    "module": {
      "value": module
    },
    "component": {
      "value": component
    }
  });

  Object.defineProperty(window, "md", {
    "value": md
  });

  // DEBUG! TEMPORAL!
  console.log("PK[debug] Before load: ", md);
}());
