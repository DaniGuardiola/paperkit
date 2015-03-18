/**
 * The code that gets executed at the very end of the core load
 */
(function() {
  "use strict";
  window.addEventListener("load", function() {
    md.load();
  });

  // DEBUG! TEMPORAL!
  md.log("After load: ", "debug");
  console.log(md);
}());
