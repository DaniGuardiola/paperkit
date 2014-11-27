var initMDTabBar = function(MDTabBar) {
  MDTabBar.width = 0;
  MDTabBar.selector = null;
  MDTabBar.tabs = MDTabBar.getElementsByTagName("md-tab");
  MDTabBar.selected = 0;



  MDTabBar.callFunction= function(f, target) {
    console.log("calling function " + f);
    executeFunctionByName(f, window, [ target ]);
  }

  MDTabBar.clickHandler= function(e) {
    var el = e.currentTarget;
    if(el.tagName==="MD-TAB") {
      var action = el.getAttribute("md-action") ? el.getAttribute('md-action') : 'none';

      if(action==='none') {
        /* Nothing to do */
      } else if(action==='showpage') {
        MDTabBar.showPage(el.index);
      } else {
        if(action.indexOf('custom:') != -1) {
          var f = action.substring(action.indexOf('custom:') + 'custom:'.length).trim();
          MDTabBar.callFunction(f, el);
        }
        MDTabBar.showPage(el.index);
      }

      MDTabBar.moveIndicatorToTab(el.index);
    }
  };

  MDTabBar.moveIndicatorToTab= function(tabNumber) {
    var tabBarRect = MDTabBar.getBoundingClientRect();
    var newLeft = tabNumber * MDTabBar.width;
    var newRight = (((MDTabBar.tabs.length - tabNumber - 1) * MDTabBar.width));
    if(parseInt(MDTabBar.selector.style.left) < newLeft) {
      MDTabBar.selector.style.transition = "right 0.25s ease-out, left 0.25s ease-out 0.12s";
    } else {
      MDTabBar.selector.style.transition = "left 0.25s ease-out, right 0.25s ease-out 0.12s";
    }
    
    MDTabBar.selector.style.left =  newLeft + "px";
    MDTabBar.selector.style.right =  newRight + "px";
  }

  MDTabBar.showPage=function(tabNumber) {
    var rel = MDTabBar.getAttribute('md-rel');
    [].forEach.call(MDTabBar.tabs, function(tab, index) {
      var page = document.querySelector('*:not(md-tabbar)[md-rel=' + rel + '] md-page[md-tab=' + tab.getAttribute('md-page') + ']');
      var position = index - tabNumber;
      page.style.left=(position * 100) + "%";
    });
  }

  MDTabBar.initTabs= function() {
    [].forEach.call(MDTabBar.tabs, function(tab, index) { 
      MDTabBar.width = tab.getBoundingClientRect().width > MDTabBar.width ? tab.getBoundingClientRect().width : MDTabBar.width;
    });

    [].forEach.call(MDTabBar.tabs, function(tab, index) { 
      tab.style.flex = "1";
      tab.index=index;
      tab.addEventListener('click', MDTabBar.clickHandler);
    });

    MDTabBar.style.minWidth = (MDTabBar.width * MDTabBar.tabs.length) + "px";
  }

  MDTabBar.injectSelector= function() {
    if(!MDTabBar.selector) {
      MDTabBar.selector = document.createElement('div');
      MDTabBar.selector.id="selector";
      if (MDTabBar.getAttribute('md-selector-color')) {
        MDTabBar.selector.style.backgroundColor = MDTabBar.getAttribute('md-selector-color');
      }
      MDTabBar.appendChild(MDTabBar.selector);
    }
  }

  MDTabBar.attributeChangedCallback = function(attrname, oldvalue, newvalue) {
    console.log("CHANGED ATTRIBUTE " + attrname + " VALUE " + newvalue);
  };

  // Init tabs
  MDTabBar.injectSelector();
  MDTabBar.initTabs();
  MDTabBar.showPage(0);
  MDTabBar.moveIndicatorToTab(0);

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