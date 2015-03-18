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
  function dispatchLoadEvent(){
    var loadEvent = new Event("md-load");
    window.dispatchEvent(loadEvent);
  }

  window.md = {
    load: function() {
      md.log("[core] Loaded", "info");
      // Init body
      if (document.body.classList.contains("md-init")) {
        // md.init(document.body);
      }
      dispatchLoadEvent();
    }
  };

  // DEBUG! TEMPORAL!
  console.log("PK[debug] Before load: ", md);
}());