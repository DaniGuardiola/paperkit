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
        "get": function() {
          return Object.create(moduleObj.options);
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
        moduleLoad();
      }
    } else {
      var next = moduleQueueList[0];
      if (next && typeof next.function === "function") {
        // Module queue if not empty
        moduleQueueList.splice(0, 1);
        moduleLoad(next, true);
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

  // Events and status
  var loadStatus = {
    core: false,
    module: false,
    component: true,
    paperkit: false
  };

  function dispatchCoreLoadEvent() {
    md.log("[core] Loaded", "info");
    loadStatus.core = true;
    var loadEvent = new Event("md-core-load");
    window.dispatchEvent(loadEvent);
  }

  function dispatchModuleLoadEvent() {
    md.log("[module] Loaded", "info");
    loadStatus.module = true;
    var loadEvent = new Event("md-module-load");
    window.dispatchEvent(loadEvent);
    if (loadStatus.core && loadStatus.component) {
      dispatchLoadEvent();
    }
  }

  function dispatchComponentLoadEvent() {
    md.log("[component] Loaded", "info");
    loadStatus.component = true;
    var loadEvent = new Event("md-component-load");
    window.dispatchEvent(loadEvent);
    if (loadStatus.core && loadStatus.module) {
      dispatchLoadEvent();
    }
  }

  function dispatchLoadEvent() {
    md.log("[all] Loaded", "info");
    loadStatus.paperkit = true;
    var loadEvent = new Event("md-load");
    window.dispatchEvent(loadEvent);
  }

  var loadingScripts = [];
  var loadingScriptsEnd = false;

  function loadPaperkitScripts(callback) {
    var scripts = document.querySelectorAll("md-include");
    var url, script;
    if (scripts.length < 1) {
      console.info("PK [core] No external scripts were found");
      return;
    }
    for (var i = 0; i < scripts.length; i++) {
      url = scripts[i].getAttribute("src");
      script = document.createElement("script");
      script.src = url;
      loadingScripts.push(script);
      document.body.appendChild(script);
      script.addEventListener("load", function() {
        var i = loadingScripts.indexOf(script);
        loadingScripts.splice(i, 1);
        if (loadingScripts.length < 1 && loadingScriptsEnd && callback) {
          callback();
        }
      });
      loadingScriptsEnd = true;
      document.body.removeChild(script);
    }
  }

  // Core functions
  function load() {
    loadPaperkitScripts(md.module.load);
    // Init body
    if (document.body.classList.contains("md-init")) {
      // md.init(document.body);
    }
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
}());
