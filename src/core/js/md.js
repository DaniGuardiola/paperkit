// TODO:
// - Add error constructor
// - Add getInfo() or similar, as a general method
//   and as alias (getter) on modules and components
// - Add dependece functionality to modules
// - Find solution to hint message "possible strict violation"
// - Refactor including
// - Document everything
// - Add component functionality
// - Review error checking
// - Maybe md.load doesn't have to be public
/**
 * Core initialization.
 * Sets up the "md" namespace and the core functionality of the framework
 * Including:
 * - Modules
 * - Components
 * - Events - fired in window. List: md-core-module-load, md-core-component-load,
 *            md-core-load, md-module-load, md-component-load, md-load and md-ready
 * - Including - loading modules and components files with <md-include src="...script.js">
 * - Loading - the initial setup of the framework
 */
(function() {
  "use strict";
  // Just in case...
  if (window === undefined) {
    console.error("PK [core] Window is undefined. What are you doing? This is the weirdest thing that ever happened to a web framework! D: I'm scared");
    return;
  }
  // Get this script
  var paperkitScript = document.currentScript || document.querySelector("script[src$=\"paperkit.js\"]") || document.querySelector("script[paperkit]") || false;
  // Load core when the script loads
  if (paperkitScript) {
    paperkitScript.addEventListener("load", function() {
      setTimeout(md.load, 0);
    });
  } else {
    console.error("PK [core] Please add \"paperkit\" attribute to the Paperkit script tag, or use \"paperkit.js\" as filename");
    return;
  }

  // Namespace
  var md = {};

  // Core configuration
  var coreModules = ["log"];
  var coreModulesPending = coreModules.slice();
  var coreComponents = [];
  //var coreComponentsPending = coreComponents.slice();

  // Get timestamp
  var loadTimestamp = Date.now();

  /**
   * [MODULES]
   * A module looks like this:
   * md.module.queue({ // Options as first function parameter
   *   "name": "moduleName", // will be registered as md.moduleName
   *   "core": true, // or not defined
   *   "dependencies": [], // or not defined
   *   "someOption": "someValue" // other values
   * },function(){ // Function that returns the module as second parameter
   *   // Module definition:
   *   var main = {}; // or function(){}
   *   var method1 = function(){}; // a module method
   *   Object.defineProperties(main, whatever); // defines module properties and methods
   *                                            // this allows private methods and properties
   *                                            // just by not publishing them
   *                                            // Check src/module/template.js for extended info
   *   return main; // returns the module
   * });
   */

  var moduleList = [];
  var moduleQueueList = [];

  /**
   * Checks if module is loaded
   * @param  {String} name Module name to check
   * @return {Boolean|Object}       True if module is loaded,
   *                                if verbose is true, returns
   *                                module "meta" options
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

  /**
   * Loads a module if specified or loads queue if not
   * @param  {object} moduleObj  The module object, if not specified
   *                             queue will load, if queue is empty
   *                             md-module-load event will fire
   * @param  {boolean} allInQueue If true next item in queue will be loaded too
   */
  function moduleLoad(moduleObj, allInQueue) {
    allInQueue = allInQueue || false;
    if (moduleObj) { // If moduleObj exists
      // moduleObj checks
      if (typeof moduleObj !== "object" || typeof moduleObj.options !== "object" || typeof moduleObj.function !== "function") {
        md.log("[module] Not valid module object", "error");
        return false;
      }

      // Module load
      var name = moduleObj.options.name; // The module name is on "name" var
      var module = moduleObj.function(); // The module returned is on "module" var
      var core = moduleObj.options.core ? "core:" : "";
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
        md.log("[" + core + "module] LOAD " + name, "info");
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
    var moduleObj = {
      "options": options,
      "function": moduleFunction
    };
    if (options.core) {
      var i = coreModulesPending.indexOf(options.name);
      if (i !== -1) {
        module.load(moduleObj);
        coreModulesPending.splice(i, 1);
        if (coreModulesPending.length < 1 && !loadStatus.coreModules) {
          dispatchCoreModuleLoadEvent();
          if (coreComponents.length < 1) {
            dispatchCoreLoadEvent();
          }
        }
        return;
      } else {
        md.log("[module.queue:" + options.name + "] Marked as core module, but not allowed", "warn");
      }
    }
    moduleQueueList.push(moduleObj);
  }

  Object.defineProperties(moduleQueue, {
    "state": {
      "get": function() {
        var state = "empty";
        if (moduleQueueList.length > 0) {
          state = moduleQueueList.length + " pending";
        }
        return state;
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
    coreModule: false,
    coreComponent: false,
    module: false,
    component: true, // temporally true for testing, change to false
    paperkit: false
  };

  function dispatchCoreLoadEvent() {
    md.log("[core] LOAD COMPLETE", "info");
    loadStatus.core = true;
    var loadEvent = new Event("md-core-load");
    window.dispatchEvent(loadEvent);
  }

  function dispatchCoreModuleLoadEvent() {
    md.log("[core:module] LOAD COMPLETE", "info");
    loadStatus.coreModule = true;
    var loadEvent = new Event("md-core-module-load");
    window.dispatchEvent(loadEvent);
  }

  function dispatchModuleLoadEvent() {
    md.log("[module] LOAD COMPLETE", "info");
    loadStatus.module = true;
    var loadEvent = new Event("md-module-load");
    window.dispatchEvent(loadEvent);
    if (loadStatus.core && loadStatus.component) {
      dispatchLoadEvent();
    }
  }

  /*
  function dispatchComponentLoadEvent() {
    md.log("[component] LOAD COMPLETE", "info");
    loadStatus.component = true;
    var loadEvent = new Event("md-component-load");
    window.dispatchEvent(loadEvent);
    if (loadStatus.core && loadStatus.module) {
      dispatchLoadEvent();
    }
  }
  */

  function dispatchLoadEvent() {
    md.log("[paperkit] LOAD COMPLETE", "info");
    loadStatus.paperkit = true;
    var loadEvent = new Event("md-load");
    window.dispatchEvent(loadEvent);
  }

  // Script loading
  var loadingScripts = [];
  var loadingScriptsEnd = false;

  function scriptOnload(script, callback) {
    var i = loadingScripts.indexOf(script);
    loadingScripts.splice(i, 1);
    if (loadingScripts.length < 1 && loadingScriptsEnd && callback) {
      callback();
    }
  }

  function loadScripts(callback) {
    var scripts = document.querySelectorAll("md-include");
    var url, script;
    if (scripts.length < 1) {
      md.log("[core] No <md-include> tags were found", "info");
      if (callback) {
        callback();
      }
      return;
    }
    for (var i = 0; i < scripts.length; i++) {
      url = scripts[i].getAttribute("src");
      script = document.createElement("script");
      script.src = url;
      loadingScripts.push(script);
      document.body.appendChild(script);
      script.addEventListener("load", function() {
        scriptOnload(script, callback);
      });
      document.body.removeChild(script);
    }
    loadingScriptsEnd = true;
  }

  // Core functions
  function load() {
    loadScripts(md.module.load);
    // Init body
    if (!document.body.classList.contains("md-noinit")) {
      window.addEventListener("md-component-load", function() {
        md.init(document.body);
      });
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
    }, // Private
    "_loadTimestamp_": {
      "value": loadTimestamp
    }
  });

  Object.defineProperty(window, "md", {
    "value": md
  });

  // Log fallback
  md.log = function(message, mode) {
    mode = mode || "log";
    if (!message) {
      md.log("PK [log] No message specified");
      return false;
    }
    if (!console[mode]) {
      mode = "log";
    }
    console[mode]("PK " + message);
  };
}());
