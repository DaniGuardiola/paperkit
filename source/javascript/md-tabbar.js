var initMDTabBar = function(MDTabBar) {
  MDTabBar.width = 0;
  MDTabBar.selector = null;

  MDTabBar.clickHandler= function(e) {
    var el = e.currentTarget;
    console.log(sprintf("CALLED CLICK HANDLER ON %s", (el.id ? el.id : el.tagName)));
  };

  MDTabBar.moveIndicatorToTab= function(tabNumber) {
    var tabBarRect = MDTabBar.getBoundingClientRect();
    var tabs = MDTabBar.getElementsByTagName("md-tab");
    var newLeft = tabNumber * MDTabBar.width;
    var newRight = (((tabs.length - tabNumber - 1) * MDTabBar.width));
    if(parseInt(MDTabBar.selector.style.left) < newLeft) {
      MDTabBar.selector.style.transition = "right 0.25s ease-out, left 0.25s ease-out 0.12s";
    } else {
      MDTabBar.selector.style.transition = "left 0.25s ease-out, right 0.25s ease-out 0.12s";
    }
    
    MDTabBar.selector.style.left =  newLeft + "px";
    MDTabBar.selector.style.right =  newRight + "px";
  }

  MDTabBar.setTabsEqualWidth= function() {
    var tabs = MDTabBar.getElementsByTagName("md-tab");
    [].forEach.call(tabs, function(tab) { 
      MDTabBar.width = tab.getBoundingClientRect().width > MDTabBar.width ? tab.getBoundingClientRect().width : MDTabBar.width; 
    });

    
    [].forEach.call(tabs, function(tab) {
      tab.style.flex = "1";
    });
    
    MDTabBar.style.minWidth = (MDTabBar.width * tabs.length) + "px";

  }

  MDTabBar.injectSelector= function() {
    if(!MDTabBar.selector) {
      MDTabBar.selector = document.createElement('div');
      MDTabBar.selector.id="selector";
      MDTabBar.appendChild(MDTabBar.selector);
    }
  }

  MDTabBar.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  // Init tabs
  MDTabBar.injectSelector();
  MDTabBar.setTabsEqualWidth();

  // INIT OBSERVER
  var observer = new MutationObserver(function(mutations) { 
      mutations.forEach(function(mutation) {
        var element = mutation.target;
        element.attributeChangedCallback(mutation.attributeName, mutation.oldvalue, element.getAttribute(mutation.attributeName));
      });
  });

  var config = { attributes: true, childList: false, characterData: false };
  observer.observe(MDTabBar, config);
}