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
  var moduleQueueList = [];

  /**
   * Module interface:
   * 
   * - md.module(moduleName, verbose)
   * Returns true if module is loaded and false if not
   * Also allows for "verbose" parameter to return "meta" options
   * if module is loaded (instead of true)
   * Always returns false when module not loaded
   * 
   * - md.module.queue(options, moduleFunction)
   * Adds a moduleObj to queue
   * A module code would look like this:
   * md.module.queue({
   *   "name": "moduleName",
   *   "core": true,
   *   "dependencies": [],
   *   "someOption": "someValue"
   * },function(){
   *   // Module definition:
   *   var main = {}; // or function(){}
   *   var method1 = function(){}; // a module method
   *   Object.defineProperties(main, whatever); // defines module properties and methods
   *   return main; // returns the module
   * });
   * 
   * - md.module.load(moduleObj, allInQueue) // "moduleObj" is a module definition function
   * Loads a module when passed as argument.
   * If no param is provided, loads the next queue item,
   * if no items in queue fires md-module-load.
   * If allInQueue is true, it will call again md.module.load(false, true)
   * except there's no modules in queue
   */

  /**
   * Module checker
   * @param  {String} name Module name to check
   * @return {Boolean|Object}       True if module is loaded,
   *                                     if verbose is true, returns
   *                                     module "meta" options
   */
  function module(name, verbose) {
    var exists = (moduleList.indexOf(name) > -1);
    if (!exists) {
      return false;
    }
    if (verbose) {
      return md[name]._mdOptions_;
    }
    return true;
  }

  function moduleLoad(moduleObj, allInQueue) {
    allInQueue = allInQueue || false;
    if (moduleObj) { // If moduleObj exists
      // moduleObj checks
      // TODO: finish
      if (typeof moduleObj === null) {
        md.log("[module] The moduleObj parameter is not a valid object", "error");
        return;
      }

      // Module load
      var name = moduleObj.options.name; // The module name is on "name" var
      var module = moduleObj.function(); // The module returned is on "module" var
      // Filling defaults for optional options
      moduleObj.options.dependencies = moduleObj.options.dependencies || [];
      // Defining md options on module
      Object.defineProperty(module, "_mdOptions_", {
        "get": function(){
          var readOnly = Object.create(moduleObj.options);
          return readOnly;
        }
      });
      // Defining the module on md namespace
      Object.defineProperty(md, name, {
        "value": module
      });
      moduleList.push(name); // Attach to module list
      if (md.module("log")) {
        md.log("[" + name + "] Module loaded", "info");
      }

      // If allInQueue, load next one
      if (allInQueue) {
        moduleLoad(false, allInQueue);
      }
    } else {
      var next = moduleQueueList[0];
      if (next && typeof next.function === "function") {
        // Module queue if not empty
        moduleQueueList.splice(0, 1);
        moduleLoad(next, allInQueue);
      } else {
        dispatchModuleLoadEvent();
      }
    }
  }

  function moduleQueue(options, moduleFunction) {
    moduleQueueList.push({
      "options": options,
      "function": moduleFunction
    });
  }

  Object.defineProperties(moduleQueue, {
    "list": {
      "get": function() {
        return moduleQueueList;
      },
      "set": function() {
        return;
      }
    }
  });

  Object.defineProperties(module, {
    "list": {
      "get": function() {
        return moduleList;
      },
      "set": function() {
        return;
      }
    },
    "load": {
      "value": moduleLoad
    },
    "queue": {
      "value": moduleQueue
    }
  });

  // Component
  var componentList = [];

  function component(input) {
    return componentList.indexOf(input) > -1;
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
  function dispatchCoreLoadEvent() {
    var loadEvent = new Event("md-core-load");
    window.dispatchEvent(loadEvent);
  }

  function dispatchModuleLoadEvent() {
    var loadEvent = new Event("md-module-load");
    window.dispatchEvent(loadEvent);
  }

  function dispatchComponentLoadEvent() {
    var loadEvent = new Event("md-component-load");
    window.dispatchEvent(loadEvent);
  }

  function dispatchLoadEvent() {
    var loadEvent = new Event("md-load");
    window.dispatchEvent(loadEvent);
  }

  // Core functions

  function load() {
    setTimeout(md.module.load(false, true),0);
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
  console.log("PK[debug] Before load: ");
  console.dir(md);
}());
