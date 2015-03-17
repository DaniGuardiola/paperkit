/* global md */
(function() {
  "use strict";
  var moduleName = "log";

  if(window.md === undefined) {
    console.error("[Paperkit] [" + moduleName + "] Paperkit was not found!");
    return;
  }

  //start initializing the module, defining functions and variables and such.



  //add the components with it's variables and functions to the md namespace
  md.log = {};
})();
