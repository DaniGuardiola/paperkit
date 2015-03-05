/* global Paperkit, scrollCollapse, isMobile */
/* exported lastScrollY */
var lastScrollY = 0;
var topScrollY = 0;
var paperkit = new Paperkit(); // Instantiate Paperkit on a variable of your choice
window.addEventListener("load", function() {
  paperkit.init(); // Initialize Paperkit on window load
  if (scrollCollapse) {
    var el;
    if (scrollCollapse.nodeType) {
      el = scrollCollapse;
    } else if (scrollCollapse === true) {
      el = paperkit.content;
    } else {
      el = document.querySelector(scrollCollapse);
    }
    el.addEventListener("scroll", function() {
      var rowSize;
      if (isMobile()) {
        rowSize = 56;
      } else {
        rowSize = 64;
      }
      var toolbarSize = rowSize + 48;
      var scroll = el.scrollTop;
      console.log("SCROLL: " + scroll);
      console.log("TOP: " + topScrollY);
      if (scroll > topScrollY) {
        // Scrolling down
        console.log("DOWN: " + (scroll - topScrollY));
        if (scroll - topScrollY > rowSize) {
          paperkit.toolbar.style.height = "48px";
          topScrollY = scroll - rowSize;
          console.log("1");
        } else {
          paperkit.toolbar.style.height = toolbarSize - (scroll - topScrollY) + "px";
          console.log("2");
        }
      } else {
        // Scrolling up
        console.log("UP");
        topScrollY = scroll;
        paperkit.toolbar.style.height = toolbarSize + "px";
      }
      /*
      			if (scroll > topScrollY + toolbarSize) {
      				paperkit.toolbar.style.height = "48px";
      			} else if (scroll > topScrollY - toolbarSize) {
      				paperkit.toolbar.style.height = (topScrollY - scroll) + "px";
      				console.log("HEIGHT: "+paperkit.toolbar.style.height);
      			} else {
      				if (isMobile()) {
      					paperkit.toolbar.style.height = toolbarSize + "px";					
      				} else {
      					paperkit.toolbar.style.height = toolbarSize + "px";
      				}
      			}*/
    });
  }
});
