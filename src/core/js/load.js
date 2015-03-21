/**
 * The code that gets executed at the very end of the core load
 */
(function() {
  "use strict";
  md.load(); // How to load when all modules and components are included? Initialization needs those

  // DEBUG! TEMPORAL!
  md.log("After load:", "debug");
  md.log(md, "dir");
}());
window.addEventListener("md-load", function() {
  md.log("MD-LOAD EVENT FIRED", "info");
});
